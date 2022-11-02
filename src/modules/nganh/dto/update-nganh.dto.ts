import { PartialType } from '@nestjs/mapped-types';
import { CreateNganhDto } from './create-nganh.dto';

export class UpdateNganhDto extends PartialType(CreateNganhDto) {}
