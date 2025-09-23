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

  async create(createProductDto: any) {
    const { versions, ...productData } = createProductDto;
    
    const product = await this.prisma.product.create({
      data: productData,
    });

    // Create versions from admin form data
    if (versions && versions.length > 0) {
      await this.prisma.productVersion.createMany({
        data: versions.map(version => ({
          productId: product.id,
          version: version.version,
          price: Number(version.price),
          renewalPrice: version.renewalPrice ? Number(version.renewalPrice) : null,
          paymentRenewal: version.paymentRenewal as PaymentRenewal,
          isDefault: version.isDefault
        }))
      });
    }

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

  async update(id: number, updateProductDto: any) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    const { versions, ...productData } = updateProductDto;

    // Update product basic info
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: productData,
    });

    // Update versions if provided
    if (versions && versions.length > 0) {
      // Delete existing versions
      await this.prisma.productVersion.deleteMany({
        where: { productId: id }
      });
      
      // Create new versions
      await this.prisma.productVersion.createMany({
        data: versions.map(version => ({
          productId: id,
          version: version.version,
          price: Number(version.price),
          renewalPrice: version.renewalPrice ? Number(version.renewalPrice) : null,
          paymentRenewal: version.paymentRenewal as PaymentRenewal,
          isDefault: version.isDefault
        }))
      });
    }

    return this.prisma.product.findUnique({
      where: { id },
      include: { versions: true },
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
