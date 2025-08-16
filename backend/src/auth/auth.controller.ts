import { Controller, Post, Body, Request, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserRegisterDto, AdminRegisterDto } from './dto/user-register.dto';
import { UserLoginDto, AdminLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User Endpoints
  @Post('user/register')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User registration successful.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async userRegister(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.userRegister(userRegisterDto);
  }

  @Post('user/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async userLogin(@Body() userLoginDto: UserLoginDto) {
    return this.authService.userLogin(userLoginDto);
  }

  // Admin Endpoints
  @Post('admin/register')
  @ApiOperation({ summary: 'Admin registration' })
  @ApiResponse({ status: 201, description: 'Admin registration successful.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async adminRegister(@Body() adminRegisterDto: AdminRegisterDto) {
    return this.authService.adminRegister(adminRegisterDto);
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Admin login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async adminLogin(@Body() adminLoginDto: AdminLoginDto) {
    return this.authService.adminLogin(adminLoginDto);
  }

  @Get('customer/count')
  @ApiOperation({ summary: 'Get user count' })
  @ApiResponse({ status: 200, description: 'User count retrieved successfully.' })
  async getUserCount() {
    return this.authService.getUserCount();
  }

  @Get('user/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getUserProfile(@Request() req) {
    const userId = req.user.userId;
    return this.authService.getUserProfile(userId);
  }

  @Get('admin/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get admin profile' })
  @ApiResponse({ status: 200, description: 'Admin profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAdminProfile(@Request() req) {
    console.log('Decoded user:', req.user); 
    const adminId = Number(req.user?.adminId);
    return this.authService.getAdminProfile(Number(adminId));
  }
}
