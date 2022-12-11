import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Request, Query, Res, StreamableFile } from '@nestjs/common';
import { FileHandlerService } from './file-handler.service';
import { CreateFileHandlerDto } from './dto/create-file-handler.dto';
import { UpdateFileHandlerDto } from './dto/update-file-handler.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response } from 'express';

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



}
