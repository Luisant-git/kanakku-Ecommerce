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

  private calculateNextRenewalDate(purchaseDate: Date, paymentRenewal: any): Date | undefined {
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
        product: { include: { versions: true } },
        version: true,
        order: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!lastPurchase) {
      return null;
    }
    
    const version = lastPurchase.version || lastPurchase.product.versions.find(v => v.isDefault) || lastPurchase.product.versions[0];
    
    if (version?.paymentRenewal === 'ONE_TIME') {
      return null;
    }

    // If nextRenewalDate is stored, return it
    if (lastPurchase.nextRenewalDate) {
      return lastPurchase.nextRenewalDate;
    }

    // Otherwise calculate it from the order creation date
    return this.calculateNextRenewalDate(lastPurchase.order.createdAt, version?.paymentRenewal) || null;
  }

  async calculatePrice(userId: number, productId: number): Promise<{ price: number; isRenewal: boolean; nextRenewalDate?: Date }> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { versions: true }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const defaultVersion = product.versions.find(v => v.isDefault) || product.versions[0];
    if (!defaultVersion) {
      throw new Error('No product version found');
    }

    const hasPurchased = await this.hasUserPurchasedProduct(userId, productId);
    const currentDate = new Date();
    
    if (hasPurchased) {
      if (defaultVersion.paymentRenewal === 'ONE_TIME') {
        throw new Error('Product already purchased and is one-time only');
      }
      
      const nextRenewalDate = this.calculateNextRenewalDate(currentDate, defaultVersion.paymentRenewal);
      return {
        price: defaultVersion.renewalPrice || defaultVersion.price,
        isRenewal: true,
        nextRenewalDate
      };
    }

    const nextRenewalDate = this.calculateNextRenewalDate(currentDate, defaultVersion.paymentRenewal);
    return {
      price: defaultVersion.price,
      isRenewal: false,
      nextRenewalDate
    };
  }
}