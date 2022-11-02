import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { WishListService } from './wish-list.service';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { UpdateWishListDto } from './dto/update-wish-list.dto';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as XLSX from 'xlsx';
import FileUtils from 'src/utils/file-utils';

@Controller('wish-list')
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Post('upfile')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.wishListService.receiveFile(file);
  }

  @Post('filter')
  @UseInterceptors(FileInterceptor('file'))
  filter(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    // console.log('file', file);
    // console.log('data :>> ', JSON.parse(body.data));
    return this.wishListService.receiveAndFilter(file, JSON.parse(body.data));
  }
}
