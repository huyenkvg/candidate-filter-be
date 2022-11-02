import { Module } from '@nestjs/common';
import { ChiTieuTuyenSinhService } from './chi-tieu-tuyen-sinh.service';
import { ChiTieuTuyenSinhController } from './chi-tieu-tuyen-sinh.controller';

@Module({
  controllers: [ChiTieuTuyenSinhController],
  providers: [ChiTieuTuyenSinhService]
})
export class ChiTieuTuyenSinhModule {}
