import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KhoaTuyenSinhService } from './khoa-tuyen-sinh.service';
import { CreateKhoaTuyenSinhDto } from './dto/create-khoa-tuyen-sinh.dto';
import { UpdateKhoaTuyenSinhDto } from './dto/update-khoa-tuyen-sinh.dto';

@Controller('khoa-tuyen-sinh')
export class KhoaTuyenSinhController {
  constructor(private readonly khoaTuyenSinhService: KhoaTuyenSinhService) {}
  @Get()
  findAll() {

    return this.khoaTuyenSinhService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.khoaTuyenSinhService.findOne(+id);
  }
  @Get('tim-kiem/:str')
  timKiem(@Param('str') str: string) {
    return this.khoaTuyenSinhService.search(str);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKhoaTuyenSinhDto: UpdateKhoaTuyenSinhDto) {
    return this.khoaTuyenSinhService.update(+id, updateKhoaTuyenSinhDto);
  }

  @Post()
  create(@Body() createKhoaTuyenSinhDto: CreateKhoaTuyenSinhDto) {
    return this.khoaTuyenSinhService.create(createKhoaTuyenSinhDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.khoaTuyenSinhService.remove(+id);
  }
}
