import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor.js';

@Module({
  imports: [UsersModule],
  providers: [
    AuthService,
    CurrentUserInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor
    }
  ],
  controllers: [AuthController]
})
export class AuthModule {}
