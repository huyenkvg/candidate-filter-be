import { PartialType } from '@nestjs/mapped-types';
import { CreateKhoaTuyenSinhDto } from './create-khoa-tuyen-sinh.dto';

export class UpdateKhoaTuyenSinhDto extends PartialType(CreateKhoaTuyenSinhDto) {}
