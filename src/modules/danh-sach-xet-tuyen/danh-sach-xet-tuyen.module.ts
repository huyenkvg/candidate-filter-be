import { Module } from '@nestjs/common';
import { DanhSachXetTuyenService } from './danh-sach-xet-tuyen.service';
import { DanhSachXetTuyenController } from './danh-sach-xet-tuyen.controller';

@Module({
  controllers: [DanhSachXetTuyenController],
  providers: [DanhSachXetTuyenService]
})
export class DanhSachXetTuyenModule {}
