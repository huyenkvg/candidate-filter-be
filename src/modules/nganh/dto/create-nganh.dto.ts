import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNganhDto {
  @IsString()
  @IsNotEmpty()
  maNganh: string;

  @IsString()
  @IsNotEmpty()
  tenNganh: string;
}
