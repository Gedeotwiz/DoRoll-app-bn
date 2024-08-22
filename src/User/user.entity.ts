import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'; 
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
} 

@Entity()  
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
}