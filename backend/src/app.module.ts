import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';

import { OrderModule } from './order/order.module';
import { MysqlModule } from './database/mysql.module';
import { NanoregModule } from './nanoreg/nanoreg.module';
import { CustomerModule } from './customer/customer.module';

import { SalesReportModule } from './sales-report/sales-report.module';
import { RenewalReportModule } from './renewal-report/renewal-report.module';

@Module({
  imports: [AuthModule, ProductModule, UploadModule, OrderModule, MysqlModule, NanoregModule, CustomerModule, SalesReportModule, RenewalReportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
