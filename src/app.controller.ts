import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  // @UseGuards(JwtAuthGuard)
  @Get('huyen-hihi')
  async testHuyen(@Request() req) {
    // console.log('profile req.user :>> ',)
    return this.appService.getHello();
  }
}
