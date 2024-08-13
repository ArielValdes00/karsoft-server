import { IsEmail, IsIn, IsNotEmpty, Length } from 'class-validator';

export class CreateEmployeeDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @Length(8, 20, { message: 'La contraseña debe tener entre 8 y 20 caracteres' })
    password: string;

    @IsIn(['activo', 'inactivo'], { message: 'El estado debe ser "activo" o "inactivo"' })
    status: 'activo' | 'inactivo';

    @IsNotEmpty({ message: 'El rol es obligatorio' })
    @Length(3, 20, { message: 'El rol debe tener entre 3 y 20 caracteres' })
    role: string;

    @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
    @Length(8, 15, { message: 'El número de teléfono debe tener entre 10 y 15 caracteres' })
    phone_number: string;
}
