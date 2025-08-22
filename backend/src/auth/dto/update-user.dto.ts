import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

//   @ApiProperty({ example: 'john.doe@example.com' })
//   @IsOptional()
//   @IsString()
//   email?: string;

  @ApiProperty({ example: '1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '123 Main St' })
  @IsOptional()
  @IsString()
  address?: string;
 
  @ApiProperty({ example: 'New York'})
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'NY' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '10001' })
  @IsOptional()
  @IsString()
  pincode?: string;
}
