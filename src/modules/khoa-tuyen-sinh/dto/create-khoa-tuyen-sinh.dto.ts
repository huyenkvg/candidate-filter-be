import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKhoaTuyenSinhDto {
  @IsNumber()
  maKhoa: number;

  @IsNumber()
  @IsNotEmpty()
  tenKhoa: number;
}
