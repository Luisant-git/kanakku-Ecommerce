import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaModule } from '../prisma/prisma.module';

import { NanoregModule } from 'src/nanoreg/nanoreg.module';
import { PurchaseHistoryService } from './purchase-history.service';

@Module({
  imports: [PrismaModule, NanoregModule],
  controllers: [OrderController],
  providers: [OrderService, PurchaseHistoryService],
})
export class OrderModule {}
