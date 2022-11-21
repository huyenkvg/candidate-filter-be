import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateThongTinCaNhanDto {
  @IsNotEmpty()
  maKhoaTuyenSinh: number;
  @IsNotEmpty()
  soBaoDanh: string;
  hoTen: string;
  cmnd: string;
  soDienThoai: string;
  email: string;
  goiTinh: string;
  diaChiGiayBao: string;
  ngaySinh: string;
  maTinh: string;
  maTruong: string;
  danToc: string;
  khuVucUuTien: string;
}
