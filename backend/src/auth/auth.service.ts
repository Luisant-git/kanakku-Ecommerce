import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserRegisterDto, AdminRegisterDto } from './dto/user-register.dto';
import { SendOtpDto, VerifyOtpDto, OtpLoginDto } from './dto/otp-login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminLoginDto } from './dto/user-login.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private async sendWhatsAppOtp(phone: string, otp: string): Promise<boolean> {
    try {
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const whatsappToken = process.env.WHATSAPP_TOKEN;

      const response = await fetch(
        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${whatsappToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phone,
            type: 'template',
            template: {
              name: 'viha_login_otp',
              language: { code: 'en' },
              components: [
                {
                  type: 'body',
                  parameters: [{ type: 'text', text: otp }],
                },
                {
                  type: 'button',
                  sub_type: 'url',
                  index: '0',
                  parameters: [{ type: 'text', text: otp }],
                },
              ],
            },
          }),
        },
      );

      const data = await response.json();
      console.log('WhatsApp API Success:', data);
      return response.ok;
    } catch (error) {
      console.error(
        'WhatsApp API Error:',
        error.response?.data || error.message,
      );
      return false;
    }
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP for login/registration
  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    const { phone } = sendOtpDto;

    // Generate OTP
    const otp = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if user exists
    let user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (user) {
      // Update existing user's OTP
      user = await this.prisma.user.update({
        where: { phone },
        data: {
          otp,
          otpExpiry,
        },
      });
    } else {
      // Create temporary user record for registration
      user = await this.prisma.user.create({
        data: {
          phone,
          otp,
          otpExpiry,
          isVerified: false,
          password: await bcrypt.hash('temporary', 10), // Temporary password
        },
      });
    }

    // Send OTP via WhatsApp
    const otpSent = await this.sendWhatsAppOtp(phone, otp);

    if (!otpSent) {
      throw new BadRequestException('Failed to send OTP via WhatsApp');
    }

    return { message: 'OTP sent successfully to your WhatsApp' };
  }

  // Verify OTP for login/registration
  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ message: string; user?: any; requiresRegistration?: boolean }> {
    const { phone, otp } = verifyOtpDto;

    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Check if user needs to complete registration
    const requiresRegistration = !user.isVerified || !user.name || !user.email;

    if (!requiresRegistration) {
      // Clear OTP for verified users
      await this.prisma.user.update({
        where: { phone },
        data: {
          otp: null,
          otpExpiry: null,
        },
      });
    }

    return {
      message: 'OTP verified successfully',
      user: {
        id: user.id,
        phone: user.phone,
        isVerified: user.isVerified,
        name: user.name,
        email: user.email,
      },
      requiresRegistration,
    };
  }

  // OTP Login
  async otpLogin(
    otpLoginDto: OtpLoginDto,
  ): Promise<{ token: string; user: any }> {
    const { phone, otp } = otpLoginDto;

    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Please complete registration first');
    }

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Clear OTP after successful login
    await this.prisma.user.update({
      where: { phone },
      data: {
        otp: null,
        otpExpiry: null,
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign(
      {
        userId: user.id,
        email: user.email,
        type: 'user',
      },
      { secret: process.env.JWT_SECRET, expiresIn: '999y' },
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        gstin: user.gstin,
        address: user.address,
        state: user.state,
        city: user.city,
        country: user.country,
        pincode: user.pincode,
      },
    };
  }

  // User Registration (Complete profile after OTP verification)
  async userRegister(
    userRegisterDto: UserRegisterDto,
  ): Promise<{ token: string; user: any }> {
    const { phone, ...userData } = userRegisterDto;

    // Check if user exists and is verified via OTP
    const existingUser = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!existingUser) {
      throw new NotFoundException(
        'Please request OTP first to verify your phone',
      );
    }

    if (!existingUser.otp) {
      throw new BadRequestException(
        'OTP verification required before registration',
      );
    }

    // Update user with registration data and mark as verified
    const updatedUser = await this.prisma.user.update({
      where: { phone },
      data: {
        ...userData,
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign(
      {
        userId: updatedUser.id,
        email: updatedUser.email,
        type: 'user',
      },
      { secret: process.env.JWT_SECRET, expiresIn: '999y' },
    );

    return {
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        company: updatedUser.company,
        gstin: updatedUser.gstin,
        address: updatedUser.address,
        state: updatedUser.state,
        city: updatedUser.city,
        country: updatedUser.country,
        pincode: updatedUser.pincode,
      },
    };
  }

  // Admin Registration (Keep as is)
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

  // Remove old userLogin method since we're using OTP login
  // async userLogin(userLoginDto: UserLoginDto) {
  //   // This method is removed for OTP-based authentication
  // }

  // Admin Login (Keep as is)
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
        isVerified: true,
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
        isVerified: true,
      },
    });
  }

  // Update forgotPassword to use phone-based OTP
  async forgotPassword(phone: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Send OTP for password reset
    const otp = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.user.update({
      where: { phone },
      data: {
        otp,
        otpExpiry,
      },
    });

    // Send OTP via WhatsApp
    const otpSent = await this.sendWhatsAppOtp(phone, otp);

    if (!otpSent) {
      throw new BadRequestException('Failed to send OTP via WhatsApp');
    }

    return { message: 'OTP sent successfully for password reset' };
  }

  async resetPassword(token: string, newPassword: string) {
    // For OTP-based reset, we'll handle this differently
    // Currently keeping the existing implementation but it might need adjustment
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (decoded.type !== 'reset') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
      });
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
