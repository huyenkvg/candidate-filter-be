import { Injectable } from '@nestjs/common';
import { CreateChiTieuTuyenSinhDto } from './dto/create-chi-tieu-tuyen-sinh.dto';
import { UpdateChiTieuTuyenSinhDto } from './dto/update-chi-tieu-tuyen-sinh.dto';

@Injectable()
export class ChiTieuTuyenSinhService {
  create(createChiTieuTuyenSinhDto: CreateChiTieuTuyenSinhDto) {
    return 'This action adds a new chiTieuTuyenSinh';
  }

  findAll() {
    return `This action returns all chiTieuTuyenSinh`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chiTieuTuyenSinh`;
  }

  update(id: number, updateChiTieuTuyenSinhDto: UpdateChiTieuTuyenSinhDto) {
    return `This action updates a #${id} chiTieuTuyenSinh`;
  }

  remove(id: number) {
    return `This action removes a #${id} chiTieuTuyenSinh`;
  }
}
