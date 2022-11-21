import { PartialType } from '@nestjs/mapped-types';
import { CreateThongTinCaNhanDto } from './create-thong-tin-ca-nhan.dto';

export class UpdateThongTinCaNhanDto extends PartialType(CreateThongTinCaNhanDto) {}
