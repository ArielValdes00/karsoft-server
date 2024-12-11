import { IsUUID, IsString, IsOptional, IsNumber, IsDateString, IsEnum, isNumber } from 'class-validator';

export class CreateOrderDto {
    @IsUUID()
    clientId: string;

    @IsOptional() 
    serviceId: string | string[]; 

    @IsUUID()
    paymentMethodId: string;

    @IsUUID()
    userId: string;

    @IsString()
    @IsOptional()
    orderId?: string;

    @IsOptional() 
    extras?: number;

    @IsNumber()
    paymentDiscount: number;

    @IsNumber()
    paymentExtra: number;

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

    @IsOptional()
    serviceDescriptions: any;
}
