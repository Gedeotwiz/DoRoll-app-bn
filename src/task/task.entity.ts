
import { Entity, Column, PrimaryGeneratedColumn,CreateDateColumn } from 'typeorm';
import { TaskStatus } from './task.enum';

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
}
