import { PartialType } from '@nestjs/mapped-types';
import { CreateChiTieuToHopDto } from './create-chi-tieu-to-hop.dto';

export class UpdateChiTieuToHopDto extends PartialType(CreateChiTieuToHopDto) {}
