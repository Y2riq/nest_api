import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import { CreateItemDto } from './dtos/create-item.dto.js';
import { QueryItemDto } from './dtos/query-item.dto.js';
import { Item } from './item.entity.js';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  create(item: CreateItemDto, user: User) {
    const newItem = this.itemRepository.create(item);
    newItem.user = user;
    return this.itemRepository.save(newItem);
  }

  async approveItem(id: number, approved: boolean) {
    const item = await this.itemRepository.findOneBy({ id });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    item.approved = approved;
    return this.itemRepository.save(item);
  }

  async getAllItems(queryItemDto: QueryItemDto) {
    const query = this.itemRepository
      .createQueryBuilder()
      .select('*')
      .where('approved = :approved', { approved: true });

    if (queryItemDto.name) {
      query.andWhere('name LIKE :name', { name: `%${queryItemDto.name}%` });
    }

    if (queryItemDto.location) {
      query.andWhere('location LIKE :location', {
        location: `%${queryItemDto.location}%`,
      });
    }

    if (queryItemDto.category) {
      query.andWhere('category LIKE :category', {
        category: `%${queryItemDto.category}%`,
      });
    }

    if (queryItemDto.price !== undefined) {
      query.andWhere('price <= :price', { price: queryItemDto.price });
    }

    query.limit(queryItemDto.limit ?? 20).offset(queryItemDto.offset ?? 0);

    return query.getRawMany();
  }
}
