import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductAccessController } from './product-access.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PurchaseHistoryService } from '../order/purchase-history.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController, ProductAccessController],
  providers: [ProductService, PurchaseHistoryService],
})
export class ProductModule {}
