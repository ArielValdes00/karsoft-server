import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    email?: string;

    @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
    phone_number?: string;

    @IsNotEmpty({ message: 'El nombre del negocio es obligatorio' })
    business_name?: string;

    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    address?: string;

    @IsNotEmpty({ message: 'El código postal es obligatorio' })
    postal_code?: string;
}
