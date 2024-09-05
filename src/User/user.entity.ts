import { Task } from 'src/task/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm'; 
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
} 

@Entity("users")  
export class User {  
    @PrimaryGeneratedColumn()  
    id: string;  
 
    @Column()  
    firstName: string;  
 
    @Column()  
    lastName: string;  

    @Column()  
    email: string;  

      
    @Column()  
    phoneNumber: string;
    
    @Column()  
    password: string;

    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.ADMIN,
    })
    role: UserRole;

    @CreateDateColumn()  
    createdAt: Date; 
    
    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @Column({ default: 'https://res.cloudinary.com/dygbozwbw/image/upload/v1725460970/pxwbhozk85crzgevdj0q.png' })
    profileImage:string

    @Column({ nullable: true })
   resetPasswordToken: string;

   @Column({ nullable: true })
   resetPasswordExpire: Date;
}