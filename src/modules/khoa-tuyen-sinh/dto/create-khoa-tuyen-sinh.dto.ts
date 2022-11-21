import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateKhoaTuyenSinhDto {
  @IsNumber()
  maKhoa: number;

  @IsString()
  @IsNotEmpty()
  tenKhoa: string;
}
