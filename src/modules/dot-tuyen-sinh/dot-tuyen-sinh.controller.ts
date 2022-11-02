import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DotTuyenSinhService } from './dot-tuyen-sinh.service';
import { CreateDotTuyenSinhDto } from './dto/create-dot-tuyen-sinh.dto';
import { UpdateDotTuyenSinhDto } from './dto/update-dot-tuyen-sinh.dto';

@Controller('dot-tuyen-sinh')
export class DotTuyenSinhController {
  constructor(private readonly dotTuyenSinhService: DotTuyenSinhService) {}

  @Post()
  create(@Body() createDotTuyenSinhDto: CreateDotTuyenSinhDto) {
    return this.dotTuyenSinhService.create(createDotTuyenSinhDto);
  }

  @Get()
  findAll() {
    return this.dotTuyenSinhService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dotTuyenSinhService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDotTuyenSinhDto: UpdateDotTuyenSinhDto) {
    return this.dotTuyenSinhService.update(+id, updateDotTuyenSinhDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dotTuyenSinhService.remove(+id);
  }
}
