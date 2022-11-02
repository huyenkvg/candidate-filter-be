import { PartialType } from '@nestjs/mapped-types';
import { CreateChiTieuTuyenSinhDto } from './create-chi-tieu-tuyen-sinh.dto';

export class UpdateChiTieuTuyenSinhDto extends PartialType(CreateChiTieuTuyenSinhDto) {}
