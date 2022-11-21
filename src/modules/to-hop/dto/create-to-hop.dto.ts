import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import StringUtils from 'src/utils/string-utils';

export class CreateToHopDto {
  @IsString()
  @IsNotEmpty()
  maToHop: string;

  mon1: string;
  mon2: string;
  mon3: string;
}
