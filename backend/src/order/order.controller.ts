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
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.userId;
    return this.orderService.create(Number(userId), createOrderDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'List of all orders.' })
  findAll() {
    return this.orderService.findAll();
  }

  @Get('total-orders')
  @ApiOperation({ summary: 'Get total number of orders' })
  @ApiResponse({ status: 200, description: 'Total number of orders.' })
  totalOrders() {
    return this.orderService.totalOrders();
  }

  @Get('total-sales')
  @ApiOperation({ summary: 'Get total sales amount' })
  @ApiResponse({ status: 200, description: 'Total sales amount.' })
  totalSales() {
    return this.orderService.totalSales();
  }

  @Get('pending-orders')
  @ApiOperation({ summary: 'Get total number of pending orders' })
  @ApiResponse({ status: 200, description: 'Total number of pending orders.' })
  pendingOrders() {
    return this.orderService.totalPendingOrders();
  }

  @Get('completed-orders')
  @ApiOperation({ summary: 'Get total number of completed orders' })
  @ApiResponse({ status: 200, description: 'Total number of completed orders.' })
  completedOrders() {
    return this.orderService.totalCompletedOrders();
  }

  @Get('cancelled-orders')
  @ApiOperation({ summary: 'Get total number of cancelled orders' })
  @ApiResponse({ status: 200, description: 'Total number of cancelled orders.' })
  cancelledOrders() {
    return this.orderService.totalCancelledOrders();
  }

  @Get('revenue-by-month')
  @ApiOperation({ summary: 'Get revenue by month' })
  @ApiResponse({ status: 200, description: 'Revenue by month.' })
  revenueByMonth() {
    return this.orderService.totalRevenueByMonthOfCurrentYear();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get orders for the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of user orders.' })
  findByUser(@Request() req) {
    const userId = req.user.userId;
    return this.orderService.findByUser(Number(userId));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order details.' })
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully.' })
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
