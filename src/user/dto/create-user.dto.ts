import { IsEmail, IsNotEmpty, Length } from 'class-validator';

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

    @IsNotEmpty({ message: 'Debe confirmar la contraseña' })
    @Length(8, 20, { message: 'La contraseña debe tener entre 8 y 20 caracteres' })
    confirm_password: string;

    @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
    @Length(8, 15, { message: 'El número de teléfono debe tener entre 10 y 15 caracteres' })
    phone_number: string;

    @IsNotEmpty({ message: 'El nombre del negocio es obligatorio' })
    business_name: string;

    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    address: string;

    @IsNotEmpty({ message: 'El código postal es obligatorio' })
    postal_code: string;
}
