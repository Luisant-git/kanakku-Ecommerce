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
    let cart = await this.prisma.cart.findFirst({ where: { userId } });
    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }
    let cartItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.productId },
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
            product: true, // make sure product has `price`
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
    const itemsWithPricing = [];
    
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
