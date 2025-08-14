import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth('access-token')
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  @ApiOperation({ summary: 'Add product to cart' })
  @ApiResponse({ status: 201, description: 'Product added to cart.' })
  async addToCart(@Request() req, @Body() dto: AddToCartDto) {
    const userId = req.user.userId;
    return this.cartService.addToCart(Number(userId), dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'User cart.' })
  async getCart(@Request() req) {
    const userId = req.user.userId;
    return this.cartService.getCart(Number(userId));
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiResponse({ status: 200, description: 'Product removed from cart.' })
  async removeFromCart(@Request() req, @Param('productId') productId: string) {
    const userId = req.user.userId;
    return this.cartService.removeFromCart(Number(userId), Number(productId));
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear user cart' })
  @ApiResponse({ status: 200, description: 'User cart cleared.' })
  async clearCart(@Request() req) {
    const userId = req.user.userId;
    return this.cartService.clearCart(Number(userId));
  }

   @Get('count')
  @ApiOperation({ summary: 'Get cart item count' })
  @ApiResponse({ status: 200, description: 'Number of items in the cart.' })
  async getCartCount(@Request() req) {
    const userId = req.user.userId; // Extract userId from JWT
    const count = await this.cartService.countCartItems(Number(userId));
    return { count };
  }
}
