import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

    describe('AuthService', () => {
      let service: AuthService;
      let fakeUsersService: Partial<UsersService>;

      beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
          findEmail: (email: string) =>
            Promise.resolve(users.filter((user) => user.email === email)),
          createUser: (name: string, email: string, password: string) => {
            const user = { id: 1, name, email, password } as User;
            users.push(user);
            return Promise.resolve(user);
          },
        };

        const module: TestingModule = await Test.createTestingModule({
          providers: [
            AuthService,
            { provide: UsersService, useValue: fakeUsersService },
          ],
        }).compile();

        service = module.get<AuthService>(AuthService);
      });

      it('should be defined', () => {
        expect(service).toBeDefined();
      });

      it('should create a new user with a salted and hashed password', async () => {
        const user = await service.register(
          'Test User',
          'test@example.com',
          'password',
        );

        expect(user.password).not.toEqual('password');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
      });

      it('should fail to create a user with an existing email', async () => {
        await service.register('John Doe', 'john@example.com', 'password');

        await expect(
          service.register('John Doe', 'john@example.com', 'password'),
        ).rejects.toThrow('Email in use');
      });

      it('should fail if user login with invalid email', async () => {
        await expect(
          service.login('Ariq@example.com', 'password'),
        ).rejects.toThrow('User not found');
      });

      it('should fail to login with wrong password', async () => {
        await service.register('John Doe', 'john@example.com', 'password');

        await expect(service.login('john@example.com', '123')).rejects.toThrow(
          'Invalid password',
        );
      });

      it('should login existing user', async () => {
        await service.register('John Doe', 'john@example.com', 'password');

        const user = await service.login('john@example.com', 'password');
        expect(user).toBeDefined();
      });
    });