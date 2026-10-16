import { Body, Controller, Get, Post, Session, UseInterceptors } from '@nestjs/common';
import { Serialize } from '../interceptors/serialize.interceptor.js';
import { CreateUserDto } from '../users/dtos/create-user.dto.js';
import { UserDto } from '../users/dtos/user.dto.js';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { LoginUserDto } from './dtos/login-user.dto.js';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor.js';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) {}

    @Post('/register')
    async register(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.register(body.name, body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/login')
    async login(@Body() body: LoginUserDto, @Session() session: any) {
        const user = await this.authService.login(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/logout')
    logout(@Session() session: any) {
        session.userId = null;
    }
}
