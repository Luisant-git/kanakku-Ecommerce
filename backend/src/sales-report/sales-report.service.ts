import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SalesReportFilterDto } from './dto/sales-report-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesReportService {
  constructor(private prisma: PrismaService) {}

  async getSalesReport(filters: SalesReportFilterDto) {
    const whereClause: Prisma.OrderWhereInput = {};
    let monthOnlyFilter: number | null = null;

    // Status filter
    if (filters.status) {
      whereClause.status = filters.status;
    }

    // Product filter
    if (filters.productId) {
      whereClause.items = {
        some: {
          productId: parseInt(filters.productId)
        }
      };
    }

    // Date filters
    if (filters.date) {
      const startDate = new Date(filters.date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      whereClause.createdAt = {
        gte: startDate,
        lt: endDate
      };
    } else if (filters.year && filters.month) {
      const year = parseInt(filters.year);
      const month = parseInt(filters.month);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate
      };
    } else if (filters.month && !filters.year) {
      // Filter by month across all years using raw SQL
      monthOnlyFilter = parseInt(filters.month);
    } else if (filters.year) {
      const year = parseInt(filters.year);
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      
      whereClause.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    let orders;
    
    // Handle month-only filter with raw SQL
    if (monthOnlyFilter) {
      const month = monthOnlyFilter;
      
      const rawOrders = await this.prisma.$queryRaw<{id: number}[]>`
        SELECT o.id
        FROM "Order" o
        WHERE EXTRACT(MONTH FROM o."createdAt") = ${month}
        ${filters.status ? Prisma.sql`AND o.status = ${filters.status}` : Prisma.empty}
        ${filters.productId ? Prisma.sql`AND EXISTS (
          SELECT 1 FROM "OrderItem" oi 
          WHERE oi."orderId" = o.id AND oi."productId" = ${parseInt(filters.productId)}
        )` : Prisma.empty}
        ORDER BY o."createdAt" DESC
      `;
      
      // Get full order data with relations for the filtered orders
      const orderIds = rawOrders.map(order => order.id);
      orders = await this.prisma.order.findMany({
        where: { id: { in: orderIds } },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true
                }
              },
              version: {
                select: {
                  version: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      orders = await this.prisma.order.findMany({
        where: whereClause,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true
                }
              },
              version: {
                select: {
                  version: true
                }
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    // Calculate summary
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalQuantity = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    return {
      summary: {
        totalOrders,
        totalRevenue,
        totalQuantity
      },
      orders: orders.map(order => ({
        id: order.id,
        orderDate: order.createdAt,
        customer: {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email
        },
        status: order.status,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        items: order.items.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          version: item.version?.version,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        }))
      }))
    };
  }
}