import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { LocalAuthGuard } from './modules/auth/local-auth.guard';
@Controller()
export class AppController {
  constructor(private appService: AppService, private authService: AuthService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('huyen-hihi')
  async testHuyen(@Request() req) {
    // console.log('profile req.user :>> ',)
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    // console.log('profile req.user :>> ', req.user)
    return this.authService.login(req.user);
  }
 
}
