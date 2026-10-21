import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../users/user.entity.js';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  location: string;

  @Index()
  @Column()
  category: string;

  @Index()
  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => User, (user) => user.items)
  user: Relation<User>;
}
