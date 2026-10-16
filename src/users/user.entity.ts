import { Exclude } from "class-transformer";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @AfterInsert()
    afterInsert() {
        console.log('User created:', this.id);
    }

    @AfterUpdate()
    afterUpdate() {
        console.log('User updated:', this.id);
    }

    @AfterRemove()
    afterRemove() {
        console.log('User removed:', this.id);
    }
}