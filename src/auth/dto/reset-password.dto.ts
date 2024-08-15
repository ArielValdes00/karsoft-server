import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
    @IsString()
    @Length(8, 20, { message: 'La contraseña debe tener entre 8 y 20 caracteres' })
    newPassword: string;

    @IsString()
    @Length(8, 20, { message: 'La contraseña debe tener entre 8 y 20 caracteres' })
    confirmPassword: string;

    @IsString()
    token: string;
}
