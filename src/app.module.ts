import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { WishListModule } from './modules/wish-list/wish-list.module';
import { NganhModule } from './modules/nganh/nganh.module';
import { KhoaTuyenSinhModule } from './modules/khoa-tuyen-sinh/khoa-tuyen-sinh.module';
import { DotTuyenSinhModule } from './modules/dot-tuyen-sinh/dot-tuyen-sinh.module';
import { DanhSachTrungTuyenModule } from './modules/danh-sach-trung-tuyen/danh-sach-trung-tuyen.module';
import { ChiTieuTuyenSinhModule } from './modules/chi-tieu-tuyen-sinh/chi-tieu-tuyen-sinh.module';

@Module({
  imports: [AuthModule, UsersModule, WishListModule, NganhModule, KhoaTuyenSinhModule, DotTuyenSinhModule, DanhSachTrungTuyenModule, ChiTieuTuyenSinhModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
