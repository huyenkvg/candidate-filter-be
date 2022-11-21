import { Module } from '@nestjs/common';
import { ToHopService } from './to-hop.service';
import { ToHopController } from './to-hop.controller';

@Module({
  controllers: [ToHopController],
  providers: [ToHopService]
})
export class ToHopModule {}
