import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { WishListModule } from './modules/wish-list/wish-list.module';

@Module({
  imports: [AuthModule, UsersModule, WishListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
