
import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn, ManyToOne } from 'typeorm';
import { TaskStatus } from './task.enum';
import { User } from 'src/User/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  time: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum:TaskStatus,
    default: 'ON-TRACK',
  })
  status: string;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @Column()
  userId: number;
}
