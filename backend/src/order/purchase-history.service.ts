import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PurchaseHistoryService {
  constructor(private prisma: PrismaService) {}

  async hasUserPurchasedProduct(userId: number, productId: number): Promise<boolean> {
    const existingPurchase = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'COMPLETED'
        }
      }
    });
    return !!existingPurchase;
  }

  private calculateNextRenewalDate(purchaseDate: Date, paymentRenewal: string): Date | undefined {
    if (paymentRenewal === 'ONE_TIME') return undefined;
    
    const nextRenewal = new Date(purchaseDate);
    if (paymentRenewal === 'MONTHLY') {
      nextRenewal.setMonth(nextRenewal.getMonth() + 1);
    } else if (paymentRenewal === 'YEARLY') {
      nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);
    }
    return nextRenewal;
  }

  async getUserNextRenewalDate(userId: number, productId: number): Promise<Date | null> {
    const lastPurchase = await this.prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'COMPLETED'
        }
      },
      include: {
        product: true,
        order: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!lastPurchase || lastPurchase.product.paymentRenewal === 'ONE_TIME') {
      return null;
    }

    // If nextRenewalDate is stored, return it
    if (lastPurchase.nextRenewalDate) {
      return lastPurchase.nextRenewalDate;
    }

    // Otherwise calculate it from the order creation date
    return this.calculateNextRenewalDate(lastPurchase.order.createdAt, lastPurchase.product.paymentRenewal) || null;
  }

  async calculatePrice(userId: number, productId: number): Promise<{ price: number; isRenewal: boolean; nextRenewalDate?: Date }> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const hasPurchased = await this.hasUserPurchasedProduct(userId, productId);
    const currentDate = new Date();
    
    if (hasPurchased) {
      if (product.paymentRenewal === 'ONE_TIME') {
        throw new Error('Product already purchased and is one-time only');
      }
      
      const nextRenewalDate = this.calculateNextRenewalDate(currentDate, product.paymentRenewal);
      return {
        price: product.priceRenewal || product.price,
        isRenewal: true,
        nextRenewalDate
      };
    }

    const nextRenewalDate = this.calculateNextRenewalDate(currentDate, product.paymentRenewal);
    return {
      price: product.price,
      isRenewal: false,
      nextRenewalDate
    };
  }
}