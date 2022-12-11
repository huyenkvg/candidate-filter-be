import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class ProfileDto {
  @IsOptional()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsOptional()
  active: boolean;

}