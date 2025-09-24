import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { PurchaseHistoryService } from '../order/purchase-history.service';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private purchaseHistoryService: PurchaseHistoryService
  ) {}

  async addToCart(userId: number, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      include: { versions: true }
    });
    
    if (!product) {
      throw new Error('Product not found');
    }

    // Validate that the specified version exists for this product
    const selectedVersion = product.versions.find(v => v.id === dto.versionId);
    if (!selectedVersion) {
      throw new Error('Invalid version selected for this product');
    }

    const hasPurchased = await this.purchaseHistoryService.hasUserPurchasedProduct(userId, dto.productId);
    
    if (hasPurchased && selectedVersion?.paymentRenewal === 'ONE_TIME') {
      throw new Error('This product can only be purchased once');
    }

    let cart = await this.prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }
    let cartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId, versionId: dto.versionId },
    });
    if (cartItem) {
      cartItem = await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + dto.quantity },
      });
    } else {
      cartItem = await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          versionId: dto.versionId,
          quantity: dto.quantity,
        },
      });
    }
    return cartItem;
  }

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: { include: { versions: true } },
            version: true
          },
        },
      },
    });

    if (!cart) {
      return {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      };
    }

    // Calculate subtotal with renewal pricing
    let subtotal = 0;
    const itemsWithPricing: any[] = [];
    
    for (const item of cart.items) {
      const { price, isRenewal } = await this.purchaseHistoryService.calculatePrice(userId, item.productId);
      subtotal += price * item.quantity;
      itemsWithPricing.push({
        ...item,
        effectivePrice: price,
        isRenewal
      });
    }

    // Example tax rate: 10%
    const taxRate = 0.1;
    const tax = subtotal * taxRate;

    const total = subtotal + tax;

    return {
      ...cart,
      items: itemsWithPricing,
      subtotal,
      tax,
      total,
    };
  }

  async removeFromCart(userId: number, productId: number) {
    const cart = await this.prisma.cart.findFirst({ where: { userId } });
    if (!cart) return null;
    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    });
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findFirst({ where: { userId } });
    if (!cart) return null;
    return this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  async countCartItems(userId: number) {
    // Find the user's cart
    const cart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    // If no cart exists for the user, return 0
    if (!cart) return 0;

    // Count how many items are in the cart
    const count = await this.prisma.cartItem.count({
      where: { cartId: cart.id },
    });

    return count;
  }
}
