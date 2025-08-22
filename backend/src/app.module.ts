import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { MysqlModule } from './database/mysql.module';
import { NanoregModule } from './nanoreg/nanoreg.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [AuthModule, ProductModule, UploadModule, CartModule, OrderModule, MysqlModule, NanoregModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
