import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request, Query, Res, StreamableFile } from '@nestjs/common';
import { FileHandlerService } from './file-handler.service';
import { CreateFileHandlerDto } from './dto/create-file-handler.dto';
import { UpdateFileHandlerDto } from './dto/update-file-handler.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream, readFileSync } from 'fs';
import { join } from 'path';
import { Response } from 'express';
import { Readable } from 'stream';

@Controller('file-handler')
export class FileHandlerController {
  constructor(private readonly fileHandlerService: FileHandlerService) { }

  @Post('upload-chi-tieu')
  @UseInterceptors(FileInterceptor('file'))
  uploadFileChiTieu(@UploadedFile() file: Express.Multer.File, @Query() query) {
    console.log('body :>> ', query);
    if (query.save && query.maDotTuyenSinh) {
      return this.fileHandlerService.uploadChiTieuAndSave(file, Number.parseInt(query.maDotTuyenSinh));
    }
    return this.fileHandlerService.uploadChiTieu(file);
  }

  @Get('file')
  getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package.json"',
    });
    return new StreamableFile(file);
  }


  @Post('test-func')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileHandlerService.tesst( file);
  }

  @Get('nguyen-vong-mau')
  async getNVM(@Res() res: Response) {
    var buffer = readFileSync('./templates/NguyenVongMau.xlsx');
    // var buffer = this.fileHandlerService.getFileHIHI();
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Length': buffer.length,
    });
    stream.pipe(res);
  }
  @Get('report-dstt-khoa/:id')
  async getDSTTKhoa(@Res() res: Response, @Param('id') id: number) {
    this.fileHandlerService.getDSTTKhoa(id).then(() => {
      var buffer = readFileSync('./templates/export.xlsx');
      // var buffer = this.fileHandlerService.getFileHIHI();
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Length': buffer.length,
      });
      stream.pipe(res);
    });
  }
  @Get('report-dsnv-khoa/:id')
  async getDSNVKhoa(@Res() res: Response, @Param('id') id: number) {
    this.fileHandlerService.getDSNVKhoa(id).then(() => {
      var buffer = readFileSync('./templates/export.xlsx');
      // var buffer = this.fileHandlerService.getFileHIHI();
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Length': buffer.length,
      });
      stream.pipe(res);
    });
  }


}
