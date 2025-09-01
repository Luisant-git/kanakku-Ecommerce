import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { PaymentRenewal } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: ['Product Image URL'],
    required: false,
    type: [String],
  })
  imageUrl: string[];

  @ApiProperty({ example: 'Product Description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 100.0 })
  price: number;

  @ApiProperty({ example: 50.0, required: false })
  @IsOptional()
  @IsNumber()
  priceRenewal?: number;

  @ApiProperty({ example: 'https://example.com/product', required: false })
  @IsOptional()
  @IsString()
  productSource?: string;

  @ApiProperty({ example: 'url', required: false })
  @IsOptional()
  @IsString()
  productSourceType?: string;

  @ApiProperty({ example: 'ONE_TIME', enum: PaymentRenewal, required: false })
  @IsOptional()
  @IsEnum(PaymentRenewal)
  paymentRenewal?: PaymentRenewal;
}
