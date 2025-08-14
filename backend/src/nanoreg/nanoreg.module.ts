import { Module } from '@nestjs/common';
import { NanoregService } from './nanoreg.service';
import { NanoregController } from './nanoreg.controller';
import { MysqlModule } from 'src/database/mysql.module';

@Module({
  imports: [MysqlModule],
  controllers: [NanoregController],
  providers: [NanoregService],
})
export class NanoregModule {}
