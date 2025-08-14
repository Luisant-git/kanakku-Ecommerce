import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('orders')
@ApiBearerAuth()
@ApiBearerAuth('access-token')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.userId;
    return this.orderService.create(Number(userId), createOrderDto);
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of all orders.' })
  findAll() {
    return this.orderService.findAll();
  }

  @Get('user')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get orders for the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of user orders.' })
  findByUser(@Request() req) {
    const userId = req.user.userId;
    return this.orderService.findByUser(Number(userId));
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order details.' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully.' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
