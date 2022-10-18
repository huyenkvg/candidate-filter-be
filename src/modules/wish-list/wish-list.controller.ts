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

@Controller('wish-list')
export class WishListController {
  constructor(private readonly wishListService: WishListService) { }

  @Post('upfile')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    // log excel content
    XLSX.utils.sheet_to_json(workbook.Sheets['Mini']).forEach((row) => {
      console.log(row);
    });
    return this.wishListService.receiveFile();
  }

  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: 'media'
  //     , filename: (req, file, cb) => {
  //       // console.log('req :>> ', req.params.idAsset);
  //       // cb(null, `${req.params.idAsset}.jpg`)
  //     }
  //   })
  // }))
  // // @UseInterceptors(FileInterceptor('file'))
  // @Post('up')
  // uploadFileAndPassValidation(
  //   // @Param('idAsset') idAsset: string,
  //   // @Body() body: CreateAssetDto,
  //   @UploadedFile()
  //   file: Express.Multer.File,
  // ) {

  //   // file.fieldname = `hihi${extname(file.originalname)}`;
  //   console.log('file :>> ', file);
  //   // return {
  //   //   body,
  //   // };
  // }
}
