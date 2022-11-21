import { PartialType } from '@nestjs/mapped-types';
import { CreateDanhSachXetTuyenDto } from './create-danh-sach-xet-tuyen.dto';

export class UpdateDanhSachXetTuyenDto extends PartialType(CreateDanhSachXetTuyenDto) {}
