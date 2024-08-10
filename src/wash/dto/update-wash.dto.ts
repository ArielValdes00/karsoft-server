import { IsNotEmpty, IsOptional, Length, IsNumber, IsString, IsEnum, Min } from 'class-validator';

export enum PaymentMethod {
    CASH = 'efectivo',
    CREDIT_CARD = 'tarjeta',
    DEBIT_CARD = 'transferencia',
    OTHER = 'otro'
}

export class UpdateWashDto {
    @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
    @Length(2, 50, { message: 'El nombre del cliente debe tener entre 2 y 50 caracteres' })
    customerName: string;

    @IsNotEmpty({ message: 'La patente del auto es obligatoria' })
    @Length(5, 10, { message: 'La patente del auto debe tener entre 5 y 10 caracteres' })
    carLicensePlate: string;

    @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
    @Length(8, 15, { message: 'El número de teléfono debe tener entre 8 y 15 caracteres' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'El tipo de lavado es obligatorio' })
    @Length(3, 50, { message: 'El tipo de lavado debe tener entre 3 y 50 caracteres' })
    washType: string;

    @IsOptional()
    @IsString()
    @Length(3, 20, { message: 'El estado debe tener entre 3 y 20 caracteres' })
    status?: string;

    @IsNotEmpty({ message: 'El precio es obligatorio' })
    @IsNumber({}, { message: 'El precio debe ser un número' })
    @Min(0, { message: 'El precio no puede ser negativo' })
    price: number;

    @IsNotEmpty({ message: 'El método de pago es obligatorio' })
    @IsEnum(PaymentMethod, { message: 'Método de pago inválido' })
    paymentMethod: PaymentMethod;
}
