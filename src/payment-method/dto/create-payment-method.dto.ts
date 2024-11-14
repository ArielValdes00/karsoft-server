import { IsString, IsUUID, IsOptional, IsNumber, Min } from 'class-validator';

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
}
