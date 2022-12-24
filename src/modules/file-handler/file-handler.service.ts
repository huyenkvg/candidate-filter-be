import { Injectable } from '@nestjs/common';
import { CreateFileHandlerDto } from './dto/create-file-handler.dto';
import { UpdateFileHandlerDto } from './dto/update-file-handler.dto';



import * as XLSX from 'xlsx';
import FileUtils from 'src/utils/file-utils';
import { PrismaClient } from '@prisma/client';
const path = require('path');

const reader = require('xlsx');
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
      // console.log('headerObject :>> ', headerObject);
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
      // console.log('headerObject :>> ', headerObject);
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
          // console.log('chiTieuToHop :>> ', chiTieuToHop);
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

  tesst(file) {
    // console.log('file :>> ', file);
    if (!file) {
      return { error: 'No sheet named Mini' };
    }
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      if (!XLSX.utils.sheet_to_json(workbook.Sheets['Mini']))
        return { error: 'Không có Sheet "Mini", Hãy đổi tên Sheet cần đọc dữ liệu thành "Mini' };
      const loc_ao = XLSX.utils
        .sheet_to_json(workbook.Sheets['Mini2'])
        .map((row) => FileUtils.wishRowToObject(row));

      const dstt = XLSX.utils
        .sheet_to_json(workbook.Sheets['Mini'])
        .map((row) => FileUtils.wishRowToObject(row));
      // console.log('headerObject :>> ', headerObject);
      let  valid = 0;
      let hic = [];
      loc_ao.forEach((row) => { 
        if(dstt.find((item)=> (item['nguyenVong'] == row['nguyenVong'] && item['soBaoDanh'] == row['soBaoDanh'] && item['maNganh'] == row['maNganh']))){
          valid++;
        }
        else{
          hic.push(row);
        }

      })
      return {
        valid,
        hic
      };

    } catch (e) {
      console.log('e :>> ', e);
      return {
        error: 'Error while parsing file',
      };
    }


  }

  getFileHIHI() {
    const filePath = path.join('./templates/test.xlsx');
    const json = [
      {
        id: 1,
        color: 'red',
        number: 75
      },
      {
        id: 2,
        color: 'blue',
        number: 62
      },
      {
        id: 3,
        color: 'yellow',
        number: 93
      },
    ];

    let workBook = reader.utils.book_new();
    const workSheet = reader.utils.json_to_sheet(json);
    reader.utils.book_append_sheet(workBook, workSheet, `response`);
    let exportFileName = `template-export.xls`;
    return reader.writeFile(workBook, filePath, {
      bookType: 'xlsx',
      type: 'file'
    })
  }

  async getDSTTKhoa(maKhoaTuyenSinh: number) {
    const filePath = path.join('./templates/export.xlsx');
    const diem_chuan_nganh = await this.prisma.$queryRaw<any[]>`select tenKhoa, tenDotTuyenSinh, nganh.maNganh, tenNganh, count(danh_sach_trung_tuyen.soBaoDanh) as so_luong_trung_tuyen, ROUND(min(tongDiem),2) as diemChuan from danh_sach_trung_tuyen inner join danh_sach_nguyen_vong 
    on danh_sach_trung_tuyen.soBaoDanh = danh_sach_nguyen_vong.soBaoDanh and danh_sach_nguyen_vong.nguyenVong = danh_sach_trung_tuyen.nguyenVongTrungTuyen 
    and danh_sach_trung_tuyen.maDotTuyenSinh = danh_sach_nguyen_vong.maDotTuyenSinh   
    inner join nganh on danh_sach_nguyen_vong.maNganh = nganh.maNganh
    inner join dot_tuyen_sinh on dot_tuyen_sinh.maDotTuyenSinh = danh_sach_trung_tuyen.maDotTuyenSinh
    inner join khoa_tuyen_sinh as kts on danh_sach_trung_tuyen.maKhoaTuyenSinh = kts.maKhoa
    where  dot_tuyen_sinh.maDotTuyenSinh = ${maKhoaTuyenSinh}
    group by tenKhoa, tenDotTuyenSinh, nganh.maNganh, tenNganh`;

    const count_by_nganh = await this.prisma.$queryRaw<any[]>`SELECT count (*) as so_luong_trung_tuyen, dsnv.maNganh, dsnv.tenNganh  FROM 
    (select * from danh_sach_trung_tuyen where maKhoaTuyenSinh = ${maKhoaTuyenSinh}) a
    inner join (select * from thong_tin_ca_nhan  where maKhoaTuyenSinh = ${maKhoaTuyenSinh}) b
    on a.soBaoDanh = b.soBaoDanh
    left join (select soBaoDanh, maDotTuyenSinh, nguyenVong,  nganh.maNganh, tenNganh  from danh_sach_nguyen_vong left join nganh on danh_sach_nguyen_vong.maNganh =nganh.maNganh) dsnv  
    on dsnv.soBaoDanh = a.soBaoDanh and dsnv.nguyenVong = a.nguyenVongTrungTuyen and a.maDotTuyenSinh = dsnv.maDotTuyenSinh
    group by maNganh, dsnv.tenNganh`

    await this.prisma.$queryRaw<any[]>`SELECT * FROM 
    (select * from danh_sach_trung_tuyen where maKhoaTuyenSinh = ${maKhoaTuyenSinh}) a
    inner join (select * from thong_tin_ca_nhan  where maKhoaTuyenSinh = ${maKhoaTuyenSinh}) b
    on a.soBaoDanh = b.soBaoDanh
    left join danh_sach_nguyen_vong on danh_sach_nguyen_vong.soBaoDanh = a.soBaoDanh and nguyenVong = a.nguyenVongTrungTuyen and a.maDotTuyenSinh = danh_sach_nguyen_vong.maDotTuyenSinh
    `.then((json) => {
      // console.log('json :>> ', json);
      let workBook = reader.utils.book_new();
      const workSheet = reader.utils.json_to_sheet(json);
      const workSheet2 = reader.utils.json_to_sheet(count_by_nganh);
      const workSheet3 = reader.utils.json_to_sheet(diem_chuan_nganh);
      reader.utils.book_append_sheet(workBook, workSheet, `Mini`);
      reader.utils.book_append_sheet(workBook, workSheet2, `count_by_nganh`);
      // reader.utils.book_append_sheet(workBook, workSheet3, `diem_chuan_nganh`);
      let exportFileName = `export.xls`;
      return reader.writeFile(workBook, filePath, {
        bookType: 'xlsx',
        type: 'file'
      })
    })
  }
  async getDSNVKhoa(maKhoaTuyenSinh: number) {
    const filePath = path.join('./templates/export.xlsx');
    const x = await this.prisma.$queryRaw<any[]>`SELECT * FROM danh_sach_nguyen_vong inner join thong_tin_ca_nhan on danh_sach_nguyen_vong.soBaoDanh = thong_tin_ca_nhan.soBaoDanh  WHERE thong_tin_ca_nhan.maKhoaTuyenSinh = ${maKhoaTuyenSinh}`.then((json) => {
      // console.log('json :>> ', json);
      let workBook = reader.utils.book_new();
      const workSheet = reader.utils.json_to_sheet(json);
      reader.utils.book_append_sheet(workBook, workSheet, `Mini`);
      let exportFileName = `export.xls`;
      return reader.writeFile(workBook, filePath, {
        bookType: 'xlsx',
        type: 'file'
      })
    })
  }
  async getDSHOSOKhoa(maKhoaTuyenSinh: number) {
    const filePath = path.join('./templates/export.xlsx');
    const x = await this.prisma.$queryRaw<any[]>`SELECT * FROM thong_tin_ca_nhan WHERE maKhoaTuyenSinh = ${maKhoaTuyenSinh}`.then((json) => {
      // console.log('json :>> ', json);
      let workBook = reader.utils.book_new();
      const workSheet = reader.utils.json_to_sheet(json);
      reader.utils.book_append_sheet(workBook, workSheet, `Mini`);
      let exportFileName = `export.xls`;
      return reader.writeFile(workBook, filePath, {
        bookType: 'xlsx',
        type: 'file'
      })
    })
  }
}
