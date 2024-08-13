import { Controller, Post, Body,Get,Put ,Param, Delete} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Controller('tasks')
export class TaskController {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  @Post()
  async createTask(@Body() task: Task): Promise<Task> {
    return await this.taskRepository.save(task);
  }

  @Get()
  getAllTask(){
    return this.taskRepository.find()
  }
  
  @Put(':index')
  async updateTask(@Param('index') index: number,  @Body() task: Partial<Task>  ): Promise<void> {
    await this.taskRepository.update(index, task);
  }

  @Delete(':index')
   async deleteTask(@Param('index') index: number): Promise<void> {
  await this.taskRepository.delete(index); 
}

  
}
