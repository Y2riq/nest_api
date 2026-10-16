import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {}

    findAll() {
        return this.usersRepository.find();
    }

    findEmail(email: string) {
        return this.usersRepository.find({ 
            where: { email }
        });
    }

    async findOne(id: number) {
        if (!id) {
            throw new NotFoundException('User not found');
        }

        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    createUser(name: string, email: string, password: string) {
        const user = this.usersRepository.create({ name, email, password });
        return this.usersRepository.save(user);
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        Object.assign(user, attrs);
        return this.usersRepository.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);    
        return this.usersRepository.remove(user);
    }
}
