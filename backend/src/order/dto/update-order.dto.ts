import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Current status of the order',
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
    example: 'COMPLETED',
  })
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';

  @ApiPropertyOptional({
    description: 'Updated shipping address for the order',
    example: '123 Main St, Springfield, USA',
  })
  shippingAddress?: string;

  // @ApiPropertyOptional({
  //   description: 'Tracking number assigned to the shipment',
  //   example: 'TRACK123456789',
  // })
  // trackingNumber?: string;
}
