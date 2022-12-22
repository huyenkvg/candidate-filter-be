import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateNganhDto } from './dto/create-nganh.dto';
import { UpdateNganhDto } from './dto/update-nganh.dto';

@Injectable()
export class NganhService {
  prisma = new PrismaClient();
  create(createNganhDto: CreateNganhDto) {
    return this.prisma.nganh.create({
      data: createNganhDto,
    });
  }

  findAll(query) {
    return this.prisma.nganh.findMany({
      where: {
        OR: [
          {
            maNganh: {
              contains: query.search,
            },
          },
          {
            tenNganh: {
              contains: query.search,
            },
          },
        ],
      },
    });
  }

  findOne(id: string) {
    return this.prisma.nganh.findUnique({
      where: {
        maNganh: id,
      },
    });
  }

  update(id: string, updateNganhDto: UpdateNganhDto) {
    return this.prisma.nganh.update({
      where: {
        maNganh: id,
      },
      data: updateNganhDto,
    });
  }

  remove(id: string) {
    return this.prisma.nganh.delete({
      where: {
        maNganh: id,
      },
    })
  }
}
