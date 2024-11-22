import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateBranchDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    address: string;

    @IsString()
    @IsNotEmpty({ message: 'El código postal es obligatorio' })
    postal_code: string; 

    @IsString()
    @IsNotEmpty({ message: 'El barrio es obligatorio' })
    neighborhood: string; 

    @IsString()
    @IsNotEmpty({ message: 'La provincia es obligatoria' })
    province: string;

    @IsString()
    @IsNotEmpty({ message: 'El país es obligatorio' })
    country: string; 

    @IsOptional()
    @IsEnum(['activo', 'inactivo'], { message: 'El status debe ser activo u inactivo' })
    status?: 'activo' | 'inactivo'; 
}