import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateWashDto {
    @IsOptional()
    @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
    @Length(2, 50, { message: 'El nombre del cliente debe tener entre 2 y 50 caracteres' })
    customerName?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'La patente del auto es obligatoria' })
    @Length(5, 10, { message: 'La patente del auto debe tener entre 6 y 10 caracteres' })
    carLicensePlate?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
    @Length(8, 15, { message: 'El número de teléfono debe tener entre 10 y 15 caracteres' })
    phoneNumber?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'El tipo de lavado es obligatorio' })
    @Length(3, 50, { message: 'El tipo de lavado debe tener entre 3 y 50 caracteres' })
    washType?: string;

    @IsOptional()
    status?: string;
}
