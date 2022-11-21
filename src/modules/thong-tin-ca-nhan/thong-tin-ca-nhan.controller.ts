import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ThongTinCaNhanService } from './thong-tin-ca-nhan.service';
import { CreateThongTinCaNhanDto } from './dto/create-thong-tin-ca-nhan.dto';
import { UpdateThongTinCaNhanDto } from './dto/update-thong-tin-ca-nhan.dto';

@Controller('thong-tin-ca-nhan')
export class ThongTinCaNhanController {
  constructor(private readonly thongTinCaNhanService: ThongTinCaNhanService) { }

  @Post()
  create(@Body() createThongTinCaNhanDto: CreateThongTinCaNhanDto) {
    return this.thongTinCaNhanService.create(createThongTinCaNhanDto);
  }

  @Get()
  findAll(@Query() params: any) {
    console.log('parrams :>> ', params);
    return this.thongTinCaNhanService.findAll(params);
  }

  @Get('/search/:info/:maKhoaTuyenSinh')
  findByInof(@Param('info') info: string, @Param('maKhoaTuyenSinh') maKhoaTuyenSinh: number) {
    return this.thongTinCaNhanService.findByInfo(info, maKhoaTuyenSinh);
  }

  @Patch()
  update(@Body() updateThongTinCaNhanDto: UpdateThongTinCaNhanDto) {
    return this.thongTinCaNhanService.update(updateThongTinCaNhanDto);
  }

  @Delete('/:id/:maKhoaTuyenSinh')
  remove(@Param('id') id: string, @Param('maKhoaTuyenSinh') maKhoaTuyenSinh: number) {
    return this.thongTinCaNhanService.remove(id, maKhoaTuyenSinh);
  }
}
