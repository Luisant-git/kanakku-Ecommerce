import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; }
            .email-container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; }
            .title { color: #333; font-size: 24px; font-weight: bold; margin: 0; }
            .content { padding: 30px; }
            .content p { font-size: 16px; color: #666; line-height: 1.5; }
            .btn { display: inline-block; background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; color: #888; font-size: 12px; padding: 10px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1 class="title">Password Reset Request</h1>
            </div>
            <div class="content">
              <p>You requested a password reset. Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="btn">Reset Password</a>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Kanakku Ecommerce. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: htmlContent,
    });
  }
}