import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { Task } from './task/task.entity';
import * as dotenv from 'dotenv';
import { AuthModule } from './Auth/auth.module';
import { User } from './User/user.entity';
import { UserModule } from './User/user.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.HOST,
      port: parseInt(process.env.PORT, 10),
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [Task,User],
      synchronize: true,
    }),
    TaskModule,
    AuthModule,
    UserModule
  ],
})
export class AppModule {}
