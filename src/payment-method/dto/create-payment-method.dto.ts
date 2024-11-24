import { IsString, IsUUID, IsOptional, IsNumber, Min, IsDate } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  extra?: number;


  @IsUUID()
  @IsOptional()
  created_by?: string;

  @IsDate() 
  @IsOptional()
  created_date?: Date;
}
