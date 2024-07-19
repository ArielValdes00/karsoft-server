import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email?: string;

    @IsNotEmpty({ message: 'El Telefono es obligatorio' })
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
