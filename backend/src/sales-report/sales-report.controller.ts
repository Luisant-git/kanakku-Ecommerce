import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SalesReportService } from './sales-report.service';
import { SalesReportFilterDto } from './dto/sales-report-filter.dto';

@ApiTags('Sales Report')
@Controller('sales-report')
export class SalesReportController {
  constructor(private readonly salesReportService: SalesReportService) {}

  @Get()
  @ApiOperation({ summary: 'Get sales report with optional filters' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'COMPLETED', 'CANCELLED'] })
  @ApiQuery({ name: 'productId', required: false, type: 'string' })
  @ApiQuery({ name: 'year', required: false, type: 'string' })
  @ApiQuery({ name: 'month', required: false, type: 'string' })
  @ApiQuery({ name: 'date', required: false, type: 'string', format: 'date' })
  @ApiResponse({ status: 200, description: 'Sales report retrieved successfully' })
  async getSalesReport(@Query() filters: SalesReportFilterDto) {
    return this.salesReportService.getSalesReport(filters);
  }
}