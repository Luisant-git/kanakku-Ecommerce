import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
    });
    return users.map(({ _count, ...user }) => ({
      ...user,
      orders: _count.orders,
    }));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            items: {
              include: {
                product: {
                  include: {
                    versions: true
                  }
                },
                version: true
              }
            }
          }
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
    
    // Get purchased products with renewal info
    const purchasedProducts = [];
    const productMap = new Map();
    
    user.orders.forEach(order => {
      if (order.status === 'COMPLETED') {
        order.items.forEach(item => {
          const key = `${item.productId}-${item.versionId}`;
          if (!productMap.has(key)) {
            const nextRenewal = this.calculateNextRenewal(order.createdAt, item.version?.paymentRenewal || 'ONE_TIME');
            const upgradeOption = this.getUpgradeOption(item.product, item.version);
            
            productMap.set(key, {
              productId: item.productId,
              productName: item.product.name,
              version: item.version?.version || 'N/A',
              price: item.price,
              purchaseDate: order.createdAt,
              nextRenewalDate: nextRenewal,
              paymentRenewal: item.version?.paymentRenewal,
              orderId: order.id,
              upgradeOption
            });
          }
        });
      }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      joined: user.createdAt,
      orders: user.orders.map(order => ({
        id: order.id,
        date: order.createdAt.toISOString().split('T')[0],
        amount: order.total,
        status: order.status,
        items: order.items
      })),
      totalSpent,
      purchasedProducts: Array.from(productMap.values())
    };
  }

  private calculateNextRenewal(purchaseDate: Date, paymentRenewal: string): Date | null {
    if (paymentRenewal === 'ONE_TIME') return null;
    
    const nextRenewal = new Date(purchaseDate);
    if (paymentRenewal === 'MONTHLY') {
      nextRenewal.setMonth(nextRenewal.getMonth() + 1);
    } else if (paymentRenewal === 'YEARLY') {
      nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
    }
    return nextRenewal;
  }

  private getUpgradeOption(product: any, currentVersion: any) {
    if (!currentVersion || currentVersion.version === 'MULTI_USER') return null;
    
    const multiUserVersion = product.versions.find(v => v.version === 'MULTI_USER');
    if (!multiUserVersion) return null;
    
    const priceDifference = multiUserVersion.price - currentVersion.price;
    return {
      toVersion: 'MULTI_USER',
      additionalCost: priceDifference,
      newPrice: multiUserVersion.price
    };
  }
}
