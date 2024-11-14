import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'La dirección es obligatoria' })
    address: string;
}