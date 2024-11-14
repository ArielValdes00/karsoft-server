import { IsUUID, IsString, IsOptional, IsNumber } from 'class-validator';

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
}
