import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { UsersService } from "../users/users.service.js";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}



    async register(name: string, email: string, password: string) {
        const users = await this.usersService.findEmail(email);
        if (users.length) {
            throw new BadRequestException('Email in use');
        }

        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 64)) as Buffer;
        const hashedPassword = salt + '.' + hash.toString('hex');

        const user = await this.usersService.createUser(name, email, hashedPassword);
        return user;
    }

    async login(email: string, password: string) {
        const [user] = await this.usersService.findEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 64)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Invalid password');
        }

        return user;
    }
}
