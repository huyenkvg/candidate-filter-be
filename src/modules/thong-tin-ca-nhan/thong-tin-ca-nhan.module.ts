import { Module } from '@nestjs/common';
import { ThongTinCaNhanService } from './thong-tin-ca-nhan.service';
import { ThongTinCaNhanController } from './thong-tin-ca-nhan.controller';

@Module({
  controllers: [ThongTinCaNhanController],
  providers: [ThongTinCaNhanService]
})
export class ThongTinCaNhanModule {}
