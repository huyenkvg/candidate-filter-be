import { Injectable, Dependencies } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Dependencies(UsersService, JwtService)
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username, pass) {
    // console.log('username :>> ', username);
    const user = await this.usersService.findUserByCredentials(username, pass);
    return user;
  }

  async login(user: User) {
    // console.log('user :>> ', user);
    const payload = {
      username: user.username,
      sub: user.id,
      roleId: user.role_id,
      role: user.role,
      profile: user.profile
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getHello() {
    return 'Hello World!';
  }
}
