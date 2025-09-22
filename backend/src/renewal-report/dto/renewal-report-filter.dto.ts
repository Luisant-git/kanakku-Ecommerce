import { IsOptional, IsString } from 'class-validator';

export class RenewalReportFilterDto {
  @IsOptional()
  @IsString()
  productId?: string;
}