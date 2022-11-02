import { Injectable } from '@nestjs/common';
import { CreateNganhDto } from './dto/create-nganh.dto';
import { UpdateNganhDto } from './dto/update-nganh.dto';

@Injectable()
export class NganhService {
  create(createNganhDto: CreateNganhDto) {
    return 'This action adds a new nganh';
  }

  findAll() {
    return `This action returns all nganh`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nganh`;
  }

  update(id: number, updateNganhDto: UpdateNganhDto) {
    return `This action updates a #${id} nganh`;
  }

  remove(id: number) {
    return `This action removes a #${id} nganh`;
  }
}
