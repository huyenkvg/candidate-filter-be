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

  groupBy(original_wishList, headerName) {
    const wishList = original_wishList.sort((a, b) => a['nguyenVong'] - b['nguyenVong']);
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
  compareByDieuKien(a_arr, b_arr, ds_dieukien, mota_dieukien) {
    // a and b is a wish array
    let a = a_arr[0];
    let b = b_arr[0];
    // truong hop trung so bao danh
    if (a['soBaoDanh'] == b['soBaoDanh']) {
      return -(a['nguyenVong'] - b['nguyenVong']);
    }


    // truong hop comindedKey khac nhau hoan toan
    let result = 0;
    for (let i = 0; i < ds_dieukien.length; i++) {
      let opposite = mota_dieukien[ds_dieukien[i]] == 'ASC' ? 1 : -1; 
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
  kiemTraChiTieu(chiTieuNganh, wish) {
    // let tit = wish['maNganh'] + '-chitieutohop';
    // if (!chiTieuNganh[tit]) {
    //   return "True-1";
    // }
    // else if (
    //   chiTieuNganh[tit].some((item) => {
    //     return item['maNganh'] == wish['maNganh'] && item['toHopMon'] == wish['toHopMon'] && item['chiTieu'] > 0;
    //   })
    // ) {
    //   return "True-2";
    // }
    // return null;
    return true;
  }
  // Hàm này dùng để xử lý nguyện vọng của thí sinh
  // wishListOfAll là danh sách nguyện vọng của tất cả thí sinh được gom nhóm theo combinedKey ( = `soBaoDanh@maNganh`)
  // kiểu như này: { '123@123':
  //                   [{ soBaoDanh: '123', maNganh: '123', nguyenVong: 1, tongDiem: 10, khoi: A01 }, { soBaoDanh: '123', maNganh: '123', nguyenVong: 2, tongDiem: 9, khoi: A02 } ],
  //          '123@124':
  //                    [{ soBaoDanh: '123', maNganh: '124', nguyenVong: 1, tongDiem: 10, khoi: A01 }],
  //          '124@123':
  //                   [{ soBaoDanh: '124', maNganh: '123', nguyenVong: 1, tongDiem: 9, khoi: A01 }, { soBaoDanh: '124', maNganh: '123', nguyenVong: 2, tongDiem: 10, khoi: A02 } ],
  //          }
  // Thay vì gom theo số báo danh, cần phải gom theo combinedKey bởi vì có thể có trường hợp thí sinh đăng ký 2 ngành nhưng khác khối,
  //  dẫn đến khác tổng điểm, thành ra sẽ có 2 nguyện vọng khác tổng điểm ngưng lại nằm cùng rank sau khi sort
  // Trong khi hàm này sẽ
  // hàm naỳ sẽ tiến hành lấy danh sách trên, sắp sếp lại nguyện vọng của thí sinh theo điều kiện ưu tiên được gửi kèm
  // Đề xuất dùng Tổng điểm  và thứ tự Nguyện vọng
  huyenKute(wishListOfAll: Object, chiTieuNganh: Object, ds_dieukien: Object, mota_dieukien: Object) {
    const dsTrungTuyen = {};
    const dsNVTrungTuyen = {};
    const dsTrungTuyenTamThoi = {};
    Object.keys(chiTieuNganh).forEach((key) => {
      if (key.includes('chitieutohop'))
        return;
      // dsTrungTuyen[key] = [];
      dsTrungTuyenTamThoi[key] = [];
    });
    // Sau Khi reduce ở hàm groupBy(...) thì đây vẫn đang là list của list ~ mảng 2 chiều, flat() để làm phẳng mảng
    // const listWishValues = Object.values(wishListOfAll).flat()//.map(({ soBaoDanh, tongDiem}) => ({ soBaoDanh, tongDiem }));
    const listWishValues = Object.values(wishListOfAll)//.map((item) => {return item.sort((a, b) => this.compareByDieuKien([a], [b], ds_dieukien, mota_dieukien))});
    // Sắp xếp theo [điều kiện] giảm dần, ở đây điều kiện mặc định là tổng điểm, sau khi cơ cấu điều kiện ưu tiên thì sẽ sort theo điều kiện ưu tiên 
    // Ví dụ như 2 đứa bằng điểm thì sẽ xét điều kiện ưu tiên tiếp theo, có thể là thứ tự nguyện vọng chẳng hạn.
    // gửi cấu hình điều kiện ưu tiên thì gửi kèm theo 1 object có cấu trúc như sau:
    // {
    //   "tongDiem": "desc",
    //   "nguyenVong": "asc"
    // } 
    // let sortedCandidates = listWishValues.sort(function compare(a: any, b: any) { return 1.0 * (b.tongDiem - a.tongDiem) });
    let sortedCandidates = listWishValues.sort((aArray, bArray) => this.compareByDieuKien(aArray, bArray, ds_dieukien, mota_dieukien));
    let time = 0;
    // return wishListOfAll;
    // return sortedCandidates;
    // while (sortedCandidates.length > 0 && this.checkChiTieu(chiTieuNganh)) {
      // time++;
      for (let i = 0; i < sortedCandidates.length; i++) {

        let candidateWishList = sortedCandidates[i];
        // let candidateWishList = wishListOfAll[candidate.combinedKey];
        let candidatePriorityWish = null;
        // xét xem còn slot k, bỏ các nguyện vọng đã hết slot
        // note : dsach này đã sỏt theo NV rồi, nên chỉ cần có NV đầu tiên đậu là đc
        while (candidateWishList.length > 0) {
          let wish = candidateWishList.shift(); // lấy wish đầu hàng
          // if(dsTrungTuyen[wish.soBaoDanh] == "IS_SELECTED")  
          //   break;
          // check nếu còn slot ngành này, === người ngày ở NV này đã trúng tuyển
          if (dsTrungTuyenTamThoi[wish.maNganh] && chiTieuNganh[wish.maNganh] > dsTrungTuyenTamThoi[wish.maNganh].length && this.kiemTraChiTieu(chiTieuNganh, wish)) { // còn slot
            // if (this.kiemTraChiTieu(chiTieuNganh, wish) == "True-2") {
            //   chiTieuNganh[wish.maNganh + '-chitieutohop'] -= 1;
            // }
            candidatePriorityWish = wish;
            break;
          }
          // hết slot
          // wishListOfAll[candidate.soBaoDanh] = candidateWishList; // bỏ
        }
        // còn nguyện vọng ko?
        // sortedCandidates = sortedCandidates.filter((item, i) => item.length > 0);

        if (candidatePriorityWish == null) {  // tạch hết rồi, cút thôi
          continue;
        }
        // ngươid này đã từng đậu ngành nào chưa, đậu NV nào?
        if(dsNVTrungTuyen[candidatePriorityWish.soBaoDanh]) {
          // đã từng đậu ngành này rồi
          // kiểm tra xem nguyện vọng này có cao hơn nguyện vọng trước đó ko?
          if(candidatePriorityWish.nguyenVong < dsNVTrungTuyen[candidatePriorityWish.soBaoDanh].nguyenVong) {
            // xóa người này đậu bất kì ngành nào trước đó
            console.log('candidatePriorityWish.soBaoDanh :>> ', dsNVTrungTuyen[candidatePriorityWish.soBaoDanh]);
            const item = dsNVTrungTuyen[candidatePriorityWish.soBaoDanh];
            // dsNVTrungTuyen[candidatePriorityWish.soBaoDanh].forEach((item) => {
              dsTrungTuyenTamThoi[item.maNganh] = dsTrungTuyenTamThoi[item.maNganh].filter((item) => item.soBaoDanh != candidatePriorityWish.soBaoDanh);
            // });
           // dsTrungTuyenTamThoi[dsNVTrungTuyen[candidatePriorityWish.soBaoDanh].maNganh] = dsTrungTuyenTamThoi[dsNVTrungTuyen[candidatePriorityWish.soBaoDanh].maNganh].filter((item) => item.soBaoDanh != candidatePriorityWish.soBaoDanh);
            // thêm người này vào ngành này
            dsTrungTuyenTamThoi[candidatePriorityWish.maNganh].push(candidatePriorityWish);
            // cập nhật lại người đậu ngành này
            dsNVTrungTuyen[candidatePriorityWish.soBaoDanh] = candidatePriorityWish;
          } 
        } // chưa từng đậu ngành nao
        else if (dsTrungTuyen[candidatePriorityWish.soBaoDanh]!= "IS_SELECTED") {
          dsTrungTuyenTamThoi[candidatePriorityWish.maNganh].push(candidatePriorityWish); // lấy người này vào ngành này
          dsTrungTuyen[candidatePriorityWish.soBaoDanh] = "IS_SELECTED";
          dsNVTrungTuyen[candidatePriorityWish.soBaoDanh] = candidatePriorityWish;
        }
        
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
      // console.log('sortedCandidates.length :>> ', sortedCandidates.length);
      // if (breakNow) {
      //   break;
      // }
    // }

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
      // let groupBySoBaoDanh = this.groupBy(wishList, 'soBaoDanh');      
      let groupByCombinedKey = this.groupBy(wishList, 'combinedKey');

      return {
        wishList: wishList,
        headerObject,
        groupByMaNganh,
        groupBySoBaoDanh: groupByCombinedKey,
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



  // THIS PROJECT'S CORE FUNCTION
  receiveAndFilter(file, props) {
    const { ds_dieukien, mota_dieukien, chiTieuNganh } = props;
    if (!file) {
      return { error: 'NOOOOOOOOOOOOO' };
    }
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      if (!XLSX.utils.sheet_to_json(workbook.Sheets['Mini']))
        return { error: 'NOOOOOOOOOOOOOOOOOOO' };
      const wishList = XLSX.utils.sheet_to_json(workbook.Sheets['Mini']).map((row) => FileUtils.wishRowToObject(row));
      const headerObject = FileUtils.getWishListHeaderObject(
        XLSX.utils.sheet_to_json(workbook.Sheets['Mini'])[0],
      );
      if (!Object.keys(headerObject).includes('soBaoDanh') || !Object.keys(headerObject).includes('maNganh') || !Object.keys(headerObject).includes('nguyenVong') || !Object.keys(headerObject).includes('tongDiem')) {
        return { error: 'NOOOOOOOOO ' };
      }
      let groupBySoBaoDanh = this.groupBy(wishList, 'soBaoDanh');
      let groupByCombinedKey = this.groupBy(wishList, 'combinedKey');

      return {
        dstt: this.huyenKute(groupByCombinedKey, chiTieuNganh, ds_dieukien, mota_dieukien)
      };
    } catch (e) {
      console.log('e :>> ', e);
      return {
        error: 'Error while parsing file',
      };
    }
  }
}
