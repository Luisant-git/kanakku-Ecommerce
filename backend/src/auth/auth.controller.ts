import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserRegisterDto, AdminRegisterDto } from './dto/user-register.dto';
import { UserLoginDto, AdminLoginDto } from './dto/user-login.dto';

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
}
