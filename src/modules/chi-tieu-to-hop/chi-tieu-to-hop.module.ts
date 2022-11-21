import { Module } from '@nestjs/common';
import { ChiTieuToHopService } from './chi-tieu-to-hop.service';
import { ChiTieuToHopController } from './chi-tieu-to-hop.controller';

@Module({
  controllers: [ChiTieuToHopController],
  providers: [ChiTieuToHopService]
})
export class ChiTieuToHopModule {}
