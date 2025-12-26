import { ApiProperty } from '@nestjs/swagger';

export class CreateDirectOrderDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  productId: number;

  @ApiProperty({ description: 'Version ID', example: 1 })
  versionId: number;

  @ApiProperty({ description: 'Shipping address for the order', example: '123 Main St, City, State 12345' })
  shippingAddress: string;

  @ApiProperty({ description: 'Payment method used', example: 'credit_card' })
  paymentMethod: string;

  @ApiProperty({ description: 'Tax type', example: 'IGST', required: false })
  taxType?: string;
}