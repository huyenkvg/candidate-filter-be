import { PartialType } from '@nestjs/mapped-types';
import { CreateToHopDto } from './create-to-hop.dto';

export class UpdateToHopDto extends PartialType(CreateToHopDto) {}
