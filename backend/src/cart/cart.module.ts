import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PurchaseHistoryService } from '../order/purchase-history.service';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [CartService, PurchaseHistoryService],
  exports: [CartService],
})
export class CartModule {}
