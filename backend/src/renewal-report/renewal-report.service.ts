import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RenewalReportFilterDto } from './dto/renewal-report-filter.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RenewalReportService {
  constructor(private prisma: PrismaService) {}

  async getPendingRenewalReport(filters: RenewalReportFilterDto) {
    const whereClause: Prisma.OrderItemWhereInput = {
      nextRenewalDate: {
        lt: new Date() // Expired items
      },
      isRenewal: false // Not yet renewed
    };

    if (filters.productId) {
      whereClause.productId = parseInt(filters.productId);
    }

    const expiredItems = await this.prisma.orderItem.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true
          }
        },
        version: {
          select: {
            version: true,
            renewalPrice: true
          }
        },
        order: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: { nextRenewalDate: 'asc' }
    });

    const totalExpiredItems = expiredItems.length;
    const totalPotentialRevenue = expiredItems.reduce((sum, item) => 
      sum + (item.version?.renewalPrice || item.price), 0
    );

    return {
      summary: {
        totalExpiredItems,
        totalPotentialRevenue
      },
      expiredItems: expiredItems.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        version: item.version?.version,
        originalPrice: item.price,
        renewalPrice: item.version?.renewalPrice || item.price,
        quantity: item.quantity,
        purchaseDate: item.createdAt,
        expiryDate: item.nextRenewalDate,
        daysSinceExpiry: item.nextRenewalDate ? Math.floor((new Date().getTime() - new Date(item.nextRenewalDate).getTime()) / (1000 * 60 * 60 * 24)) : 0,
        customer: {
          id: item.order.user.id,
          name: item.order.user.name,
          email: item.order.user.email,
          phone: item.order.user.phone
        },
        orderId: item.orderId
      }))
    };
  }
}