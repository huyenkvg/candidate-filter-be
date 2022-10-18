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
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const wishList = XLSX.utils.sheet_to_json(workbook.Sheets['Mini']).map((row) => FileUtils.wishListToObject(row));
    console.log('wl =>>', wishList);
    return this.wishListService.receiveFile();
  }
}
