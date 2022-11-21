import { Injectable } from '@nestjs/common';
import { CreateDanhSachXetTuyenDto } from './dto/create-danh-sach-xet-tuyen.dto';
import { UpdateDanhSachXetTuyenDto } from './dto/update-danh-sach-xet-tuyen.dto';

@Injectable()
export class DanhSachXetTuyenService {
  create(createDanhSachXetTuyenDto: CreateDanhSachXetTuyenDto) {
    return 'This action adds a new danhSachXetTuyen';
  }

  findAll() {
    return `This action returns all danhSachXetTuyen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} danhSachXetTuyen`;
  }

  update(id: number, updateDanhSachXetTuyenDto: UpdateDanhSachXetTuyenDto) {
    return `This action updates a #${id} danhSachXetTuyen`;
  }

  remove(id: number) {
    return `This action removes a #${id} danhSachXetTuyen`;
  }
}
