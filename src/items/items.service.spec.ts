import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity.js';
import { Item } from './item.entity.js';
import { ItemsService } from './items.service.js';

describe('ItemsService', () => {
  let service: ItemsService;
  let items: Item[];

  beforeEach(async () => {
    items = [];

    const fakeItemRepository = {
      create: (dto: Partial<Item>) => ({ ...dto, approved: false }) as Item,
      save: (item: Item) => {
        if (!item.id) {
          item.id = items.length + 1;
          items.push(item);
        }
        return Promise.resolve(item);
      },
      findOneBy: ({ id }: { id: number }) =>
        Promise.resolve(items.find((item) => item.id === id) ?? null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getRepositoryToken(Item),
          useValue: fakeItemRepository,
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an item linked to a user', async () => {
    const user = { id: 1, name: 'Ariq', email: 'ariq@test.com' } as User;
    const item = await service.create(
      {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 500,
        location: 'Jakarta',
        category: 'Electronics',
      },
      user,
    );

    expect(item.id).toBe(1);
    expect(item.user).toEqual(user);
    expect(item.approved).toBe(false);
  });

  it('should approve an existing item', async () => {
    const user = { id: 1, name: 'Ariq', email: 'ariq@test.com' } as User;
    const created = await service.create(
      {
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 500,
        location: 'Jakarta',
        category: 'Electronics',
      },
      user,
    );

    const approved = await service.approveItem(created.id, true);
    expect(approved.approved).toBe(true);
  });

  it('should throw NotFoundException when approving a non-existent item', async () => {
    await expect(service.approveItem(999, true)).rejects.toThrow(
      NotFoundException,
    );
  });
});
