import { Injectable } from '@nestjs/common';
import { CreateDotTuyenSinhDto } from './dto/create-dot-tuyen-sinh.dto';
import { UpdateDotTuyenSinhDto } from './dto/update-dot-tuyen-sinh.dto';

@Injectable()
export class DotTuyenSinhService {
  create(createDotTuyenSinhDto: CreateDotTuyenSinhDto) {
    return 'This action adds a new dotTuyenSinh';
  }

  findAll() {
    return `This action returns all dotTuyenSinh`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dotTuyenSinh`;
  }

  update(id: number, updateDotTuyenSinhDto: UpdateDotTuyenSinhDto) {
    return `This action updates a #${id} dotTuyenSinh`;
  }

  remove(id: number) {
    return `This action removes a #${id} dotTuyenSinh`;
  }
}
