import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DanhSachTrungTuyenService } from './danh-sach-trung-tuyen.service';
import { CreateDanhSachTrungTuyenDto } from './dto/create-danh-sach-trung-tuyen.dto';
import { UpdateDanhSachTrungTuyenDto } from './dto/update-danh-sach-trung-tuyen.dto';

@Controller('danh-sach-trung-tuyen')
export class DanhSachTrungTuyenController {
  constructor(private readonly danhSachTrungTuyenService: DanhSachTrungTuyenService) {}

  @Post()
  create(@Body() createDanhSachTrungTuyenDto: CreateDanhSachTrungTuyenDto) {
    return this.danhSachTrungTuyenService.create(createDanhSachTrungTuyenDto);
  }

  @Get()
  findAll() {
    return this.danhSachTrungTuyenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.danhSachTrungTuyenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDanhSachTrungTuyenDto: UpdateDanhSachTrungTuyenDto) {
    return this.danhSachTrungTuyenService.update(+id, updateDanhSachTrungTuyenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.danhSachTrungTuyenService.remove(+id);
  }
}
