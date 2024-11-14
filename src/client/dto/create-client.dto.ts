import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;

  @IsString()
  patent: string;

  @IsString()
  car_model: string;

  @IsOptional() 
  @IsDateString()
  last_visited: Date;
}
