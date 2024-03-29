import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { ProfileDto } from './ProfileDto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNumber()
  @IsNotEmpty()
  role_id: number;

  @IsOptional()
  active: boolean;

  
  // @IsOptional()
  // profile: any;
}
