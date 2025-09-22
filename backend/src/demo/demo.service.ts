import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DemoService {
  constructor(private prisma: PrismaService) {}

  async recordDemoDownload(userId: number, productId: number) {
    return this.prisma.demoDownload.upsert({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      update: {
        createdAt: new Date(),
      },
      create: {
        userId,
        productId,
      },
    });
  }

  async getAllDemoDownloads(userId: number) {
    return this.prisma.demoDownload.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getAllDemoDownloadsForAdmin() {
    return this.prisma.demoDownload.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}