import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserRegisterDto, AdminRegisterDto } from './dto/user-register.dto';
import { UserLoginDto, AdminLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // User Registration
  async userRegister(userRegisterDto: UserRegisterDto) {
    const { email, name, password } = userRegisterDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign(
      { userId: user.id, email: user.email, type: 'user' },
      { secret: process.env.JWT_SECRET },
    );

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  // Admin Registration
  async adminRegister(adminRegisterDto: AdminRegisterDto) {
    const { email, name, password } = adminRegisterDto;

    // Check if admin already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await this.prisma.admin.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign(
      { adminId: admin.id, email: admin.email, type: 'admin' },
      { secret: process.env.JWT_SECRET },
    );

    return {
      message: 'Admin registered successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
      token,
    };
  }

  // User Login
  async userLogin(userLoginDto: UserLoginDto) {
    const { email, password } = userLoginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign(
      { userId: user.id, email: user.email, type: 'user' },
      { secret: process.env.JWT_SECRET },
    );

    return {
      message: 'User logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  // Admin Login
  async adminLogin(adminLoginDto: AdminLoginDto) {
    const { email, password } = adminLoginDto;

    // Find admin
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign(
      { adminId: admin.id, email: admin.email, type: 'admin' },
      { secret: process.env.JWT_SECRET },
    );

    return {
      message: 'Admin logged in successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
      token,
    };
  }
}
