import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChiTieuTuyenSinhService } from './chi-tieu-tuyen-sinh.service';
import { CreateChiTieuTuyenSinhDto } from './dto/create-chi-tieu-tuyen-sinh.dto';
import { UpdateChiTieuTuyenSinhDto } from './dto/update-chi-tieu-tuyen-sinh.dto';

@Controller('chi-tieu-tuyen-sinh')
export class ChiTieuTuyenSinhController {
  constructor(private readonly chiTieuTuyenSinhService: ChiTieuTuyenSinhService) {}

  @Post()
  create(@Body() createChiTieuTuyenSinhDto: CreateChiTieuTuyenSinhDto) {
    return this.chiTieuTuyenSinhService.create(createChiTieuTuyenSinhDto);
  }

  @Get()
  findAll() {
    return this.chiTieuTuyenSinhService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chiTieuTuyenSinhService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChiTieuTuyenSinhDto: UpdateChiTieuTuyenSinhDto) {
    return this.chiTieuTuyenSinhService.update(+id, updateChiTieuTuyenSinhDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chiTieuTuyenSinhService.remove(+id);
  }
}
