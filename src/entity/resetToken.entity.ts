import { User } from 'src/User/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class ResetToken {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    userId: string;
  
    @Column()
    token: string;
  
    @Column()
    expiresAt: Date;
  
    @Column({ default: false })
    isExpired: boolean;
  
    @ManyToOne(() => User, (user) => user.resetPasswordToken)
    user: User;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }