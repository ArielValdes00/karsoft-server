import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendResetPasswordEmail(email: string, resetUrl: string) {
        const html = `
      <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #333;">Recuperación de Contraseña</h1>
        <p>Hola,</p>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, simplemente ignora este correo.</p>
        <p>Si deseas restablecer tu contraseña, haz clic en el enlace a continuación:</p>
        <a href="${resetUrl}" style="display: inline-block; margin-top: 20px; padding: 10px 15px; color: #ffffff; background-color: rgb(255, 61, 0); text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
        <p>Este enlace es válido por 1 hora.</p>
        <p>Gracias,</p>
        <p>El equipo de Karsoft</p>
    </div>
</body>
</html>
    `;

        await this.mailerService.sendMail({
            to: email,
            subject: 'Recuperación de Contraseña',
            html: html,
        });
    }
}
