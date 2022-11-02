import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NganhService } from './nganh.service';
import { CreateNganhDto } from './dto/create-nganh.dto';
import { UpdateNganhDto } from './dto/update-nganh.dto';

@Controller('nganh')
export class NganhController {
  constructor(private readonly nganhService: NganhService) {}

  @Post()
  create(@Body() createNganhDto: CreateNganhDto) {
    return this.nganhService.create(createNganhDto);
  }

  @Get()
  findAll() {
    return this.nganhService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nganhService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNganhDto: UpdateNganhDto) {
    return this.nganhService.update(+id, updateNganhDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nganhService.remove(+id);
  }
}
