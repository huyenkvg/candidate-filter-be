import { Injectable } from '@nestjs/common';
import { CreateFileHandlerDto } from './dto/create-file-handler.dto';
import { UpdateFileHandlerDto } from './dto/update-file-handler.dto';



import * as XLSX from 'xlsx';
import FileUtils from 'src/utils/file-utils';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FileHandlerService {
  prisma = new PrismaClient();
  uploadChiTieu(file) {
    if (!file) {
      return { error: 'No sheet named Mini' };
    }
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      if (!XLSX.utils.sheet_to_json(workbook.Sheets['Mini']))
        return { error: 'Không có Sheet "Mini", Hãy xem lại yêu cầu định dạng file hoặc sử dụng template' };
      const rows = XLSX.utils
        .sheet_to_json(workbook.Sheets['Mini'])
        .map((row) => {
          let obj = FileUtils.rowToObject(row);
          return obj['maToHopXetTuyen'] ? { ...obj, maToHopXetTuyen: FileUtils.chuanHoaArrayData(obj['maToHopXetTuyen']) } : obj;
        });
      const headerObject = FileUtils.getWishListHeaderObject(
        XLSX.utils.sheet_to_json(workbook.Sheets['Mini'])[0],
      );
      console.log('headerObject :>> ', headerObject);
      // if (!Object.keys(headerObject).includes('maNganh') || !Object.keys(headerObject).includes('tenNganh') || !Object.keys(headerObject).includes('diemSan') || !Object.keys(headerObject).includes('chiTieubanDau')) {
      //   return { error: 'Không đúng định dạng file, Hãy xem lại các trường dữ liệu bắt buộc có hoặc sử dụng template' };
      // }


      return {
        rows: rows,
        headerObject,
      };
    } catch (e) {
      console.log('e :>> ', e);
      return {
        error: 'Error while parsing file',
      };
    }
    return 'ok';
  }
  removeChiTieu(maDotTuyenSinh) {
    return this.prisma.chi_tieu_to_hop.deleteMany({
      where: {
        maDotTuyenSinh,
      },
    }).then((res) => {
      return this.prisma.chi_tieu_tuyen_sinh.deleteMany({
        where: {
          maDotTuyenSinh,
        },
      });
    })
  }

  uploadChiTieuAndSave(file, maDotTuyenSinh) {
    if (!file) {
      return { error: 'No sheet named Mini' };
    }
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      if (!XLSX.utils.sheet_to_json(workbook.Sheets['Mini']))
        return { error: 'Không có Sheet "Mini", Hãy xem lại yêu cầu định dạng file hoặc sử dụng template' };
      const rows = XLSX.utils
        .sheet_to_json(workbook.Sheets['Mini'])
        .map((row) => {
          let obj = FileUtils.rowToObject(row);
          return obj['maToHopXetTuyen'] ? { ...obj, maToHopXetTuyen: FileUtils.chuanHoaArrayData(obj['maToHopXetTuyen']) } : obj;
        });
      const headerObject = FileUtils.getWishListHeaderObject(
        XLSX.utils.sheet_to_json(workbook.Sheets['Mini'])[0],
      );
      console.log('headerObject :>> ', headerObject);
      // if (!Object.keys(headerObject).includes('maNganh') || !Object.keys(headerObject).includes('tenNganh') || !Object.keys(headerObject).includes('diemSan') || !Object.keys(headerObject).includes('chiTieubanDau')) {
      //   return { error: 'Không đúng định dạng file, Hãy xem lại các trường dữ liệu bắt buộc có hoặc sử dụng template' };
      // }

      return this.removeChiTieu(maDotTuyenSinh).then(() => {
        const chiTieuTuyenSinh = rows.map((row) => {
          return {
            maDotTuyenSinh,
            maNganh: '' + row['maNganh'],
            diemSan: Number.parseFloat(row['diemSan']),
            chiTieu: Number.parseInt(row['chiTieuBanDau']),
          };
        });
        return this.prisma.chi_tieu_tuyen_sinh.createMany({
          data: chiTieuTuyenSinh,
        }).then(() => {
          const chiTieuToHop = rows.map((row) =>
            row['maToHopXetTuyen'].map(maTohop => ({
              maDotTuyenSinh,
              maNganh: '' + row['maNganh'],
              maToHop: maTohop,
              chiTieu: null,
            }))
          ).flat();
          console.log('chiTieuToHop :>> ', chiTieuToHop);
          return this.prisma.chi_tieu_to_hop.createMany({
            data: chiTieuToHop,
          });
        })
      }).catch((e) => {
        console.log('e :>> ', e);
        return {
          error: 'Error while creating chi-tieu-tuyen-sinh',
        };
      })

    } catch (e) {
      console.log('e :>> ', e);
      return {
        error: 'Error while parsing file',
      };
    }
    return 'ok';
  }


}
