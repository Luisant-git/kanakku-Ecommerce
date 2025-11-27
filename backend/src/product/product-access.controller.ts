import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('product-access')
export class ProductAccessController {
  constructor(private prisma: PrismaService) {}



  @Get('debug/:userId')
  async debugUserOrders(@Param('userId') userId: string) {
    console.log('Debug userId:', userId);
    const orders = await this.prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                productSource: true,
                productSourceType: true,
              },
            },
          },
        },
      },
    });
    return { orders, userId, userIdType: typeof userId };
  }

  @Get(':productId/download-access')
  async checkDownloadAccess(
    @Param('productId') productId: string,
    @Query('userId') userId: string,
  ) {
    console.log(
      'Checking download access for productId:',
      productId,
      'userId:',
      userId,
    );

    if (!userId) {
      return { hasAccess: false, error: 'User ID required' };
    }

    const completedPurchase = await this.prisma.orderItem.findFirst({
      where: {
        productId: parseInt(productId),
        order: {
          userId: parseInt(userId),
          status: 'COMPLETED',
        },
      },
      include: {
        product: {
          select: {
            productSource: true,
            productSourceType: true,
          },
        },
        version: true,
        order: {
          select: {
            status: true,
            userId: true,
          },
        },
      },
    });

    console.log('Found completed purchase:', completedPurchase);

    return {
      hasAccess: !!completedPurchase,
      productSource: completedPurchase?.product?.productSource,
      productSourceType: completedPurchase?.product?.productSourceType,
      licenseNo: completedPurchase?.licenseNo || null,
      purchasedVersionType: completedPurchase?.version?.version,
      purchasedVersionId: completedPurchase?.versionId,
      debug: {
        productId: parseInt(productId),
        userId: parseInt(userId),
        foundPurchase: !!completedPurchase,
      },
    };
  }
}
