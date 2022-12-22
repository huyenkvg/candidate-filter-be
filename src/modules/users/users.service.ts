import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { profile } from 'console';
import { MailService } from '../mail/mail.service';
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
    })
    // return u;
      if(!u) return null;
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
  async findAll(query) {
    return await this.prisma.users.findMany({
      select: {
        id: true,
        profile: true,
        role: true,
        username: true,
        active: true,
      },
      where: {
        OR: [{
          username: {
            contains: query.search,
          },
        }, {
          profile: {

            firstname: {
              contains: query.search,
            },
          },
        }, {
          profile: {
            lastname: {
              contains: query.search,
              
            },
          },
        }, {
          profile: {
            phone: {
              contains: query.search,
            },
          },
        },
        ],
      }

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
  updateProfile(id: number, profileDto: ProfileDto, role_id: number) {
   
    return this.prisma.profile.update({
      where: {
        user_id: id,
      },
      data: profileDto,
    }).then(r => {
      
      if (profileDto.active != undefined) {
       return this.prisma.users.update({
          where: {
            id,
          },
          select: {
            profile: true,
            role: true,
          },
          data: {
            active: profileDto.active,
            role_id: role_id || 2,
          },
        });

      }
    })
  }

  remove(id: number) {
    return this.prisma.users.delete({
      where: {
        id,
      },
    });
  }
  async forgotPassword(username: string) {
    let user = await this.prisma.users.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        profile: true,
      },
    });
    if (user) {
      // send email
      const emailContent = MailService.generateEmailContent(
        user.profile.firstname,
        "HIHIHIHIHIHI",
      );
      // Send mail
      // MailService.sendMail( 'huyenkvg@gmail.com', '[Nhăc nhở trả tài sản]', emailContent).catch(
      await MailService.sendMail(
        // res.user.email,
        'huyenkvg@gmail.com',
        '[Nhăc nhở trả tài sản]',
        emailContent,
      );
      return user;

    }
    return {
      message: 'User not found'
    };
  }
}
