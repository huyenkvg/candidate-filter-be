import { Injectable } from '@nestjs/common';
import { CreateDanhSachTrungTuyenDto } from './dto/create-danh-sach-trung-tuyen.dto';
import { UpdateDanhSachTrungTuyenDto } from './dto/update-danh-sach-trung-tuyen.dto';

@Injectable()
export class DanhSachTrungTuyenService {
  create(createDanhSachTrungTuyenDto: CreateDanhSachTrungTuyenDto) {
    return 'This action adds a new danhSachTrungTuyen';
  }

  findAll() {
    return `This action returns all danhSachTrungTuyen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} danhSachTrungTuyen`;
  }

  update(id: number, updateDanhSachTrungTuyenDto: UpdateDanhSachTrungTuyenDto) {
    return `This action updates a #${id} danhSachTrungTuyen`;
  }

  remove(id: number) {
    return `This action removes a #${id} danhSachTrungTuyen`;
  }
}
