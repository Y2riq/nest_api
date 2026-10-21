import { Logger } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Item } from '../items/item.entity.js';

@Entity()
export class User {
  private readonly logger = new Logger(User.name);

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @OneToMany(() => Item, (item) => item.user)
  items: Relation<Item[]>;

  @AfterInsert()
  afterInsert() {
    this.logger.log(`User created: ${this.id}`);
  }

  @AfterUpdate()
  afterUpdate() {
    this.logger.log(`User updated: ${this.id}`);
  }

  @AfterRemove()
  afterRemove() {
    this.logger.log(`User removed: ${this.id}`);
  }
}
