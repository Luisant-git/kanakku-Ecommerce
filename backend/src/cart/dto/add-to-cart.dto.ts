import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 1 })
  quantity: number;
}
