import { Module } from '@nestjs/common';
import { RenewalReportController } from './renewal-report.controller';
import { RenewalReportService } from './renewal-report.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RenewalReportController],
  providers: [RenewalReportService],
})
export class RenewalReportModule {}