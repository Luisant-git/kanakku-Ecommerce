import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  // async create(userId: number, createOrderDto: CreateOrderDto) {
  //   const { items, shippingAddress, paymentMethod } = createOrderDto;

  //   // Calculate total
  //   let total = 0;
  //   const orderItems: Array<{
  //     productId: number;
  //     quantity: number;
  //     price: number;
  //   }> = [];

  //   for (const item of items) {
  //     const product = await this.prisma.product.findUnique({
  //       where: { id: item.productId },
  //     });

  //     if (!product) {
  //       throw new NotFoundException(`Product with ID ${item.productId} not found`);
  //     }

  //     total += product.price * item.quantity;
  //     orderItems.push({
  //       productId: item.productId,
  //       quantity: item.quantity,
  //       price: product.price,
  //     });
  //   }

  //   // Create order with items
  //   const order = await this.prisma.order.create({
  //     data: {
  //       userId,
  //       total,
  //       shippingAddress,
  //       paymentMethod,
  //       items: {
  //         create: orderItems,
  //       },
  //     },
  //     include: {
  //       items: {
  //         include: {
  //           product: true,
  //         },
  //       },
  //       user: {
  //         select: {
  //           id: true,
  //           email: true,
  //           name: true,
  //         },
  //       },
  //     },
  //   });

  //   // Clear user's cart after order creation
  //   const cart = await this.prisma.cart.findFirst({
  //     where: { userId },
  //   });

  //   if (cart) {
  //     await this.prisma.cartItem.deleteMany({
  //       where: { cartId: cart.id },
  //     });
  //   }

  //   return order;
  // }

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const { shippingAddress, paymentMethod } = createOrderDto;

    // Get cart details (including subtotal, tax, total, items)
    const cart = await this.cartService.getCart(userId);

    if (!cart || !cart.items.length) {
      throw new BadRequestException('Cart is empty.');
    }

    // Create order using cart values
    const order = await this.prisma.order.create({
      data: {
        userId,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
        shippingAddress,
        paymentMethod,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, // use stored price from product
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    // Clear user's cart after placing order
    const userCart = await this.prisma.cart.findFirst({
      where: { userId },
    });

    if (userCart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });
    }

    return {
      ...order,
      subtotal: cart.subtotal,
      tax: cart.tax,
      total: cart.total,
    };
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.order.delete({
      where: { id },
    });
  }
}
