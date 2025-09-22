import { Controller, Post, Get, Body, UseGuards, Request, Param } from '@nestjs/common';
import { DemoService } from './demo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('demo')
@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Record demo download' })
  recordDemoDownload(@Body() body: { productId: number }, @Request() req) {
    const userId = req.user.userId;
    return this.demoService.recordDemoDownload(userId, body.productId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all demo downloads for user' })
  getDemoDownloads(@Request() req) {
    const userId = req.user.userId;
    return this.demoService.getAllDemoDownloads(userId);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all demo downloads for admin' })
  getAllDemoDownloads() {
    return this.demoService.getAllDemoDownloadsForAdmin();
  }
}