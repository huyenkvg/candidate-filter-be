import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProfileDto } from './dto/ProfileDto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async create(@Body() body) {
    const createUserDto: CreateUserDto = body.user;
    const profileDto: ProfileDto = body.profile;
    //console.log('profileDto :>> ', profileDto);
    try {
      const user = await this.usersService.create(createUserDto, profileDto);
      return user;
    }
    catch (error) {
      //console.log('error :>> ', error);
      switch (error.code) {
        case 'P2002':
          return {
            message: 'Username already exists',
          };
        case 'P2003':
          return {
            message: 'This role does not exist',
          };
        default:
          return {
            message: 'Something went wrong, retry later',
          };
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.usersService.findUser(username);
  }

  @Patch('update-profile/:id')
  updateProfile(@Param('id') id: number, @Body() dto: ProfileDto) {
    return this.usersService.updateProfile(+id, dto);
  }

  @Patch('user/:id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile')
  async profile(@Request() req) {
    //console.log('profile req.user :>> ', req.user)
    return this.usersService.findUser(req.user.username);
  }
}
