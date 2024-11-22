import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
    name?: string;

    @IsOptional()
    @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 caracteres' })
    lastname?: string;

    @IsOptional()
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @Length(2, 100, { message: 'El correo electrónico debe tener entre 2 y 100 caracteres' })
    email?: string;

    @IsOptional()
    @Length(8, 15, { message: 'El número de teléfono debe tener entre 8 y 15 caracteres' })
    phone_number?: string;

    @IsOptional()
    @Length(2, 20, { message: 'El estado debe ser "activo" o "inactivo"' })
    status?: "activo" | "inactivo";

    @IsOptional()
    @Length(2, 20, { message: 'El rol debe ser "dueño", "admin" o "empleado"' })
    role?: "dueño" | "admin" | "empleado"; 

    @IsOptional()
    @Length(0, 255, { message: 'La URL del avatar no debe exceder los 255 caracteres' })
    avatar?: string;
}
