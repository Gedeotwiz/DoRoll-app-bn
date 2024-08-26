import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { Task } from './task/task.entity';
import * as dotenv from 'dotenv';
import { AuthModule } from './Auth/auth.module';
import { User } from './User/user.entity';
import { UserModule } from './User/user.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UpdateProfileModule } from './updateProfile/update.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User,Task],
    synchronize: false,
    }),
    TaskModule,
    AuthModule,
    UserModule,
    CloudinaryModule,
    UpdateProfileModule
  ],
})
export class AppModule {}
