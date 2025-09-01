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

  async calculatePrice(userId: number, productId: number): Promise<{ price: number; isRenewal: boolean }> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const haspurchased = await this.hasUserPurchasedProduct(userId, productId);
    
    if (haspurchased && product.priceRenewal) {
      return {
        price: product.priceRenewal,
        isRenewal: true
      };
    }

    return {
      price: product.price,
      isRenewal: false
    };
  }
}