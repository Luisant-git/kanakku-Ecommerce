import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { NanoregService } from '../nanoreg/nanoreg.service';
import { PurchaseHistoryService } from './purchase-history.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
    private nanoregService: NanoregService,
    private purchaseHistoryService: PurchaseHistoryService,
  ) {}

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
          create: await Promise.all(
            cart.items.map(async (item: any) => {
              const { price, isRenewal, nextRenewalDate } = await this.purchaseHistoryService.calculatePrice(userId, item.productId);
              const version = await this.prisma.productVersion.findUnique({ where: { id: item.versionId } });
              return {
                productId: item.productId,
                versionId: item.versionId,
                quantity: item.quantity,
                price,
                isRenewal,
                nextRenewalDate,
                licenseNo: this.generateNumericLicenseNumber(item.productId, userId),
              };
            })
          ),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            version: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            company: true,
            gstin: true,
            address: true,
            state: true,
            city: true,
            pincode: true,
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

    // Send to nanoreg service for each item
    try {
      await Promise.all(
        order.items.map(async (item) => {
          await this.nanoregService.create({
            Name: order.user.name || undefined,
            Company: order.user.company || undefined,
            Email: order.user.email || undefined,
            RegisterDate: new Date(),
            MobileNo: order.user.phone || undefined,
            State: order.user.state || undefined,
            Address: order.user.address || order.shippingAddress,
            Area: order.user.city || undefined,
            Pincode: order.user.pincode || undefined,
            GSTIN: order.user.gstin || undefined,
            Active: 'Y',
            IsPaid: 'Y',
            PaymentDet: order.paymentMethod || undefined,
            ActivatedOn: new Date().toISOString(),
            
            PaidAmt: item.price || undefined,
            ValidUpTo: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            ReceiptDate: new Date(),
            InvNo: order.id || undefined,
            InvDate: new Date(),
            IsSurrendered: 'N',
            DueAmt: 0,
            IsMultiUser: item.version?.version === 'MULTI_USER' ? 'Y' : 'N',
            IsServer: 'N',
            IsAPIClient: 0,
            IsLocalSales: 'Y',
            license_no: item.licenseNo || undefined,
            IsAccountsfirst: 'Y',
            IsFinancialStatement: 'Y'
          });
        })
      );
    } catch (error) {
      console.error('Failed to send to nanoreg:', error.message);
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
            version: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
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
            version: true,
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
            version: true,
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

  async totalOrders() {
    return this.prisma.order.count();
  }
  
  //calculate only status completed orders sales amount
  async totalSales() {
    const completedOrders = await this.prisma.order.findMany({
      where: { status: 'COMPLETED' },
    });

    let totalSales = 0;
    completedOrders.forEach((order) => {
      totalSales += order.total;
    });

    return totalSales;
  }

  // total pending orders
  async totalPendingOrders() {
    return this.prisma.order.count({
      where: { status: 'PENDING' },
    });
  }

  async totalCompletedOrders() {
    return this.prisma.order.count({
      where: { status: 'COMPLETED' },
    });
  }

  async totalCancelledOrders() {
    return this.prisma.order.count({
      where: { status: 'CANCELLED' },
    });
  }


 //total Revenue By Month Of CurrentYear, if not that month started send as null
  private generateNumericLicenseNumber(productId: number, userId: number): number {
    const timestamp = Date.now().toString().slice(-6);
    const productCode = productId.toString().padStart(2, '0');
    const userCode = userId.toString().padStart(3, '0');
    return parseInt(`${productCode}${userCode}${timestamp}`);
  }

  async totalRevenueByMonthOfCurrentYear() {
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const revenueByMonth = await Promise.all(
      months.map(async (month) => {
        const startOfMonth = new Date(currentYear, month - 1, 1);
        const endOfMonth = new Date(currentYear, month, 0);

        const completedOrders = await this.prisma.order.findMany({
          where: {
            status: 'COMPLETED',
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        let totalRevenue = 0;
        completedOrders.forEach((order) => {
          totalRevenue += order.total;
        });

        return totalRevenue;
      }),
    );

    return revenueByMonth;
  }
}
