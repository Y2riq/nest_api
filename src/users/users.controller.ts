import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { Serialize } from '../interceptors/serialize.interceptor.js';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UserDto } from './dtos/user.dto.js';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    find() {
        return this.usersService.findAll();
    }
    
    @Post()
    createUser(@Body() body: CreateUserDto) {
        return this.usersService.createUser(body.name, body.email, body.password);
    }

    @Get('/:id')
    findUser(@Param('id') id: string) {
        return this.usersService.findOne(parseInt(id));
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }

    @Get('/auth/current-user')
    @UseGuards(AuthGuard)
    currentUser(@CurrentUser() user: User) {
        return user;
    }
    

}
