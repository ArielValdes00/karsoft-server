import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsEnum(['active', 'inactive'])
    @IsNotEmpty()
    status: "active" | "inactive";
}
