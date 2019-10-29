import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Length } from 'class-validator';
import { User } from './User';

interface NoteInterface {
  title: string;
  text: string;
  user?: User | undefined;
}

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column({ name: 'title', type: 'varchar' })
  @Length(4, 20)
  title: string;

  @Column({ name: 'text' })
  @Length(4, 100)
  text: string;

  @Column({ name: 'created_at' })
  @CreateDateColumn()
  readonly createdAt!: Date;

  @Column({ name: 'updated_at' })
  @UpdateDateColumn()
  updatedAt!: Date;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne(type => User, user => user.notes)
  user?: User | undefined;

  constructor(obj?: NoteInterface) {
    this.title = (obj && obj.title) || '';
    this.text = (obj && obj.text) || '';
    this.user = (obj && obj.user) || undefined;
  }
  /// no commit with update
  update(obj?: NoteInterface): Note {
    this.title = (obj && obj.title) || this.title;
    this.text = (obj && obj.text) || this.text;
    this.user = (obj && obj.user) || this.user;

    return this;
  }
}
