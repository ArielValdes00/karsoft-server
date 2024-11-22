import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum BranchStatus {
    Active = 'activo',
    Inactive = 'inactivo',
}

export class UpdateBranchDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    postal_code?: string;

    @IsString()
    @IsOptional()
    neighborhood?: string;

    @IsString()
    @IsOptional()
    province?: string;

    @IsString()
    @IsOptional()
    country?: string;

    @IsEnum(BranchStatus)
    @IsOptional()
    status?: BranchStatus;
}
