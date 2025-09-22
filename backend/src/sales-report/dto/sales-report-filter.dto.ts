import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class SalesReportFilterDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  productId?: string;

  @IsOptional()
  year?: string;

  @IsOptional()
  month?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}