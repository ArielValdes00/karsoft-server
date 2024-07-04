import { IsEmail, IsIn, IsNotEmpty, Length } from 'class-validator';

export class CreateEmployeeDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    email: string;

    @IsIn(['activo', 'inactivo'], { message: 'El estado debe ser "activo" o "inactivo"' })
    status: 'activo' | 'inactivo';

    @IsNotEmpty({ message: 'El rol es obligatorio' })
    @Length(3, 20, { message: 'El rol debe tener entre 3 y 20 caracteres' })
    role: string;
}
