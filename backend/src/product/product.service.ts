import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaymentRenewal } from '@prisma/client';
import { PurchaseHistoryService } from '../order/purchase-history.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private purchaseHistoryService: PurchaseHistoryService
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { price = 0, priceRenewal, paymentRenewal, ...productData } = createProductDto;
    
    const product = await this.prisma.product.create({
      data: productData,
    });

    // Create default versions for the product
    await this.prisma.productVersion.createMany({
      data: [
        {
          productId: product.id,
          version: 'SINGLE_USER',
          price: Number(price),
          renewalPrice: priceRenewal ? Number(priceRenewal) : null,
          paymentRenewal: (paymentRenewal as PaymentRenewal) || PaymentRenewal.ONE_TIME,
          isDefault: false
        },
        {
          productId: product.id,
          version: 'MULTI_USER',
          price: Number(price) * 1.5,
          renewalPrice: priceRenewal ? Number(priceRenewal) * 1.5 : null,
          paymentRenewal: (paymentRenewal as PaymentRenewal) || PaymentRenewal.ONE_TIME,
          isDefault: true
        }
      ]
    });

    return this.prisma.product.findUnique({
      where: { id: product.id },
      include: { versions: true }
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: { versions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { versions: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    const data = {
      ...updateProductDto,
      ...(updateProductDto.paymentRenewal && { paymentRenewal: updateProductDto.paymentRenewal as PaymentRenewal }),
    };

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getUserRenewalDate(userId: number, productId: number) {
    const renewalDate = await this.purchaseHistoryService.getUserNextRenewalDate(userId, productId);
    return { nextRenewalDate: renewalDate };
  }
}
