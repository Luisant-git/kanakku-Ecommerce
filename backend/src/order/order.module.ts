import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CartService } from 'src/cart/cart.service';
import { CartModule } from 'src/cart/cart.module';
import { NanoregModule } from 'src/nanoreg/nanoreg.module';
import { PurchaseHistoryService } from './purchase-history.service';

@Module({
  imports: [PrismaModule, CartModule, NanoregModule],
  controllers: [OrderController],
  providers: [OrderService, CartService, PurchaseHistoryService],
})
export class OrderModule {}
