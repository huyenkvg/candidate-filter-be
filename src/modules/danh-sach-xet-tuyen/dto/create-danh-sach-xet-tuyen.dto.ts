import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDanhSachXetTuyenDto {
  @IsOptional()
  maKhoaTuyenSinh: number;
  @IsOptional()
  maDotTuyenSinh: number;
  @IsNotEmpty()
  soBaoDanh: string;
  @IsNotEmpty()
  nguyenVong: number;
  @IsNotEmpty()
  maNganh: string;
  @IsNotEmpty()
  maToHopXetTuyen: string;
  diemMon1: number;
  diemMon2: number;
  diemMon3: number;
  @IsNotEmpty()
  tongDiem: number;
  @IsString()
  dieuKienKhac: string;
}
