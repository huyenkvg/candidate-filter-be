import { Module } from '@nestjs/common';
import { DotTuyenSinhService } from './dot-tuyen-sinh.service';
import { DotTuyenSinhController } from './dot-tuyen-sinh.controller';

@Module({
  controllers: [DotTuyenSinhController],
  providers: [DotTuyenSinhService]
})
export class DotTuyenSinhModule {}
