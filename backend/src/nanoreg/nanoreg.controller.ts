import { Controller, Get, Post, Body } from '@nestjs/common';
import { NanoregService } from './nanoreg.service';
import { CreateNanoregDto } from './dto/create-nanoreg.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Nanoreg')
@Controller('nanoreg')
export class NanoregController {
  constructor(private readonly nanoregService: NanoregService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Nanoreg records' })
  @ApiResponse({ status: 200, description: 'Array of Nanoreg records' })
  async findAll() {
    return await this.nanoregService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Insert a new Nanoreg record' })
  @ApiResponse({ status: 201, description: 'Record inserted successfully' })
  async create(@Body() dto: CreateNanoregDto) {
    return await this.nanoregService.create(dto);
  }
}
