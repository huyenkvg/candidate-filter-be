import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class KhoaTuyenSinh {
  @IsNumber()
  @IsNotEmpty()
  maKhoa: string;

  @IsString()
  @IsNotEmpty()
  tenKhoa: string;
}
