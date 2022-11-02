import { PartialType } from '@nestjs/mapped-types';
import { CreateDanhSachTrungTuyenDto } from './create-danh-sach-trung-tuyen.dto';

export class UpdateDanhSachTrungTuyenDto extends PartialType(CreateDanhSachTrungTuyenDto) {}
