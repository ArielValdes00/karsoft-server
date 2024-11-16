import { IsUUID, IsString, IsOptional, IsNumber, IsDateString, IsEnum } from 'class-validator';

export class CreateOrderDto {
    @IsUUID()
    clientId: string;

    @IsUUID()
    @IsOptional() 
    serviceId: string | string[]; 

    @IsUUID()
    paymentMethodId: string;

    @IsUUID()
    userId: string;

    @IsString()
    @IsOptional() 
    extras?: string;

    @IsNumber()
    discount: number;

    @IsNumber()
    subtotal: number;

    @IsNumber()
    total: number;

    @IsOptional()
    start_date?: Date;

    @IsOptional()
    end_date?: Date;

    @IsEnum(['finalizado', 'en proceso', 'sin empezar'])
    @IsOptional()
    status?: 'finalizado' | 'en proceso' | 'sin empezar';
}
