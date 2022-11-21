import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateChiTieuToHopDto } from 'src/modules/chi-tieu-to-hop/dto/create-chi-tieu-to-hop.dto';
import { CreateChiTieuTuyenSinhDto } from 'src/modules/chi-tieu-tuyen-sinh/dto/create-chi-tieu-tuyen-sinh.dto';

export class UpdateChiTieuObj {
  chiTieuNganh: CreateChiTieuTuyenSinhDto[];
  chiTieuToHop: CreateChiTieuToHopDto[];
}
