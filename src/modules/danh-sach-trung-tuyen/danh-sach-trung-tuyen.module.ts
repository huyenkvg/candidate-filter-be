import { Module } from '@nestjs/common';
import { DanhSachTrungTuyenService } from './danh-sach-trung-tuyen.service';
import { DanhSachTrungTuyenController } from './danh-sach-trung-tuyen.controller';

@Module({
  controllers: [DanhSachTrungTuyenController],
  providers: [DanhSachTrungTuyenService]
})
export class DanhSachTrungTuyenModule {}
