import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { AuthModule } from 'src/Auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule, 
  ],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
