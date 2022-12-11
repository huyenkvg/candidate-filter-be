import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { KhoaTuyenSinhService } from './khoa-tuyen-sinh.service';
import { CreateKhoaTuyenSinhDto } from './dto/create-khoa-tuyen-sinh.dto';
import { UpdateKhoaTuyenSinhDto } from './dto/update-khoa-tuyen-sinh.dto';

@Controller('khoa-tuyen-sinh')
export class KhoaTuyenSinhController {
  constructor(private readonly khoaTuyenSinhService: KhoaTuyenSinhService) {}
  // @Get()
  // findAll() {
  //   return this.khoaTuyenSinhService.findAll();
  // }
  @Get()
  findAllOps(@Query() query) {
    console.log('body :>> ', query);
    return this.khoaTuyenSinhService.findAll(query);
  }
  @Get('dsxt/:id')
  get_DSXT(@Param('id') id: string) {
    return this.khoaTuyenSinhService.get_DSXT(Number.parseInt(id));
  }
  @Get('dstt/:id')
  get_DSTT(@Param('id') id: string) {
    return this.khoaTuyenSinhService.get_DSTT(Number.parseInt(id));
  }

  @Get('/thong-ke')
  thongke(@Query() query) {
    console.log('query :>> ', query);
    return this.khoaTuyenSinhService.thongKe(query);
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    console.log('id :>> ', id);
    return this.khoaTuyenSinhService.findOne(Number.parseInt(id));
  }
  // @Get('/tim-kiem/:str')
  // timKiem(@Param('str') str: string) {
  //   return this.khoaTuyenSinhService.search(str);
  // }

  @Patch()
  update(@Body() updateKhoaTuyenSinhDto: UpdateKhoaTuyenSinhDto) {
    return this.khoaTuyenSinhService.update(updateKhoaTuyenSinhDto);
  }

  @Post()
  create(@Body() createKhoaTuyenSinhDto: CreateKhoaTuyenSinhDto) {
    return this.khoaTuyenSinhService.create(createKhoaTuyenSinhDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.khoaTuyenSinhService.remove(Number.parseInt(id));
  }
}
