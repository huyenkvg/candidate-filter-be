import { Module } from '@nestjs/common';
import { NganhService } from './nganh.service';
import { NganhController } from './nganh.controller';

@Module({
  controllers: [NganhController],
  providers: [NganhService]
})
export class NganhModule {}
