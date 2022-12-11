import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileDto } from './dto/ProfileDto';
import { UpdateUserDto } from './dto/update-user.dto';

const bcrypt = require('bcrypt');

async function hashPassword(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 10);
  console.log('hash :>> ', hash);
  comparePassword(plaintextPassword, hash);
  return hash;
  // console.log('comparePassword(plaintextPassword, hash) :>> ', comparePassword(plaintextPassword, hash));
  // Store hash in the database
}

// compare password
async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

@Injectable()
export class UsersService {
  prisma = new PrismaClient();

  async findOne(username: string) {
    return this.prisma.users.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        role_id: true,
        active: true,
      },
    });
  }

  async findUserByCredentials(username: string, password: string) {
    // const hash = await bcrypt.hash(password, 10);
    // console.log('hash :>> ', hash);
    let u = await this.prisma.users.findFirst({
      where: {
        username,
        active: true,
      },
      select: {
        id: true,
        username: true,
        password: true,
        role_id: true,
        role: true,
        active: true,
        profile: true,
      },
    });
    // return u;
    return (await comparePassword(password, u.password)) ? u : null;
  }

  async create(createUserDto: CreateUserDto, profileDto: ProfileDto) {
    console.log(' ProfileDt :>> ', profileDto);
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.users.create({
      data: createUserDto,
    }).then(async (user) => {
      console.log('user :>> ', user);
      try {
        await this.prisma.profile.create({
          data: {
            ...profileDto,
            user_id: user.id,
            active: true,
          },
        }).catch((error) => {
          console.log('error :>> ', error);
        })
      }
      catch (error) {
        console.log('error :>> ', error);
      }

      return user;
    });
  }
  async findAll() {
    return await this.prisma.users.findMany({
      select: {
        id: true,
        profile: true,
        role: true,
        username: true,
        active: true,
      },
    });
  }


  async findUser(username: string) {
    return await this.prisma.users.findUnique({
      where: {
        username
      },
      include: {
        profile: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password)
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);

    return await this.prisma.users.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }
  updateProfile(id: number, profileDto: ProfileDto) {
    return this.prisma.profile.update({
      where: {
        user_id: id,
      },
      data: profileDto,
    });
  }

  remove(id: number) {
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }
}
