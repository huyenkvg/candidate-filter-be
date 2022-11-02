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

  groupBy(wishList, headerName) {
    // gom danh sách Nguyện Vọng nhóm theo headerName tuỳ ý, ở đây dùng là sốBáoDanh đối với thí sinh, mãNgành đối với ngành
    const groupedWishList = wishList.reduce((acc, item) => {
      const key = item[headerName];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
    // console.log('groupedWishList :>> ', groupedWishList);
    return groupedWishList;
  }
  checkChiTieu(chiTieuNganh: Object): boolean {
    // return true
    //============
    for (let key in chiTieuNganh) {
      if (chiTieuNganh[key] && chiTieuNganh[key] > 0) {
        return true;
      }
    }
    return false;
  }
  compareByDieuKien(a, b, ds_dieukien, mota_dieukien) {
    let result = 0;
    for (let i = 0; i < ds_dieukien.length; i++) {
      let opposite = mota_dieukien[ds_dieukien[i]] === 'asc' ? 1 : -1; 
      if (a[ds_dieukien[i]] > b[ds_dieukien[i]]) {
        result = 1*opposite;
        break;
      } else if (a[ds_dieukien[i]] < b[ds_dieukien[i]]) {
        result = -1*opposite;
        break;
      }
    }
    return result;
  }
  huyenKute(wishListOfAll: Object, chiTieuNganh: Object, ds_dieukien: Object, mota_dieukien: Object) {
    const dsTrungTuyen = {};
    const dsTrungTuyenTamThoi = {};
    Object.keys(chiTieuNganh).forEach((key) => {
      dsTrungTuyen[key] = [];
      dsTrungTuyenTamThoi[key] = [];
    });
    // Sau Khi reduce ở hàm groupBy(...) thì đây vẫn đang là list của list ~ mảng 2 chiều, flat() để làm phẳng mảng
    const listWishValues = Object.values(wishListOfAll).flat().map(({ soBaoDanh, tongDiem }) => ({ soBaoDanh, tongDiem }));
    // Sắp xếp theo [điều kiện] giảm dần, ở đây điều kiện mặc định là tổng điểm, sau khi cơ cấu điều kiện ưu tiên thì sẽ sort theo điều kiện ưu tiên 
    // Ví dụ như 2 đứa bằng điểm thì sẽ xét điều kiện ưu tiên tiếp theo, có thể là thứ tự nguyện vọng chẳng hạn.
    // gửi cấu hình điều kiện ưu tiên thì gửi kèm theo 1 object có cấu trúc như sau:
    // {
    //   "tongDiem": "desc",
    //   "nguyenVong": "asc"
    // } 
    // let sortedCandidates = listWishValues.sort(function compare(a: any, b: any) { return 1.0 * (b.tongDiem - a.tongDiem) });
    let sortedCandidates = listWishValues.sort((a, b) => this.compareByDieuKien(a, b, ds_dieukien, mota_dieukien));
    let time = 0;
    while (sortedCandidates.length > 0 && this.checkChiTieu(chiTieuNganh)) {
      time++;
      for (let i = 0; i < sortedCandidates.length; i++) {
        let candidate = sortedCandidates[i];
        let candidateWishList = wishListOfAll[candidate.soBaoDanh];
        let candidatePriorityWish = null;
        // xét xem còn slot k, bỏ các nguyện vọng đã hết slot
        while (candidateWishList.length > 0) {
          let wish = candidateWishList.shift(); // lấy wish đầu hàng
          // check nếu còn slot ngành này
          if (dsTrungTuyen[wish.maNganh] && chiTieuNganh[wish.maNganh] > dsTrungTuyenTamThoi[wish.maNganh].length) { // còn slot
            candidatePriorityWish = wish;
            break;
          }
          // hết slot
          // wishListOfAll[candidate.soBaoDanh] = candidateWishList; // bỏ 
        }
        // còn nguyện vọng ko?

        sortedCandidates = sortedCandidates.filter((element) => element.soBaoDanh != candidate.soBaoDanh);
        if (candidatePriorityWish == null) {  // tạch hết rồi, cút
          continue;
        }
        dsTrungTuyenTamThoi[candidatePriorityWish.maNganh].push(candidate); // lấy người này vào ngành này
      }
      // let breakNow = true;
      // for (let key in dsTrungTuyenTamThoi) {
      //   if (dsTrungTuyenTamThoi[key].length > 0) {
      //     breakNow = false;
      //     let candidate = dsTrungTuyenTamThoi[key].shift(); // lấy thí sinh trúng tuyển cao nhất ở ngành này ra, vì người này chăc chắn đã đậu, nên nguyện vọng phí sau vô nghĩa
      //     dsTrungTuyen[key].push(candidate); // cho vào ds trúng tuyển của ngành
      //     dsTrungTuyenTamThoi[key] = []; // reset ds trúng tuyển để duyệt lại vì những đứa phía sau có thể bị thay thế
      //     chiTieuNganh[key]--;
      //     sortedCandidates.filter((element) => element.soBaoDanh != candidate.soBaoDanh);
      //   }
      // }
      console.log('sortedCandidates.length :>> ', sortedCandidates.length);
      // if (breakNow) {
      //   break;
      // }
    }

    // console.log('dsTrungTuyen :>> ', dsTrungTuyen);
    return dsTrungTuyenTamThoi;
  }

  receiveFile(file) {
    // console.log('file :>> ', file);
    let chiTieuNganh = null;
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
      let groupByMaNganh = this.groupBy(wishList, 'maNganh');
      let groupBySoBaoDanh = this.groupBy(wishList, 'soBaoDanh');

      return {
        wishList: wishList,
        headerObject,
        groupByMaNganh,
        groupBySoBaoDanh,
        chiTieuNganh: chiTieuNganh,
        // dstt: this.huyenKute(groupBySoBaoDanh, chiTieuNganh)
      };
    } catch (e) {
      console.log('e :>> ', e);
      return {
        error: 'Error while parsing file',
      };
    }
  }
  receiveAndFilter(file, props) {
    const { ds_dieukien, mota_dieukien, chiTieuNganh } = props;
    if (!file) {
      return { error: 'NOOOOOOOOOOOOO' };
    }
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      if (!XLSX.utils.sheet_to_json(workbook.Sheets['Mini']))
        return { error: 'NOOOOOOOOOOOOOOOOOOO' };
      const wishList = XLSX.utils
        .sheet_to_json(workbook.Sheets['Mini'])
        .map((row) => FileUtils.wishRowToObject(row));
      const headerObject = FileUtils.getWishListHeaderObject(
        XLSX.utils.sheet_to_json(workbook.Sheets['Mini'])[0],
      );
      if (!Object.keys(headerObject).includes('soBaoDanh') || !Object.keys(headerObject).includes('maNganh') || !Object.keys(headerObject).includes('nguyenVong') || !Object.keys(headerObject).includes('tongDiem')) {
        return { error: 'NOOOOOOOOO ' };
      }
      let groupBySoBaoDanh = this.groupBy(wishList, 'soBaoDanh');

      return {
        dstt: this.huyenKute(groupBySoBaoDanh, chiTieuNganh, ds_dieukien, mota_dieukien)
      };
    } catch (e) {
      console.log('e :>> ', e);
      return {
        error: 'Error while parsing file',
      };
    }
  }
}
