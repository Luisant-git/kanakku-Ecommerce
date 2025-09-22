import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserRegisterDto, AdminRegisterDto } from './dto/user-register.dto';
import { UserLoginDto, AdminLoginDto } from './dto/user-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // User Registration
  async userRegister(userRegisterDto: UserRegisterDto) {
    const { name, company, gstin, address, email, phone, state, city, country, pincode, password } = userRegisterDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name,
        company,
        gstin,
        address,
        email,
        phone,
        state,
        city,
        country,
        pincode,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign(
      { userId: user.id, phone: user.phone, type: 'user' },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
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
    const { phone, password } = userLoginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { phone },
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
      { userId: user.id, phone: user.phone, type: 'user' },
      { secret: process.env.JWT_SECRET, expiresIn: '7d' },
    );

    return {
      message: 'User logged in successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
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

  async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        company: true,
        gstin: true,
        address: true,
        email: true,
        phone: true,
        state: true,
        city: true,
        country: true,
        pincode: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async getAdminProfile(adminId: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }

    return admin;
  }

  async getUserCount() {
    const count = await this.prisma.user.count();
    return count;
  }

    async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Update only provided fields
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateUserDto,
      },
      select: {
        id: true,
        name: true,
        company: true,
        gstin: true,
        address: true,
        email: true,
        phone: true,
        state: true,
        city: true,
        country: true,
        pincode: true,
      },
    });
  }

  async forgotPassword(phone: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Since users may not have email, password reset via phone would need SMS service
    throw new NotFoundException('Password reset not available. Please contact support.');
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
      
      if (decoded.type !== 'reset') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.prisma.user.findUnique({ where: { id: decoded.userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await this.prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
      });

      return {
        message: 'Password reset successfully',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
