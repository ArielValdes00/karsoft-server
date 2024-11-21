import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
    name: string;

    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 caracteres' })
    lastname: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    email?: string;

    @IsNotEmpty({ message: 'El Telefono es obligatorio' })
    @Length(8, 15, { message: 'El número de teléfono debe tener entre 10 y 15 caracteres' })
    @IsOptional()
    phone_number?: string;

    @IsNotEmpty({ message: 'El Local es obligatorio' })
    @IsOptional()
    business_name?: string;

    @IsNotEmpty({ message: 'La dirección es obligatorio' })
    @IsOptional()
    address?: string;

    @IsNotEmpty({ message: 'El código postal es obligatorio' })
    @IsOptional()
    postal_code?: string;
}
