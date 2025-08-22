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
        orders: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      joined: user.createdAt,
      orders: user.orders.map(order => ({
        id: order.id,
        date: order.createdAt.toISOString().split('T')[0],
        amount: order.total,
        status: order.status
      })),
      totalSpent
    };
  }
}
