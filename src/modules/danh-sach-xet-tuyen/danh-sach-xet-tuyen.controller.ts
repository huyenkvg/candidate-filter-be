import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DanhSachXetTuyenService } from './danh-sach-xet-tuyen.service';
import { CreateDanhSachXetTuyenDto } from './dto/create-danh-sach-xet-tuyen.dto';
import { UpdateDanhSachXetTuyenDto } from './dto/update-danh-sach-xet-tuyen.dto';

@Controller('danh-sach-xet-tuyen')
export class DanhSachXetTuyenController {
  constructor(private readonly danhSachXetTuyenService: DanhSachXetTuyenService) {}

  @Post()
  create(@Body() createDanhSachXetTuyenDto: CreateDanhSachXetTuyenDto) {
    return this.danhSachXetTuyenService.create(createDanhSachXetTuyenDto);
  }

  @Get()
  findAll() {
    return this.danhSachXetTuyenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.danhSachXetTuyenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDanhSachXetTuyenDto: UpdateDanhSachXetTuyenDto) {
    return this.danhSachXetTuyenService.update(+id, updateDanhSachXetTuyenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.danhSachXetTuyenService.remove(+id);
  }
}
