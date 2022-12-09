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

  async findAll(params: any) {
    if (params.nameOnly) {
      return this.prisma.khoa_tuyen_sinh.findMany({
        select: {
          maKhoa: true,
          tenKhoa: true,
        },
      });
    }
    let result = Promise.all((await this.prisma.khoa_tuyen_sinh.findMany()).map(
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


  async thongKe(params: any) {
    // let query = `SELECT * FROM khoa_tuyen_sinh`;
    console.log('params :>> ', params);
    const data_khoa = await this.prisma.$queryRaw<any[]>`SELECT * FROM khoa_tuyen_sinh WHERE tenKhoa >= ${params.khoa_start} AND tenKhoa <= ${params.khoa_end} order by tenKhoa asc`
    // const data_khoa = await this.prisma.khoa_tuyen_sinh.findMany()
    await console.log('data_khoa :>> ', data_khoa);
    let result = Promise.all(data_khoa.map(async (item) => {
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
          count_nguyen_vong: await this.prisma.danh_sach_nguyen_vong.count({
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
    let pie = await this.prisma.chi_tieu_tuyen_sinh.findMany({
      where: {
        dot_tuyen_sinh: {
         where: {
          khoa_tuyen_sinh: {
            tenKhoa: {
              gte: params.khoa_start,
              lte: params.khoa_end
            }
          }
         }
        }
      },
    })
    return {
      bar: result,
      pie: pie
    }
  }
}
