import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBranchDto {
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    address?: string;

    @IsString()
    @IsNotEmpty()
    phone?: string;
}