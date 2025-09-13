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
    const data = {
      ...createProductDto,
      priceRenewal: createProductDto.priceRenewal || null,
      paymentRenewal: createProductDto.paymentRenewal as PaymentRenewal || PaymentRenewal.ONE_TIME,
    };
    return this.prisma.product.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
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
