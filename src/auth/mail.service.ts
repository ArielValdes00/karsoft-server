import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, resetUrl: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperación de Contraseña',
      template: '../templates/reset-password', 
      context: {
        resetUrl,
      },
    });
  }
}
