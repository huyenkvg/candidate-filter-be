import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateDotTuyenSinhDto } from './dto/create-dot-tuyen-sinh.dto';
import { UpdateDotTuyenSinhDto } from './dto/update-dot-tuyen-sinh.dto';
import { UpdateChiTieuObj } from './dto/UpdateChiTieuObj.dto';

import * as XLSX from 'xlsx';
import FileUtils from 'src/utils/file-utils';
import { CreateDanhSachXetTuyenDto } from '../danh-sach-xet-tuyen/dto/create-danh-sach-xet-tuyen.dto';
import { WishListService } from '../wish-list/wish-list.service';
@Injectable()
export class DotTuyenSinhService {
  prisma = new PrismaClient();
  wl_service = new WishListService()
  create(createDotTuyenSinhDto: CreateDotTuyenSinhDto) {

    return this.prisma.dot_tuyen_sinh.create({
      data: createDotTuyenSinhDto,
    }).then(r => {
      this.prisma.dot_tuyen_sinh.updateMany({
        where: {
          maKhoaTuyenSinh: createDotTuyenSinhDto.maKhoaTuyenSinh,
        },
        data: {
          lock: true,
        },
      });
      return r;
    })

  }

  findAll() {
    return this.prisma.dot_tuyen_sinh.findMany();
  }

  getInfo(id: number) {
    return this.prisma.dot_tuyen_sinh.findUnique({
      where: {
        maDotTuyenSinh: id,
      },
      include: {
        danh_sach_trung_tuyen: true,
        danh_sach_nguyen_vong: true,
        chi_tieu_tuyen_sinh: {
          include: {
            chi_tieu_to_hop: true
          }
        },
        khoa_tuyen_sinh: true,
        _count: {
          select: {
            danh_sach_trung_tuyen: true,
            danh_sach_nguyen_vong: true,
            chi_tieu_tuyen_sinh: true,
          },
        },
      },
    });
  }

  update(updateDotTuyenSinhDto: UpdateDotTuyenSinhDto) {
    const { maDotTuyenSinh, ...data } = updateDotTuyenSinhDto;
    return this.prisma.dot_tuyen_sinh.update({
      where: {
        maDotTuyenSinh: maDotTuyenSinh,
      },
      data: data,
    });
  }

  remove(id: number) {
    return this.prisma.dot_tuyen_sinh.delete({
      where: {
        maDotTuyenSinh: id,
      },
    });
  }


  async updateChiTieuDot(id: number, data: UpdateChiTieuObj) {
    return this.prisma.chi_tieu_tuyen_sinh.createMany({
      data: data.chiTieuNganh,
    }).then(() => {
      return this.prisma.chi_tieu_to_hop.createMany({
        data: data.chiTieuToHop,
      });
    });
  }

  async kiemTraNguyenVong(wishList, maDotTuyenSinh) {

    return this.prisma.chi_tieu_tuyen_sinh.findMany({
      where: {
        maDotTuyenSinh: maDotTuyenSinh,
      },
      include: {
        chi_tieu_to_hop: true,
      },
    }).then(async (res) => {
      const chiTieuNganh = res;
      return await wishList.reduce((res, curr) => {
        const nganh = chiTieuNganh.find((item) => {
          return item.maNganh == curr.maNganh;
        });
        if (nganh) {
          const toHop = nganh.chi_tieu_to_hop.find((item) => {
            return item.maToHop == curr.maToHopXetTuyen;
          });
          if (toHop) {
            res['valid'].push(curr);
          }
          else {
            res['invalid'].push({ soBaoDanh: curr.soBaoDanh, maNganh: curr.maNganh, maToHopXetTuyen: curr.maToHopXetTuyen, reason: 'Không Tuyển tổ hợp này' });
          }

        }
        else {
          res['invalid'].push({ soBaoDanh: curr.soBaoDanh, maNganh: curr.maNganh, maToHopXetTuyen: curr.maToHopXetTuyen, reason: 'Không Tuyển ngành này' });
        }
        return res;
      }, { valid: [], invalid: [] });
    }).catch((err) => {
      console.log(err);
      return "failure"
    });
  }
  kiemTraTrungThiSinh(wishList, maDotTuyenSinh) {
    return this.kiemTraNguyenVong(wishList, maDotTuyenSinh).then((data) => {
      return this.prisma.danh_sach_trung_tuyen.findMany({
        where: {
          maDotTuyenSinh: maDotTuyenSinh,
        },
      }).then((res) => {
        return data.valid.reduce((ret, curr) => {
          const trung = res.find((item) => {
            return item.soBaoDanh === curr.soBaoDanh;
          });
          if (trung) {
            ret['invalid'].push({ soBaoDanh: curr.soBaoDanh, maNganh: curr.maNganh, maToHopXetTuyen: curr.maToHopXetTuyen, reason: 'Đã Trúng tuyển ở đợt trước đó' });
          }
          else {
            ret['valid'].push(curr);
          }
          return ret;
        }, { valid: [], invalid: data.invalid });
      })
    })


  }

  async receiveFileNguyenVong(id: number, file) {
    // console.log('file :>> ', file);
    if (!file) {
      return { error: 'No sheet named Mini' };
    }
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      if (!XLSX.utils.sheet_to_json(workbook.Sheets['Mini']))
        return { error: 'Không có Sheet "Mini", Hãy đổi tên Sheet cần đọc dữ liệu thành "Mini' };
      const wishList = XLSX.utils
        .sheet_to_json(workbook.Sheets['Mini'])
        .map((row) => FileUtils.wishRowToObject(row));
      const headerObject = FileUtils.getWishListHeaderObject(
        XLSX.utils.sheet_to_json(workbook.Sheets['Mini'])[0],
      );
      if (!Object.keys(headerObject).includes('soBaoDanh') || !Object.keys(headerObject).includes('maNganh') || !Object.keys(headerObject).includes('nguyenVong') || !Object.keys(headerObject).includes('tongDiem') || !Object.keys(headerObject).includes('maToHopXetTuyen')) {
        return { error: 'Không đúng định dạng file, Bắt buộc có Số Báo Danh, Mã Ngành, Nguyện Vọng, Mã Tổ Hợp Xét Tuyển và Tổng Điểm' };
      }

      // console.log('object :>> ', await this.kiemTraNguyenVong(wishList, id));
      return {
        wishList: wishList,
        headerObject,
        checkList: await this.kiemTraTrungThiSinh(wishList, id),
        // dstt: this.huyenKute(groupBySoBaoDanh, chiTieuNganh)
      };
    } catch (e) {
      console.log('e :>> ', e);
      return {
        error: 'Error while parsing file',
      };
    }


  }
  async receiveFileNguyenVongAndSave(id: number, file) {
    // console.log('file :>> ', file);
    if (!file) {
      return { error: 'No sheet named Mini' };
    }
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      if (!XLSX.utils.sheet_to_json(workbook.Sheets['Mini']))
        return { error: 'Không có Sheet "Mini", Hãy xem lại yêu cầu định dạng file hoặc sử dụng template' };
      const wishList = XLSX.utils
        .sheet_to_json(workbook.Sheets['Mini'])
        .map((row) => FileUtils.wishRowToObject(row));
      const headerObject = FileUtils.getWishListHeaderObject(
        XLSX.utils.sheet_to_json(workbook.Sheets['Mini'])[0],
      );
      if (!Object.keys(headerObject).includes('soBaoDanh') || !Object.keys(headerObject).includes('maNganh') || !Object.keys(headerObject).includes('nguyenVong') || !Object.keys(headerObject).includes('tongDiem')) {
        return { error: 'Không đúng định dạng file, Hãy xem lại các trường dữ liệu bắt buộc có hoặc sử dụng template' };
      }

      await this.kiemTraTrungThiSinh(wishList, id).then(async (res) => {
        if (res.valid.length > 0) {
          try {
            return await this.deleteManyNguyenVongByDotTuyenSinh(id).then((r) => {
              console.log('r :>> ', r);
              return this.createManyNguyenVong(id, res.valid).then(async r => {
                if (r) {// Thêm vào ds nguyện vọng thành công
                  // lọc ds nguyện vọng
                  return this.locDSTrungTuyen(id, await this.wl_service.groupBy(wishList, 'combinedKey'));
                }
              }).catch(e => {
                console.log('e :>> ', e);
                return { error: 'Error while saving file' };
              })
            });
          }
          catch (e) {
            console.log('e :>> ', e);
            return e
          }
        }
      })

    } catch (e) {
      console.log('e :>> ', e);
      return {
        error: 'Error while parsing file',
      };
    }
  }

  async deleteManyNguyenVongByDotTuyenSinh(maDotTuyenSinh: number) {
    return {
      number:
        await this.prisma.$executeRaw`DELETE FROM "danh_sach_nguyen_vong" WHERE "maDotTuyenSinh" = ${maDotTuyenSinh}`,
    }
  }
  async createManyThongThinCaNhan(data, khoa) {
    return Promise.all(data.map(async (item) => {
      try {
        await this.prisma.thong_tin_ca_nhan.create({
          data: {
            soBaoDanh: item.soBaoDanh,
            maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
            hoTen: item.hoTen,
            cmnd: item.cmnd,
          }
        })
      } catch (e) {
        // return false;
      }
    })
    )
  }
  async createManyNguyenVong(maDotTuyenSinh: number, data: Array<any>) {

    return this.prisma.dot_tuyen_sinh.findUnique({
      where: {
        maDotTuyenSinh: maDotTuyenSinh,
      },
      select: {
        maKhoaTuyenSinh: true,
      },
    }).then((res) => {
      const khoa = res;
      return this.createManyThongThinCaNhan(data, khoa).finally(() => {
        return this.prisma.danh_sach_nguyen_vong.createMany({
          data: data.map((item) => {
            return {
              maDotTuyenSinh: maDotTuyenSinh,
              maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
              soBaoDanh: '' + item.soBaoDanh,
              maNganh: '' + item.maNganh,
              maToHopXetTuyen: '' + item.maToHopXetTuyen,
              nguyenVong: Number.parseInt(item.nguyenVong),
              tongDiem: (item.tongDiem),
            };
          })
        });
      })

    }).catch((e) => {
      return false
    })

  }


  async locDSTrungTuyen(maDotTuyenSinh: number, groupByCombinedKey: Object) {
    const khoa = await this.prisma.dot_tuyen_sinh.findUnique({
      where: {
        maDotTuyenSinh: maDotTuyenSinh,
      },
      select: {
        maKhoaTuyenSinh: true,
      },
    });
    return this.getDieuKienLoc(maDotTuyenSinh).then((data) => {
      const dstt = this.wl_service.huyenKute(groupByCombinedKey, data.chiTieuNganh, data.ds_dieukien, data.mota_dieukien)
      let count = {};
      let count2 = {};
      Object.values(dstt).flat().forEach((item: any) => {
        count[item.soBaoDanh] = (count[item.soBaoDanh] || 0) + 1;
        if (count[item.soBaoDanh] > 1) {
          count2[item.soBaoDanh] = count[item.soBaoDanh];
        }
      });
      console.log('count :>> ', count);
      console.log('count2 :>> ', count2);

      return this.prisma.danh_sach_trung_tuyen.createMany({
        data: Object.values(dstt).flat().map((item: any) => (
          {
            maDotTuyenSinh: maDotTuyenSinh,
            soBaoDanh: item.soBaoDanh,
            nguyenVongTrungTuyen: item.nguyenVong,
            maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
          }
        ))
      })

    })

  }

  async getDieuKienLoc(maDotTuyenSinh: number) {

    // "chiTieuNganh":{"7340101":"2","7340115":"2","7340301":"2","7480201":"2"},
    // "ds_dieukien":["tongDiem","nguyenVong"],
    // "mota_dieukien":{"tongDiem":"DESC","nguyenVong":"ASC"}

    return {
      ds_dieukien: ["tongDiem", "nguyenVong"],
      mota_dieukien: { tongDiem: "DESC", nguyenVong: "ASC" },
      chiTieuNganh: await this.prisma.chi_tieu_tuyen_sinh.findMany({
        where: {
          maDotTuyenSinh: maDotTuyenSinh,
        },
        select: {
          maNganh: true,
          chiTieu: true,
        },
      }).then(r => {
        return r.reduce((obj, item) => {
          obj[item.maNganh] = item.chiTieu;
          return obj;
        }, {});
      }).catch(e => {
        return {};
      })
    }
  }


}
