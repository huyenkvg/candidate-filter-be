import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChiTieuToHopService } from './chi-tieu-to-hop.service';
import { CreateChiTieuToHopDto } from './dto/create-chi-tieu-to-hop.dto';
import { UpdateChiTieuToHopDto } from './dto/update-chi-tieu-to-hop.dto';

@Controller('chi-tieu-to-hop')
export class ChiTieuToHopController {
  constructor(private readonly chiTieuToHopService: ChiTieuToHopService) {}

  @Post()
  create(@Body() createChiTieuToHopDto: CreateChiTieuToHopDto) {
    return this.chiTieuToHopService.create(createChiTieuToHopDto);
  }

  @Get()
  findAll() {
    return this.chiTieuToHopService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chiTieuToHopService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChiTieuToHopDto: UpdateChiTieuToHopDto) {
    return this.chiTieuToHopService.update(+id, updateChiTieuToHopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chiTieuToHopService.remove(+id);
  }
}
