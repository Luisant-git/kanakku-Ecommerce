import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'ABC Company' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ example: '22AAAAA0000A1Z5' })
  @IsOptional()
  @IsString()
  gstin?: string;

  @ApiProperty({ example: '123 Main St' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;
 
  @ApiProperty({ example: 'Tamil Nadu'})
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'Chennai' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'India' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: '600001' })
  @IsOptional()
  @IsString()
  pincode?: string;
}
