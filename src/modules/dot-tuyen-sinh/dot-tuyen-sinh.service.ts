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
  async get_danh_sach_diem_chuan(maDotTuyenSinh: number) {
    return await this.prisma.diem_chuan.findMany({
      where: {
        maDotTuyenSinh: maDotTuyenSinh
      }
    }).then((r) => {
      console.log('r :>> ', r);
      if (r.length > 0 && !r.some(e => e.diemChuan == null || e.diemChuan == undefined || e.diemChuan == '{}'))
        return r;
      else {


        return this.prisma.$queryRaw<any[]>`select tenKhoa, tenDotTuyenSinh, nganh.maNganh, tenNganh, min(tongDiem) as diemChuan from danh_sach_trung_tuyen inner join danh_sach_nguyen_vong 
        on danh_sach_trung_tuyen.soBaoDanh = danh_sach_nguyen_vong.soBaoDanh and danh_sach_nguyen_vong.nguyenVong = danh_sach_trung_tuyen.nguyenVongTrungTuyen 
        and danh_sach_trung_tuyen.maDotTuyenSinh = danh_sach_nguyen_vong.maDotTuyenSinh   
        inner join nganh on danh_sach_nguyen_vong.maNganh = nganh.maNganh
        inner join dot_tuyen_sinh on dot_tuyen_sinh.maDotTuyenSinh = danh_sach_trung_tuyen.maDotTuyenSinh
        inner join khoa_tuyen_sinh as kts on danh_sach_nguyen_vong.maKhoaTuyenSinh = kts.maKhoa
        where  dot_tuyen_sinh.maDotTuyenSinh = ${maDotTuyenSinh}
        group by tenKhoa, tenDotTuyenSinh, nganh.maNganh, tenNganh`
      }
    }).catch((e) => {
      return this.prisma.$queryRaw<any[]>`select tenKhoa, tenDotTuyenSinh, nganh.maNganh, tenNganh, min(tongDiem) as diemChuan from danh_sach_trung_tuyen inner join danh_sach_nguyen_vong 
    on danh_sach_trung_tuyen.soBaoDanh = danh_sach_nguyen_vong.soBaoDanh and danh_sach_nguyen_vong.nguyenVong = danh_sach_trung_tuyen.nguyenVongTrungTuyen 
    and danh_sach_trung_tuyen.maDotTuyenSinh = danh_sach_nguyen_vong.maDotTuyenSinh   
    inner join nganh on danh_sach_nguyen_vong.maNganh = nganh.maNganh
    inner join dot_tuyen_sinh on dot_tuyen_sinh.maDotTuyenSinh = danh_sach_trung_tuyen.maDotTuyenSinh
    inner join khoa_tuyen_sinh as kts on danh_sach_nguyen_vong.maKhoaTuyenSinh = kts.maKhoa
    where  dot_tuyen_sinh.maDotTuyenSinh = ${maDotTuyenSinh}
    group by tenKhoa, tenDotTuyenSinh, nganh.maNganh, tenNganh`
    })
  }
  async re_filter_danh_sach_trung_tuyen(maDotTuyenSinh: number, maKhoaTuyenSinh: number, danh_sach_diem_chuan: any[]) {
    await this.prisma.$executeRaw`delete from danh_sach_trung_tuyen where maDotTuyenSinh = ${maDotTuyenSinh}`
    return await this.prisma.danh_sach_nguyen_vong.findMany({
      where: {
        maDotTuyenSinh: maDotTuyenSinh
      }
    }).then((wish_list) => {
      const data = this.wl_service.huyenKute_refilter(this.wl_service.groupBy(wish_list.map((w) => ({ ...w, combinedKey: `${w.soBaoDanh}@${w.maNganh}` })), 'combinedKey'), danh_sach_diem_chuan);

      // console.log(' data :>> ', data);
      // console.log('object :>> ', object);
      return this.prisma.danh_sach_trung_tuyen.createMany({
        data: Object.values(data).flat().map((d) => ({
          soBaoDanh: d['soBaoDanh'],
          maKhoaTuyenSinh: maKhoaTuyenSinh,
          maDotTuyenSinh: maDotTuyenSinh,
          nguyenVongTrungTuyen: d['nguyenVong'],
        })),
      })
    })


  }
  async save_danh_sach_diem_chuan(maDotTuyenSinh: number, data: any[]) {
    await this.prisma.diem_chuan.deleteMany({
      where: {
        maDotTuyenSinh: maDotTuyenSinh
      }
    })
    const khoa = await this.prisma.dot_tuyen_sinh.findUnique({
      where: {
        maDotTuyenSinh: maDotTuyenSinh
      },
      select: {
        maKhoaTuyenSinh: true
      }
    })
    await this.prisma.diem_chuan.createMany({
      data: Object.keys(data).map(ki => {
        return {
          maDotTuyenSinh: maDotTuyenSinh,
          maNganh: ki,
          diemChuan: JSON.stringify(data[ki]),
        }
      })
    }).then(r => {
      return this.re_filter_danh_sach_trung_tuyen(maDotTuyenSinh, khoa.maKhoaTuyenSinh, data)
    }).catch(e => {
      console.log(e);
    })
  }

  async get_DSXT(maDotTuyenSinh: number) {
    return await this.prisma.$queryRaw<any[]>`SELECT * FROM danh_sach_nguyen_vong, thong_tin_ca_nhan WHERE danh_sach_nguyen_vong.maDotTuyenSinh = ${maDotTuyenSinh} and (danh_sach_nguyen_vong.soBaoDanh = thong_tin_ca_nhan.soBaoDanh Or danh_sach_nguyen_vong.soBaoDanh = thong_tin_ca_nhan.cmnd and  thong_tin_ca_nhan.cmnd is not null) and  thong_tin_ca_nhan.maKhoaTuyenSinh = (select maKhoaTuyenSinh from dot_tuyen_sinh where maDotTuyenSinh = ${maDotTuyenSinh})`;
  }
  async get_DSTT(maDotTuyenSinh: number) {
    return await this.prisma.$queryRaw<any[]>`SELECT * FROM danh_sach_trung_tuyen inner join danh_sach_nguyen_vong on danh_sach_trung_tuyen.sobaoDanh = danh_sach_nguyen_vong.sobaoDanh and danh_sach_trung_tuyen.maDotTuyenSinh = danh_sach_nguyen_vong.maDotTuyenSinh and danh_sach_trung_tuyen.nguyenVongTrungTuyen = danh_sach_nguyen_vong.nguyenVong 
    inner join thong_tin_ca_nhan on (danh_sach_trung_tuyen.sobaoDanh = thong_tin_ca_nhan.sobaoDanh or danh_sach_trung_tuyen.sobaoDanh = thong_tin_ca_nhan.sobaoDanh ) and danh_sach_trung_tuyen.maDotTuyenSinh = ${maDotTuyenSinh} and thong_tin_ca_nhan.maKhoaTuyenSinh = (select maKhoaTuyenSinh from dot_tuyen_sinh where maDotTuyenSinh = ${maDotTuyenSinh})`;
    // , thong_tin_ca_nhan WHERE danh_sach_trung_tuyen.maDotTuyenSinh = ${maDotTuyenSinh} and (danh_sach_trung_tuyen.soBaoDanh = thong_tin_ca_nhan.soBaoDanh Or danh_sach_trung_tuyen.soBaoDanh = thong_tin_ca_nhan.cmnd)`;
  }


  async getInfo(id: number) {
    return await this.prisma.dot_tuyen_sinh.findUnique({
      where: {
        maDotTuyenSinh: id,
      },
      include: {
        chi_tieu_tuyen_sinh: {
          include: {
            chi_tieu_to_hop: true,
            nganh: true,
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
    })
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

  async remove(id: number) {

    // const deleteDSTT= this.prisma.danh_sach_trung_tuyen.deleteMany({
    //   where: {
    //     maDotTuyenSinh: id,
    //   },
    // });
    // const deleteDSNV= this.prisma.danh_sach_nguyen_vong.deleteMany({
    //   where: {
    //     maDotTuyenSinh: id,
    //   },
    // });
    // const deleteCTTS= this.prisma.chi_tieu_tuyen_sinh.deleteMany({
    //   where: {
    //     maDotTuyenSinh: id,
    //   },
    // });
    // const deleteCTTH= this.prisma.chi_tieu_to_hop.deleteMany({
    //   where: {
    //     maDotTuyenSinh: id,
    //   },
    // });
    // const deleteDot = this.prisma.dot_tuyen_sinh.delete({
    //   where: {
    //     maDotTuyenSinh: id,
    //   },
    // });



    // return await this.prisma.$transaction([deleteDSTT, deleteDSNV]).then(()=>{
    //   return this.prisma.$transaction([deleteCTTS, deleteCTTH]).then(()=>{
    //     return this.prisma.$transaction([deleteDot]);
    //   })
    // });
    await this.prisma.$queryRaw`DELETE FROM danh_sach_trung_tuyen WHERE maDotTuyenSinh = ${id}`;
    await this.prisma.$queryRaw`DELETE FROM danh_sach_nguyen_vong WHERE maDotTuyenSinh = ${id}`;
    await this.prisma.$queryRaw`DELETE FROM chi_tieu_to_hop WHERE maDotTuyenSinh = ${id}`;
    await this.prisma.$queryRaw`DELETE FROM chi_tieu_tuyen_sinh WHERE maDotTuyenSinh = ${id}`;
    return await this.prisma.$queryRaw`DELETE FROM dot_tuyen_sinh WHERE maDotTuyenSinh = ${id}`;

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
  // kiểm tra nguyện vọng có hợp lệ không
  // nguyện vọng hợp lệ là nguyện vọng có tồn tại trong chi tiêu của đợt tuyển sinh
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
  // kiểm tra trùng thí sinh
  // trùng thí sinh là thí sinh có nguyện vọng khác và đã xác nhận nhập học đã đậu đợt tuyển khác nhưng cùng khoá tuyển sinh
  async kiemTraTrungThiSinh(wishList, maDotTuyenSinh) {
    const khoa_tuyen_sinh = await this.prisma.dot_tuyen_sinh.findUnique({
      where: {
        maDotTuyenSinh: maDotTuyenSinh,
      },
      select: {
        maKhoaTuyenSinh: true,
      },
    });
    return this.kiemTraNguyenVong(wishList, maDotTuyenSinh).then((data) => {
      return this.prisma.$queryRaw<any[]>`SELECT * FROM danh_sach_trung_tuyen inner join danh_sach_nguyen_vong on (danh_sach_trung_tuyen.soBaoDanh = danh_sach_nguyen_vong.soBaoDanh ) inner join nganh on danh_sach_nguyen_vong.maNganh = nganh.maNganh WHERE danh_sach_trung_tuyen.maKhoaTuyenSinh = ${khoa_tuyen_sinh.maKhoaTuyenSinh} and danh_sach_trung_tuyen.lock = 'true'`.then((res) => {
        // console.log('res :>> ', res);
        // item là nguyện vọng đợt trước trúng tuyển
        // curr là nguyện vọng đợt hiện tại
        return data.valid.reduce((retu, curr) => {
          const nv_da_nhap_hoc = res.find((item) => {
            // console.log('item :>> ', item);
            // return (item.maDotTuyenSinh < maDotTuyenSinh &&    item.soBaoDanh == curr.soBaoDanh && item.nguyenVongTrungTuyen <= curr.nguyenVong || item.soBaoDanh == curr.cmnd && item.nguyenVongTrungTuyen <= curr.nguyenVong);
            return (item.lock && item.soBaoDanh == curr.soBaoDanh || item.soBaoDanh == curr.cmnd || (item.cmnd || 'NULL-CMND') == curr.cmnd);


          });
          if (nv_da_nhap_hoc) {
            retu['invalid'].push({ soBaoDanh: curr.soBaoDanh, maNganh: curr.maNganh, maToHopXetTuyen: curr.maToHopXetTuyen, reason: `Thí sinh đã đậu và xác nhận nhập học ngành ${nv_da_nhap_hoc.tenNganh} ở lần xét tuyển trước đó.` });
          }
          else {
            retu['valid'].push(curr);
          }
          return retu;
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
      if (wishList.length > 0 && typeof (wishList[0]['soBaoDanh']) != 'string' || typeof (wishList[0]['maNganh']) != 'string' || typeof (wishList[0]['nguyenVong']) != 'number' || typeof (wishList[0]['tongDiem']) != 'number' || typeof (wishList[0]['maToHopXetTuyen']) != 'string') {
        return { error: 'Số báo danh, mã ngành, mã tổ hợp xét tuyển, phải là chuỗi ký tự. Nguyện vọng và tổng điểm phải là số' };
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
      if (wishList.length > 0 && typeof (wishList[0]['soBaoDanh']) != 'string') {
        return { error: 'Số báo danh phải là chuỗi ký tự' };
      }

      await this.kiemTraTrungThiSinh(wishList, id).then(async (res) => {
        if (res.valid.length > 0) {
          try {

            return await this.deleteManyNguyenVongByDotTuyenSinh(id).then(() => {
              // console.log('r_delete :>> ', r_delete);
              this.prisma.$executeRaw`DELETE FROM diem_chuan WHERE maDotTuyenSinh = ${id}`
              return this.createManyNguyenVong(id, res.valid).then(async r => {
                // Thêm vào ds nguyện vọng thành công
                  // lọc ds nguyện vọng
                  // console.log('wishList[1] :>> ', wishList[1]);
                  // console.log('res.valid 1 :>> ',res.valid[1]);
                return this.locDSTrungTuyen(id, await this.wl_service.groupBy(res.valid, 'combinedKey'));

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
  async receiveFileTuyenThang(id: number, file) {
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
      if (!Object.keys(headerObject).includes('soBaoDanh') || !Object.keys(headerObject).includes('maNganh') || !Object.keys(headerObject).includes('nguyenVong') || !Object.keys(headerObject).includes('dieuKienKhac')) {
        return { error: 'Không đúng định dạng file, Hệ Thống cần "SỐ BÁO DANH" "MÃ NGÀNH", "NGUYỆN VỌNG" và "ĐIỀU KIỆN KHÁC" ' };
      }
      if (wishList.length > 0 && typeof (wishList[0]['soBaoDanh']) != 'string') {
        return { error: 'Số báo danh phải là chuỗi ký tự' };
      }
      // return { error: 'OKKKKK' };;

      await this.kiemTraTrungThiSinh(wishList, id).then(async (res) => {
        if (res.valid.length > 0) {
          try {
            return await this.deleteManyNguyenVongByDotTuyenSinh(id).then(() => {
              return this.tuyenThangDanhSach(id, res.valid) ? true : { error: 'Error while saving file' };
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
    await Promise.all([
      await this.prisma.$executeRaw`DELETE FROM danh_sach_trung_tuyen WHERE maDotTuyenSinh = ${maDotTuyenSinh}`,
      await this.prisma.$executeRaw`DELETE FROM danh_sach_nguyen_vong WHERE maDotTuyenSinh = ${maDotTuyenSinh}`,
    ]);
  }
  async createManyDSTT(maDotTuyenSinh, data, khoa) {

    return Promise.all(data.map(async (item) => {
      try {
        await this.prisma.danh_sach_trung_tuyen.create({
          data: {
            maDotTuyenSinh: maDotTuyenSinh,
            soBaoDanh: '' + item.soBaoDanh,
            nguyenVongTrungTuyen: item.nguyenVong,
            maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
          }
        })
      } catch (e) {
        // console.log('data e :>> ', e);
        // Lỗi trùng  sẽ nhảy vào đây
        // Trùng Thí sinh ở 1 khoá thì ta sẽ xem xét nguyện vọng
        await this.prisma.danh_sach_trung_tuyen.findFirst({
          where: {
            maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
            soBaoDanh: '' + item.soBaoDanh,
          },
          include: {
            danh_sach_nguyen_vong: true
          }
        }).then(r => {
          // console.log('r: :>> ', r:);
          // console.log('nguyện vọng đợt này là :>> ', item.nguyenVong);
          // console.log('trùng thí sinh: thí sinh đã đậu 1 đợt trong khoá  :>> ', r);
          // xét xem, nguyện vọng trước đó có nhỏ hơn nguyện vọng này không
          // và xét xem nguyện vọng trước đó có xac nhận nhập học chưa
          if (r && r.maDotTuyenSinh <= maDotTuyenSinh && item.nguyenVong < r.nguyenVongTrungTuyen) { // đợt đã đậu xảy ra trước và nguyện vọng của đợt này nhỏ hơn đợt đã đậu
            // Nếu đúng, ta sẽ chuyển nguỵen vọng này vào danh sách trúng tuyển thay cho nguyện vọng cũ
          console.log('nguyện vọng đợt này là :>> ', item.nguyenVong);
            console.log('trùng thí sinh: thí sinh đã đậu 1 đợt trong khoá, và sẽ bị thay thế  :>> ', r);
            try {
              this.prisma.danh_sach_trung_tuyen.update({
                where: {
                  maKhoaTuyenSinh_soBaoDanh: {
                    maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
                    soBaoDanh: '' + item.soBaoDanh,
                  }
                },
                data: {
                  nguyenVongTrungTuyen: item.nguyenVong,
                  maDotTuyenSinh: maDotTuyenSinh
                }
              })
            }
            catch (e) {
              console.log('e :>> ', e);
            }

          }
          else {
            console.log('data e :>> ', e);
            console.log('error item :>> ', item);

            switch (e.code) {
              case 'P2002':
                return { error: 'Trùng số báo danh' };
              default:
                return { error: 'Lỗi khi tạo danh sách trúng tuyển' };
            }
          }
        })
        // return false;
      }
    })
    )
  }
  // được thì được không được thì update
  async createManyThongThinCaNhan(data, khoa) {
    return Promise.all(data.map(async (item) => {
      try {
        await this.prisma.thong_tin_ca_nhan.create({
          data: {
            soBaoDanh: item.soBaoDanh,
            maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
            hoTen: item.hoTen,
            cmnd: item.cmnd,
            soDienThoai: item.soDienThoai,
            email: item.email,
            goiTinh: item.gioiTinh,
            diaChiGiayBao: item.diaChiGiayBao,
            ngaySinh: item.ngaySinh,
            maTinh: item.maTinh,
            maTruong: item.maTruong,
          }
        })
      } catch (e) {
        // return false;
      }
    })
    )
  }
  // async createManyThongThinCaNhan(data, khoa) {
  //   console.log('data.length :>> ', data.length);
  //   return await this.prisma.thong_tin_ca_nhan.createMany({
  //     data: data.map((item) => ({
  //       soBaoDanh: item.soBaoDanh,
  //       maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
  //       hoTen: item.hoTen,
  //       cmnd: item.cmnd,
  //       // soDienThoai: item.soDienThoai,
  //       // email: item.email,
  //       // goiTinh: item.gioiTinh,
  //       // diaChiGiayBao: item.diaChiGiayBao,
  //       // ngaySinh: item.ngaySinh,
  //       // maTinh: item.maTinh,
  //       // maTruong: item.maTruong,
  //     })),
  //   }).catch(e => {
  //     console.log('e :>> ', e);
  //   })
  //   // await Promise.all(data.map(async (item) => {
  //   //   try {
  //   //     await this.prisma.$queryRaw`INSERT INTO "thong_tin_ca_nhan" ("soBaoDanh", "maKhoaTuyenSinh", "hoTen", "cmnd", "soDienThoai", "email", "goiTinh", "diaChiGiayBao", "ngaySinh", "maTinh", "maTruong"
  //   //     ) VALUES (${item.soBaoDanh}, ${khoa.maKhoaTuyenSinh}, ${item.hoTen}, ${item.cmnd}, ${item.soDienThoai}, ${item.email}, ${item.gioiTinh}, ${item.diaChiGiayBao}, ${item.ngaySinh}, ${item.maTinh}, ${item.maTruong})`;
  //   //   } catch (e) {
  //   //     // await this.prisma.$queryRaw`UPDATE "thong_tin_ca_nhan" SET "hoTen" = ${item.hoTen}, "cmnd" = ${item.cmnd}, "soDienThoai" = ${item.soDienThoai}, "email" = ${item.email}, "goiTinh" = ${item.gioiTinh}, "diaChiGiayBao" = ${item.diaChiGiayBao}, "ngaySinh" = ${item.ngaySinh}, "maTinh" = ${item.maTinh}, "maTruong" = ${item.maTruong} WHERE "soBaoDanh" = ${item.soBaoDanh} and "maKhoaTuyenSinh" = ${khoa.maKhoaTuyenSinh}`;
  //   //     // console.log('e :>> ', e);
  //   //     // return false;
  //   //   }
  //   // })
  //   // )
  // }
  // ĐÂY LÀ CREAT NGUYỆN VỌNG XÉT TUYỂN BÌNH THƯỜNG, SO BẰNG TỔNG ĐIỂM NÊN KHÔNG CẦN ĐIỀU KIỆN KHÁC
  // CÒN CÁC IELTS, TOEFL, SAT, ACT, THÌ CẦN GỌI  CREAT NGUYỆN VỌNG XÉT TUYỂN ĐẶC BIỆT, CREATE NGUYỆN VỌNG XÉT TUYỂN ĐẶC BIỆT không lọc theo điểm nữa mà so thứ tự nguyện vọng  với các đợt khác rồi PASS THẲNG SANG TRÚNG TUYỂN
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
      console.log('khoa :>> ', khoa);
      return this.createManyThongThinCaNhan(data, khoa).finally(() => {
        return this.prisma.danh_sach_nguyen_vong.createMany({
          data: data.map((item) => {
            return {
              maDotTuyenSinh: maDotTuyenSinh,
              maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
              soBaoDanh: '' + item.soBaoDanh ? item.soBaoDanh : item.cmnd,
              cmnd: '' + item.cmnd,
              maNganh: '' + item.maNganh,
              dieuKienKhac: null,
              maToHopXetTuyen: '' + item.maToHopXetTuyen,
              nguyenVong: Number.parseInt(item.nguyenVong),
              tongDiem: (item.tongDiem),
            };
          }),

        });
      })

    }).catch((e) => {
      return false
    })

  }
  async createManyTrungTuyenThang(id: number, data) {
    const khoa = await this.prisma.dot_tuyen_sinh.findUnique({
      where: {
        maDotTuyenSinh: id,
      },
      select: {
        maKhoaTuyenSinh: true,
      },
    });
    try {
      await this.createManyThongThinCaNhan(data, khoa);
      await this.prisma.danh_sach_nguyen_vong.createMany({
        data: data.map((item) => {
          return {
            maDotTuyenSinh: id,
            maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
            soBaoDanh: '' + item.soBaoDanh ? item.soBaoDanh : item.cmnd,
            cmnd: '' + item.cmnd,
            maNganh: '' + item.maNganh,
            dieuKienKhac: item.dieuKienKhac,
            // maToHopXetTuyen: '' + item.maToHopXetTuyen,
            tongDiem: null,
            nguyenVong: Number.parseInt(item.nguyenVong),
            // tongDiem: (item.tongDiem),
          };
        })
      })
      await this.prisma.danh_sach_trung_tuyen.createMany({
        data: data.map((item) => {
          return {
            maDotTuyenSinh: id,
            maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
            soBaoDanh: '' + item.soBaoDanh ? item.soBaoDanh : item.cmnd,
            nguyenVongTrungTuyen: Number.parseInt(item.nguyenVong),
          };
        })
      })
    }
    catch (e) {
      console.log('e :>> ', e);
      return false;
    }


  }
  tuyenThangDanhSach(maDotTuyenSinh: number, wish_list) {

    const ds_trung_tuyen = wish_list.reduce((res, cur) => {
      if (!res[cur.soBaoDanh]) {
        res[cur.soBaoDanh] = cur;
      }
      if (res[cur.soBaoDanh].nguyenVong > cur.nguyenVong) {
        res[cur.soBaoDanh] = cur;
      }
      return res;
    }, {});
    const data = Object.values(ds_trung_tuyen);
    return this.createManyTrungTuyenThang(maDotTuyenSinh, data);
    // console.log('count :>> ',data.length);
    // console.log('ds_trung_tuyen :>> ', data);

  }

  // truyeenf vaof ID dot tuyen sinh và ds nguyện vọng được group theo soBaoDanh@maNganh
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
      // console.log('count :>> ', count);

      console.log('count2 - count trung tt :>> ', count2);
      return this.prisma.$executeRaw`DELETE FROM danh_sach_trung_tuyen WHERE maDotTuyenSinh = ${maDotTuyenSinh}`
        .then(() => {
          return this.createManyDSTT(maDotTuyenSinh, Object.values(dstt).flat(), khoa)
      //   return this.prisma.danh_sach_trung_tuyen.createMany({
      //   data: Object.values(dstt).flat().map((item: any) => (
      //     {
      //       maDotTuyenSinh: maDotTuyenSinh,
      //       soBaoDanh: item.soBaoDanh,
      //       nguyenVongTrungTuyen: item.nguyenVong,
      //       maKhoaTuyenSinh: khoa.maKhoaTuyenSinh,
      //     }
      //   ))
      // })
        }).catch((e) => {
          console.log('e :>> ', e);
          return false;
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
          chi_tieu_to_hop: true,
        },
      }).then(r => {
        return r.reduce((obj, item) => {
          obj[item.maNganh] = item.chiTieu;
          obj[item.maNganh + '-chitieutohop'] = item.chi_tieu_to_hop.length > 0 ? item.chi_tieu_to_hop : null;
          console.log('item.maNganh + -chitieutohop :>> ', item.maNganh + '-chitieutohop');
          console.log('obj[] :>> ', obj[item.maNganh + '-chitieutohop']);
          return obj;
        }, {});
      }).catch(e => {
        return {};
      })
    }
  }
  //==================================================================================================

  async uploadFileXacNhanNhapHoc(id: number, file, save: boolean = false) {
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
      if (!Object.keys(headerObject).includes('soBaoDanh')) {
        return { error: 'Không đúng định dạng file, Hệ Thống cần "SỐ BÁO DANH" ' };
      }
      if (wishList.length > 0 && typeof (wishList[0]['soBaoDanh']) != 'string') {
        return { error: 'dữ liệu cột "SỐ BÁO DANH" phải là chuỗi ký tự' };
      }
      // return { error: 'OKKKKK' };;
      if (save) {
        this.prisma.danh_sach_trung_tuyen.updateMany({
          where: {
            maDotTuyenSinh: id,
            soBaoDanh: {
              in: wishList.map((item) => item['soBaoDanh']),
            },
          },
          data: {
            lock: true,
          },
        }).then((r) => {
          console.log('r :>> ', r);
        }).catch((e) => {
          console.log('e :>> ', e);
        });
        ;
      }
      return {
        validRows: wishList,
      };

    } catch (e) {
      console.log('e :>> ', e);
      return {
        error: 'Error while parsing file',
      };
    }
  }

}
