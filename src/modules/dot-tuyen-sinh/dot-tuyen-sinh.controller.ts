import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @Post('/update-chi-tieu/:id')
  updateChiTieu(@Param('id') id: number, @Body() data: any) {
    return this.dotTuyenSinhService.updateChiTieuDot(id, data);
  }

  @Get()
  findAll() {
    return this.dotTuyenSinhService.findAll();
  }
  @Get('dsxt/:id')
  get_DSXT(@Param('id') id: string) {
    return this.dotTuyenSinhService.get_DSXT(Number.parseInt(id));
  }
  @Get('dstt/:id')
  get_DSTT(@Param('id') id: string) {
    return this.dotTuyenSinhService.get_DSTT(Number.parseInt(id));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dotTuyenSinhService.getInfo(Number.parseInt(id));
  }

  @Patch()
  update(@Body() updateDotTuyenSinhDto: UpdateDotTuyenSinhDto) {
    return this.dotTuyenSinhService.update(updateDotTuyenSinhDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dotTuyenSinhService.remove(Number.parseInt(id));
  }
  @Post('upfile/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    return this.dotTuyenSinhService.receiveFileNguyenVong(Number.parseInt(id), file);
  }

  @Post('save-dsxt/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileAndSave(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    return this.dotTuyenSinhService.receiveFileNguyenVongAndSave(Number.parseInt(id), file);
  }

  // @Get('filter/:id')
  // locDSTT(@Param('id') id: string) {
  //   return this.dotTuyenSinhService.locDSTrungTuyen(Number.parseInt(id));
  // }
}
