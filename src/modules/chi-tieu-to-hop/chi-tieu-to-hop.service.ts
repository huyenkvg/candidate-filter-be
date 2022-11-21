import { Injectable } from '@nestjs/common';
import { CreateChiTieuToHopDto } from './dto/create-chi-tieu-to-hop.dto';
import { UpdateChiTieuToHopDto } from './dto/update-chi-tieu-to-hop.dto';

@Injectable()
export class ChiTieuToHopService {
  create(createChiTieuToHopDto: CreateChiTieuToHopDto) {
    return 'This action adds a new chiTieuToHop';
  }

  findAll() {
    return `This action returns all chiTieuToHop`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chiTieuToHop`;
  }

  update(id: number, updateChiTieuToHopDto: UpdateChiTieuToHopDto) {
    return `This action updates a #${id} chiTieuToHop`;
  }

  remove(id: number) {
    return `This action removes a #${id} chiTieuToHop`;
  }
}
