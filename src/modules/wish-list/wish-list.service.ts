import { Injectable } from '@nestjs/common';
import { CreateWishListDto } from './dto/create-wish-list.dto';
import { UpdateWishListDto } from './dto/update-wish-list.dto';

import * as XLSX from 'xlsx';
import FileUtils from 'src/utils/file-utils';

@Injectable()
export class WishListService {
  create(createWishListDto: CreateWishListDto) {
    return 'This action adds a new wishList';
  }


  receiveFile(file) {
    console.log('file :>> ', file);
    if(!file) { return; }
    
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const wishList = XLSX.utils.sheet_to_json(workbook.Sheets['Mini']).map((row) => FileUtils.wishListToObject(row));
    const headerObject = FileUtils.getWishListHeaderObject(XLSX.utils.sheet_to_json(workbook.Sheets['Mini'])[0]);
    return { wishList, headerObject };
  }
}
