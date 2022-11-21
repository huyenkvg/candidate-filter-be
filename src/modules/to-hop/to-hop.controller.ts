import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToHopService } from './to-hop.service';
import { CreateToHopDto } from './dto/create-to-hop.dto';
import { UpdateToHopDto } from './dto/update-to-hop.dto';

@Controller('to-hop-xet-tuyen')
export class ToHopController {
  constructor(private readonly toHopService: ToHopService) {}

  @Post()
  create(@Body() createToHopDto: CreateToHopDto) {
    return this.toHopService.create(createToHopDto);
  }

  @Get()
  findAll() {
    return this.toHopService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toHopService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToHopDto: UpdateToHopDto) {
    return this.toHopService.update(id, updateToHopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toHopService.remove(id);
  }
}
