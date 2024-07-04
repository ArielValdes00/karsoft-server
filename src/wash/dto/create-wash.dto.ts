import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateWashDto {
    @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
    customerName: string;

    @IsNotEmpty({ message: 'La patente del auto es obligatoria' })
    @Length(6, 10, { message: 'La patente del auto debe tener entre 6 y 10 caracteres' })
    carLicensePlate: string;

    @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'El tipo de lavado es obligatorio' })
    washType: string;

    @IsOptional()
    status: string;
}
