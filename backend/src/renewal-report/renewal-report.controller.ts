import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RenewalReportService } from './renewal-report.service';
import { RenewalReportFilterDto } from './dto/renewal-report-filter.dto';

@ApiTags('Renewal Report')
@Controller('renewal-report')
export class RenewalReportController {
  constructor(private readonly renewalReportService: RenewalReportService) {}

  @Get('pending')
  @ApiOperation({ summary: 'Get pending renewal report for expired products' })
  @ApiQuery({ name: 'productId', required: false, type: 'string' })
  @ApiResponse({ status: 200, description: 'Pending renewal report retrieved successfully' })
  async getPendingRenewalReport(@Query() filters: RenewalReportFilterDto) {
    return this.renewalReportService.getPendingRenewalReport(filters);
  }
}