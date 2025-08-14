import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  productId: number;

  @ApiProperty({ description: 'Quantity of the product', example: 2 })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ 
    type: [OrderItemDto], 
    description: 'Array of order items',
    example: [{ productId: 1, quantity: 2 }, { productId: 3, quantity: 1 }]
  })
  items: Array<{
    productId: number;
    quantity: number;
  }>;

  @ApiProperty({ description: 'Shipping address for the order', example: '123 Main St, City, State 12345' })
  shippingAddress: string;

  @ApiProperty({ description: 'Payment method used', example: 'credit_card' })
  paymentMethod: string;
}
