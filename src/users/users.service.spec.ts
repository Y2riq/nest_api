import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  let users: User[];

  beforeEach(async () => {
    users = [];

    const fakeUsersRepository = {
      find: (options?: { where?: { email?: string } }) => {
        if (options?.where?.email) {
          return Promise.resolve(
            users.filter((u) => u.email === options.where!.email),
          );
        }
        return Promise.resolve(users);
      },
      findOneBy: ({ id }: { id: number }) =>
        Promise.resolve(users.find((u) => u.id === id) ?? null),
      create: (dto: Partial<User>) => ({ ...dto }) as User,
      save: (user: User) => {
        if (!user.id) {
          user.id = users.length + 1;
          users.push(user);
        }
        return Promise.resolve(user);
      },
      remove: (user: User) => {
        users = users.filter((u) => u.id !== user.id);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and find a user by id', async () => {
    const created = await service.createUser('Ariq', 'ariq@test.com', 'hashed');
    const found = await service.findOne(created.id);

    expect(found.email).toBe('ariq@test.com');
  });

  it('should throw NotFoundException if user id is not found', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update an existing user', async () => {
    const created = await service.createUser('Ariq', 'ariq@test.com', 'hashed');
    const updated = await service.update(created.id, { name: 'Ariq Baru' });

    expect(updated.name).toBe('Ariq Baru');
  });

  it('should remove an existing user', async () => {
    const created = await service.createUser('Ariq', 'ariq@test.com', 'hashed');
    await service.remove(created.id);

    await expect(service.findOne(created.id)).rejects.toThrow(
      NotFoundException,
    );
  });
});
