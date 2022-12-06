import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDotTuyenSinhDto {
  @IsNumber()
  @IsOptional()
  maDotTuyenSinh : number;
  @IsNumber()
  maKhoaTuyenSinh : number;
  @IsString()
  @IsNotEmpty()
  tenDotTuyenSinh :  string;
  
}
