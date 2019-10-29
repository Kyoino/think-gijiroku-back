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
import * as bcrypt from 'bcryptjs';
import { Role } from './Role';
import { Note } from './Note';

interface UserInterface {
  firstName: string;
  lastName: string;
  password: string;
  roles: Array<Role>;
  notes?: Array<Note> | undefined;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ name: 'first_name', type: 'varchar' })
  @Length(4, 20)
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar' })
  @Length(4, 20)
  lastName: string;

  @Column({ name: 'password', select: false })
  @Length(4, 100)
  password!: string;

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
    this.firstName = (obj && obj.firstName) || '';
    this.lastName = (obj && obj.lastName) || '';
    this.password = (obj && obj.password) || '';
    this.roles = obj && obj.roles;
    this.notes = (obj && obj.notes) || undefined;
  }

  /// no commit with update
  update(obj?: UserInterface): User {
    this.firstName = (obj && obj.firstName) || this.firstName;
    this.lastName = (obj && obj.lastName) || this.lastName;
    this.password = (obj && obj.password) || this.password;
    this.roles = (obj && obj.roles) || this.roles;
    this.notes = (obj && obj.notes) || this.notes;

    return this;
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
