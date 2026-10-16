import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Item } from './items/item.entity.js';
import { ItemsModule } from './items/items.module.js';
import { User } from './users/user.entity.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [UsersModule, ItemsModule, TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: 'db.sqlite',
    entities: [User, Item],
    synchronize: true,
  }), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
