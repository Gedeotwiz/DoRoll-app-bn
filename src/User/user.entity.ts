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
      default: UserRole.USER,
    })
    role: UserRole;

    @CreateDateColumn()  
    createdAt: Date; 
    
    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @Column({ default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' })
    profileImage:string

    @Column({ nullable: true })
   resetPasswordToken: string;

   @Column({ nullable: true })
   resetPasswordExpire: Date;
}