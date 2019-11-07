import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Length } from 'class-validator';
import { Role } from './Role';
import { Note } from './Note';

interface UserInterface {
  userName: string;
  roles: Array<Role>;
  notes?: Array<Note> | undefined;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ name: 'user_name', type: 'varchar' })
  @Length(4, 20)
  userName: string;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  readonly createdAt!: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt!: Date;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany(type => Role, role => role.users, { cascade: true })
  @JoinTable()
  roles?: Array<Role>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany(type => Note, note => note.user, { cascade: true })
  @JoinTable()
  notes?: Array<Note>;

  constructor(obj?: UserInterface) {
    this.userName = (obj && obj.userName) || '';
    this.roles = obj && obj.roles;
    this.notes = (obj && obj.notes) || undefined;
  }

  /// no commit with update
  update(obj?: UserInterface): User {
    this.userName = (obj && obj.userName) || this.userName;
    this.roles = (obj && obj.roles) || this.roles;
    this.notes = (obj && obj.notes) || this.notes;

    return this;
  }
}
