import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Http2ServerResponse } from 'http2';
import { CreateThongTinCaNhanDto } from './dto/create-thong-tin-ca-nhan.dto';
import { UpdateThongTinCaNhanDto } from './dto/update-thong-tin-ca-nhan.dto';

@Injectable()
export class ThongTinCaNhanService {
  prisma = new PrismaClient();
  create(createThongTinCaNhanDto: CreateThongTinCaNhanDto) {
    return this.prisma.thong_tin_ca_nhan.create({
      data: createThongTinCaNhanDto,
    });
  }

  findAll(params) {
    if (params) {
      const { maKhoaTuyenSinh, info } = params;
      if (maKhoaTuyenSinh == 'all') {
        return this.prisma.thong_tin_ca_nhan.findMany({
          where: {
            OR: [
              { hoTen: { contains: info } },
              { soBaoDanh: { contains: info } },
              { cmnd: { contains: info } },
              { soDienThoai: { contains: info } },
              { email: { contains: info } },
              { goiTinh: { contains: info } },
              { diaChiGiayBao: { contains: info } },
              { ngaySinh: { contains: info } },
              { maTinh: { contains: info } },
              { maTruong: { contains: info } },
              { danToc: { contains: info } },
              { khuVucUuTien: { contains: info } },
            ],
          },
        });
      }
      return this.findByInfo(params.info,Number.parseInt(params.maKhoaTuyenSinh) );
    }

    return this.prisma.thong_tin_ca_nhan.findMany();
  }

  findByInfo(info: string, maKhoaTuyenSinh: number) {
    return this.prisma.thong_tin_ca_nhan.findMany({
      where: {
        OR: [
          { hoTen: { contains: info } },
          { soBaoDanh: { contains: info } },
          { cmnd: { contains: info } },
          { soDienThoai: { contains: info } },
          { email: { contains: info } },
          { goiTinh: { contains: info } },
          { diaChiGiayBao: { contains: info } },
          { ngaySinh: { contains: info } },
          { maTinh: { contains: info } },
          { maTruong: { contains: info } },
          { danToc: { contains: info } },
          { khuVucUuTien: { contains: info } },
        ],
        maKhoaTuyenSinh: maKhoaTuyenSinh,
      },
    });
  }

  update(updateThongTinCaNhanDto: UpdateThongTinCaNhanDto) {
    return this.prisma.thong_tin_ca_nhan.update({
      where: {
        maKhoaTuyenSinh_soBaoDanh: {
          maKhoaTuyenSinh: updateThongTinCaNhanDto.maKhoaTuyenSinh,
          soBaoDanh: updateThongTinCaNhanDto.soBaoDanh,
        },
      },
      data: updateThongTinCaNhanDto,
    });
  }

  removeAllByKhoa(maKhoaTuyenSinh: number) {
    return this.prisma.$queryRaw`DELETE FROM thong_tin_ca_nhan WHERE maKhoaTuyenSinh = ${maKhoaTuyenSinh}`
  }
  remove(soBaoDanh, maKhoaTuyenSinh) {
    return this.prisma.thong_tin_ca_nhan.delete({
      where: {
        maKhoaTuyenSinh_soBaoDanh: {
          maKhoaTuyenSinh: maKhoaTuyenSinh,
          soBaoDanh: soBaoDanh,
        },
      },
    });

  }
}
