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
            include: {
              danh_sach_trung_tuyen: true,
            }
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
  search(str: string) {
    return this.prisma.khoa_tuyen_sinh.findMany({
      where: {
        tenKhoa: {
          contains: str,
        },
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
}
