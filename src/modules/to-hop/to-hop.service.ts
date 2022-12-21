import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Http2ServerResponse } from 'http2';
import StringUtils from 'src/utils/string-utils';
import { CreateToHopDto } from './dto/create-to-hop.dto';
import { UpdateToHopDto } from './dto/update-to-hop.dto';

@Injectable()
export class ToHopService {
  prisma = new PrismaClient();
  create(createToHopDto: CreateToHopDto) {
    console.log('createNganhDto.getFormatedStringObject() :>> ',  StringUtils.chuanHoaObjectSring(createToHopDto, true));
    return this.prisma.to_hop_xet_tuyen.create({
      data: {
        maToHop: StringUtils.chuanHoaChuoiHoa(createToHopDto.maToHop),
        mon1: StringUtils.chuanHoaChuoiHoa(createToHopDto.mon1),
        mon2: StringUtils.chuanHoaChuoiHoa(createToHopDto.mon2),
        mon3: StringUtils.chuanHoaChuoiHoa(createToHopDto.mon3),
      },
    });
  }

  findAll(query) {
    return this.prisma.to_hop_xet_tuyen.findMany({
      where: {
        OR: [
          {
            maToHop: {
              contains: query.search,
            },
          },
          {
            mon1: {
              contains: query.search,
            },
          },
          {
            mon2: {
              contains: query.search,
            },
          },
          {
            mon3: {
              contains: query.search,
            },
          },
        ],
      },
    });
  }

  findOne(maToHop: string) {
    return this.prisma.to_hop_xet_tuyen.findUnique({
      where: {
        maToHop: maToHop,
      },
    });

  }

  update(maToHop: string, updateToHopDto: UpdateToHopDto) {
    return this.prisma.to_hop_xet_tuyen.update({
      where: {
        maToHop: maToHop,
      },
      data: updateToHopDto,
    });
  }

  remove(maToHop: string) {
    return this.prisma.to_hop_xet_tuyen.delete({
      where: {
        maToHop: maToHop,
      },
    });

  }
}
