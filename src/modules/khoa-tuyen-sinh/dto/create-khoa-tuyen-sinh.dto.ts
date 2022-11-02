import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKhoaTuyenSinhDto {
  @IsNumber()
  maKhoa: string;

  @IsString()
  @IsNotEmpty()
  tenKhoa: string;
}
