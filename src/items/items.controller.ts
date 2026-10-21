import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { AdminGuard } from '../guards/admin.guard.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { Serialize } from '../interceptors/serialize.interceptor.js';
import { User } from '../users/user.entity.js';
import { ApproveItemDto } from './dtos/approve-item.dto.js';
import { CreateItemDto } from './dtos/create-item.dto.js';
import { ItemDto } from './dtos/item.dto.js';
import { QueryItemDto } from './dtos/query-item.dto.js';
import { ItemsService } from './items.service.js';

@Controller('items')
export class ItemsController {
  constructor(private itemService: ItemsService) {}

  @Get()
  getAllItems(@Query() query: QueryItemDto) {
    return this.itemService.getAllItems(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ItemDto)
  createItem(@Body() body: CreateItemDto, @CurrentUser() user: User) {
    return this.itemService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ApproveItemDto,
  ) {
    return this.itemService.approveItem(id, body.approved);
  }
}
