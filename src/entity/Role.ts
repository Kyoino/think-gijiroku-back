import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from './User';

interface RoleInterface {
  role: string;
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ name: 'role' })
  @IsNotEmpty()
  role: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(type => User, user => user.roles)
  users?: Array<User> | undefined;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  readonly createdAt!: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(obj?: RoleInterface) {
    this.role = (obj && obj.role) || 'NORMAL';
  }
}
