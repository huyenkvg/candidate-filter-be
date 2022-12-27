import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateKhoaTuyenSinhDto } from './dto/create-khoa-tuyen-sinh.dto';
import { UpdateKhoaTuyenSinhDto } from './dto/update-khoa-tuyen-sinh.dto';

@Injectable()
export class KhoaTuyenSinhService {
  prisma = new PrismaClient();
  async create(createKhoaTuyenSinhDto: CreateKhoaTuyenSinhDto) {
    return  {
      danh_sach_dot_tuyen: [],
      count_dot_tuyen_sinh: 0,
      count_trung_tuyen: 0,      
      ...await this.prisma.khoa_tuyen_sinh.create({
        data: {
          tenKhoa: createKhoaTuyenSinhDto.tenKhoa,
        },
      })
    };
  }
  groupBy(original_list, headerName) {
    const groupedList = original_list.reduce((acc, item) => {
      const key = item[headerName];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
    // console.log('groupedWishList :>> ', groupedWishList);
    return groupedList;
  }
  async findAll(params: any) {
    const search = params.search || "";
    const x = -1;
    if (params.nameOnly) {
      return this.prisma.khoa_tuyen_sinh.findMany({
        select: {
          maKhoa: true,
          tenKhoa: true,
        },
      });
    }
    let result = Promise.all((await this.prisma.khoa_tuyen_sinh.findMany({
      where: {
       
        OR: [{ dot_tuyen_sinh: {
          some: {
            tenDotTuyenSinh: {
              contains: search,
            },
          },
        },
        },
          {
            tenKhoa: {
              gte: x

        },},
        ]
      },
    })).map(
      async (item) => {
        return {
          key: item.maKhoa,
          ...item,
          danh_sach_dot_tuyen: await this.prisma.dot_tuyen_sinh.findMany({
            where: {
              maKhoaTuyenSinh: item.maKhoa,              
            },
            // include: {
            //   danh_sach_trung_tuyen: true,
            // }
          }),
          count_dot_tuyen_sinh: await this.prisma.dot_tuyen_sinh.count({
            where: {
              maKhoaTuyenSinh: item.maKhoa,
            },
          }),
          count_trung_tuyen: await this.prisma.danh_sach_trung_tuyen.count({
            where: {
              maKhoaTuyenSinh: item.maKhoa,
            },
          }),
        };


      }))
    return result;
  }

  findOne(id: number) {
    return this.prisma.khoa_tuyen_sinh.findUnique({
      where: {
        maKhoa: id,
      },
    });
  }
  async get_DSXT(maKhoaTuyenSinh: number) {
    return await this.prisma.$queryRaw<any[]>`SELECT * FROM danh_sach_nguyen_vong, thong_tin_ca_nhan WHERE thong_tin_ca_nhan.maKhoaTuyenSinh = ${maKhoaTuyenSinh} and (danh_sach_nguyen_vong.soBaoDanh = thong_tin_ca_nhan.soBaoDanh Or danh_sach_nguyen_vong.soBaoDanh = thong_tin_ca_nhan.cmnd and  thong_tin_ca_nhan.cmnd is not null) and  thong_tin_ca_nhan.maKhoaTuyenSinh = (select maKhoaTuyenSinh from dot_tuyen_sinh where maKhoaTuyenSinh = ${maKhoaTuyenSinh})`;
  }
  async get_DSTT(maKhoaTuyenSinh: number) {
    return await this.prisma.$queryRaw<any[]>`SELECT * FROM danh_sach_trung_tuyen inner join danh_sach_nguyen_vong on danh_sach_trung_tuyen.sobaoDanh = danh_sach_nguyen_vong.sobaoDanh and danh_sach_trung_tuyen.maDotTuyenSinh = danh_sach_nguyen_vong.maDotTuyenSinh and danh_sach_trung_tuyen.nguyenVongTrungTuyen = danh_sach_nguyen_vong.nguyenVong 
    inner join thong_tin_ca_nhan on (danh_sach_trung_tuyen.sobaoDanh = thong_tin_ca_nhan.sobaoDanh or danh_sach_trung_tuyen.sobaoDanh = thong_tin_ca_nhan.sobaoDanh ) and danh_sach_trung_tuyen.maKhoaTuyenSinh = ${maKhoaTuyenSinh} and thong_tin_ca_nhan.maKhoaTuyenSinh = (select maKhoaTuyenSinh from dot_tuyen_sinh where maKhoaTuyenSinh = ${maKhoaTuyenSinh})`;
    // , thong_tin_ca_nhan WHERE danh_sach_trung_tuyen.maDotTuyenSinh = ${maDotTuyenSinh} and (danh_sach_trung_tuyen.soBaoDanh = thong_tin_ca_nhan.soBaoDanh Or danh_sach_trung_tuyen.soBaoDanh = thong_tin_ca_nhan.cmnd)`;
  }

  update(updateKhoaTuyenSinhDto: UpdateKhoaTuyenSinhDto) {
    // console.log('updateKhoaTuyenSinhDto :>> ', updateKhoaTuyenSinhDto);
    const { maKhoa, ...data } = updateKhoaTuyenSinhDto;
    return this.prisma.khoa_tuyen_sinh.update({
        where: {
        maKhoa: maKhoa,
        },
        data: {
          tenKhoa: data.tenKhoa,
        },
    }).then((data) => {
      return data;
    })
  }

  remove(id: number) {
    return this.prisma.khoa_tuyen_sinh.delete({
      where: {
        maKhoa: id,
      },
    });

  }
 async getDiemChuan(params: any) {
  // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa :>> ');
    return await this.prisma.$queryRaw<any[]>`  select tenKhoa, tenDotTuyenSinh, nganh.maNganh, tenNganh, min(tongDiem) as diemChuan from danh_sach_trung_tuyen inner join danh_sach_nguyen_vong 
    on danh_sach_trung_tuyen.soBaoDanh = danh_sach_nguyen_vong.soBaoDanh and danh_sach_nguyen_vong.nguyenVong = danh_sach_trung_tuyen.nguyenVongTrungTuyen 
    and danh_sach_trung_tuyen.maDotTuyenSinh = danh_sach_nguyen_vong.maDotTuyenSinh   
    inner join nganh on danh_sach_nguyen_vong.maNganh = nganh.maNganh
    inner join dot_tuyen_sinh on dot_tuyen_sinh.maDotTuyenSinh = danh_sach_trung_tuyen.maDotTuyenSinh
    inner join khoa_tuyen_sinh as kts on danh_sach_trung_tuyen.maKhoaTuyenSinh = kts.maKhoa
    where kts.tenKhoa >= ${params.khoa_start} and kts.tenKhoa <=  ${params.khoa_end}
    group by tenKhoa, tenDotTuyenSinh, nganh.maNganh, tenNganh`
  }

  async thongKe(params: any) {
    // let query = `SELECT * FROM khoa_tuyen_sinh`;
    // console.log('params :>> ', params);
    const data_khoa = await this.prisma.$queryRaw<any[]>`SELECT * FROM khoa_tuyen_sinh WHERE tenKhoa >= ${params.khoa_start} AND tenKhoa <= ${params.khoa_end} order by tenKhoa asc`
    // const data_khoa = await this.prisma.khoa_tuyen_sinh.findMany()
    // await console.log('data_khoa :>> ', data_khoa);
    let result = await Promise.all(data_khoa.map(async (item) => {
        return {
          key: item.maKhoa,
          ...item,
          // danh_sach_dot_tuyen: await this.prisma.dot_tuyen_sinh.findMany({
          //   where: {
          //     maKhoaTuyenSinh: item.maKhoa,
          //   },
          //   // include: {
          //   //   danh_sach_trung_tuyen: true,
          //   // }
          // }),
          count_dot_tuyen_sinh: await this.prisma.dot_tuyen_sinh.count({
            where: {
              maKhoaTuyenSinh: item.maKhoa,
            },
          }),
          count_nguyen_vong: await this.prisma.danh_sach_nguyen_vong.count({
            where: {
              dot_tuyen_sinh: {
                maKhoaTuyenSinh: item.maKhoa,
              }
            },
          }),
          count_trung_tuyen: await this.prisma.danh_sach_trung_tuyen.count({
            where: {
              maKhoaTuyenSinh: item.maKhoa,
            },
          }),
        };

      }))

    let pie = await this.prisma.$queryRaw<any[]>`select  tenNganh, sum(chiTieu)  as  chi_tieu_tuyen  from khoa_tuyen_sinh as kts inner join dot_tuyen_sinh as dts on dts.maKhoaTuyenSinh = kts.maKhoa inner join chi_tieu_tuyen_sinh as ctts on ctts.maDotTuyenSinh = dts.maDotTuyenSinh inner join nganh as ng on ctts.maNganh = ng.maNganh 
      where kts.tenKhoa >= ${params.khoa_start} and kts.tenKhoa <=  ${params.khoa_end}  group by  tenNganh`
    // let pie = await this.prisma.$queryRaw<any[]>`select  tenKhoa, tenDotTuyenSinh,maNganh, sum(chiTieu)  as  i  from khoa_tuyen_sinh as kts inner join dot_tuyen_sinh as dts on dts.maKhoaTuyenSinh = kts.maKhoa inner join chi_tieu_tuyen_sinh as ctts on ctts.maDotTuyenSinh = dts.maDotTuyenSinh
    // where kts.tenKhoa >= ${params.khoa_start} and kts.tenKhoa <= ${params.khoa_end} group by tenKhoa, tenDotTuyenSinh, maNganh order by tenKhoa`
    let danh_sach_diem_chuan =  await this.getDiemChuan(params);
    return {
      bar: result,
      pie: pie,
      danh_sach_diem_chuan: danh_sach_diem_chuan
    }
  }
  async thongkeTable(params: any) {
    // let query = `SELECT * FROM khoa_tuyen_sinh`;
    console.log('params :>> ', params);
    const data_khoa = await this.prisma.$queryRaw<any[]>`SELECT * FROM khoa_tuyen_sinh WHERE tenKhoa >= ${params.khoa_start} AND tenKhoa <= ${params.khoa_end} order by tenKhoa asc`
    // const data_khoa = await this.prisma.khoa_tuyen_sinh.findMany()
    await console.log('data_khoa :>> ', data_khoa);
    let result = await Promise.all(data_khoa.map(async (item) => {
      return {
        key: item.maKhoa,
        ...item,
        // danh_sach_dot_tuyen: await this.prisma.dot_tuyen_sinh.findMany({
        //   where: {
        //     maKhoaTuyenSinh: item.maKhoa,
        //   },
        //   // include: {
        //   //   danh_sach_trung_tuyen: true,
        //   // }
        // }),
        count_dot_tuyen_sinh: await this.prisma.dot_tuyen_sinh.count({
          where: {
            maKhoaTuyenSinh: item.maKhoa,
          },
        }),
        ...await this.prisma.$queryRaw`select count(distinct maNganh) as count_nganh from khoa_tuyen_sinh as kts inner join dot_tuyen_sinh as dts on dts.maKhoaTuyenSinh = kts.maKhoa inner join chi_tieu_tuyen_sinh as ctts on ctts.maDotTuyenSinh = dts.maDotTuyenSinh where kts.maKhoa = ${item.maKhoa}`.then((res) => {return res[0]}),
        count_nguyen_vong: await this.prisma.danh_sach_nguyen_vong.count({
          where: {
            dot_tuyen_sinh: {
              maKhoaTuyenSinh: item.maKhoa,
            }
          },
        }),
        count_nhap_hoc: await this.prisma.danh_sach_trung_tuyen.count({
          where: {
            maKhoaTuyenSinh: item.maKhoa,
            lock: true
          },
        }),
        count_trung_tuyen: await this.prisma.danh_sach_trung_tuyen.count({
          where: {
            maKhoaTuyenSinh: item.maKhoa,
          },
        }),

      };

    }))

    let pie = await this.prisma.$queryRaw<any[]>`select  tenNganh, sum(chiTieu)  as  chi_tieu_tuyen  from khoa_tuyen_sinh as kts inner join dot_tuyen_sinh as dts on dts.maKhoaTuyenSinh = kts.maKhoa inner join chi_tieu_tuyen_sinh as ctts on ctts.maDotTuyenSinh = dts.maDotTuyenSinh inner join nganh as ng on ctts.maNganh = ng.maNganh 
      where kts.tenKhoa >= ${params.khoa_start} and kts.tenKhoa <=  ${params.khoa_end}  group by  tenNganh`
    // let pie = await this.prisma.$queryRaw<any[]>`select  tenKhoa, tenDotTuyenSinh,maNganh, sum(chiTieu)  as  i  from khoa_tuyen_sinh as kts inner join dot_tuyen_sinh as dts on dts.maKhoaTuyenSinh = kts.maKhoa inner join chi_tieu_tuyen_sinh as ctts on ctts.maDotTuyenSinh = dts.maDotTuyenSinh
    // where kts.tenKhoa >= ${params.khoa_start} and kts.tenKhoa <= ${params.khoa_end} group by tenKhoa, tenDotTuyenSinh, maNganh order by tenKhoa`
    let danh_sach_diem_chuan = await this.getDiemChuan(params);
    return result
  }
}
