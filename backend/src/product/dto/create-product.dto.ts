import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
}
