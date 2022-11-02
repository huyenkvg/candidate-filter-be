import { Module } from '@nestjs/common';
import { KhoaTuyenSinhService } from './khoa-tuyen-sinh.service';
import { KhoaTuyenSinhController } from './khoa-tuyen-sinh.controller';

@Module({
  controllers: [KhoaTuyenSinhController],
  providers: [KhoaTuyenSinhService]
})
export class KhoaTuyenSinhModule {}
