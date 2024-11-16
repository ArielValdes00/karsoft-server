import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
    name: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @Length(8, 20, { message: 'La contraseña debe tener entre 8 y 20 caracteres' })
    password: string;

    @IsOptional()
    @Length(8, 20, { message: 'La contraseña debe tener entre 8 y 20 caracteres' })
    confirm_password?: string;

    @IsOptional()
    @Length(7, 15, { message: 'La contraseña debe tener entre 7 y 15 caracteres' })
    phone_number?: string

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    branches?: string;

    @IsOptional()
    @IsEnum(['owner', 'admin', 'user'], { message: 'El rol debe ser uno de los siguientes: owner, admin, user' })
    role?: 'owner' | 'admin' | 'user';
}
