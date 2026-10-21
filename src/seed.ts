import 'reflect-metadata';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AuthService } from './auth/auth.service.js';
import { ItemsService } from './items/items.service.js';
import { UsersService } from './users/users.service.js';

async function bootstrap() {
  const logger = new Logger('Seeder');
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const authService = app.get(AuthService);
    const usersService = app.get(UsersService);
    const itemsService = app.get(ItemsService);

    // 1. Seed Admin User
    const existingAdmins = await usersService.findEmail('admin@example.com');
    let adminUser = existingAdmins[0];

    if (!adminUser) {
      adminUser = await authService.register(
        'Super Admin',
        'admin@example.com',
        'admin123',
      );
      adminUser = await usersService.update(adminUser.id, { admin: true });
      logger.log('Created Admin user: admin@example.com (password: admin123)');
    } else {
      logger.log('Admin user already exists: admin@example.com');
    }

    // 2. Seed Regular User & Sample Items
    const existingUsers = await usersService.findEmail('user@example.com');
    let regularUser = existingUsers[0];

    if (!regularUser) {
      regularUser = await authService.register(
        'Regular User',
        'user@example.com',
        'user123',
      );
      logger.log('Created Regular user: user@example.com (password: user123)');

      const item1 = await itemsService.create(
        {
          name: 'Mechanical Keyboard',
          description: 'Wireless RGB Mechanical Keyboard',
          price: 150,
          location: 'Jakarta',
          category: 'Electronics',
        },
        regularUser,
      );
      await itemsService.approveItem(item1.id, true);

      await itemsService.create(
        {
          name: 'Gaming Mouse',
          description: 'Ultralight Wireless Gaming Mouse',
          price: 80,
          location: 'Bandung',
          category: 'Electronics',
        },
        regularUser,
      );
      logger.log('Created 2 sample items (1 approved, 1 pending)');
    } else {
      logger.log('Regular user already exists: user@example.com');
    }

    logger.log('Database seeding completed successfully!');
  } finally {
    await app.close();
  }
}

await bootstrap();
