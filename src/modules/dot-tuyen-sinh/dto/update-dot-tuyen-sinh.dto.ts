import { PartialType } from '@nestjs/mapped-types';
import { CreateDotTuyenSinhDto } from './create-dot-tuyen-sinh.dto';

export class UpdateDotTuyenSinhDto extends PartialType(CreateDotTuyenSinhDto) {}
