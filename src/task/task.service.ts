import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(task: Task): Promise<Task> {
    return await this.taskRepository.save(task);
  }
  
  getAllTask(){
    return this.taskRepository.find()
  }

  async updateTask(index: number, task: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(index, task);
    const updatedTask = await this.taskRepository.findOne({ where: { id: index } });
    
    return updatedTask;
  }

  async markTaskAsDone(index: number, task: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(index, task);
    const TaskMarked = await this.taskRepository.findOne({ where: { id: index } });
    
    return TaskMarked;
  }

  async deleteTask(index: number): Promise<void> {
    await this.taskRepository.delete(index); 
  }

  async deleteAllTasks(): Promise<void> {
    await this.taskRepository.clear(); 
  }

  async searchTasks(criteria: { title?: string }): Promise<Task[]> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

   if (criteria.title) {
    queryBuilder.andWhere('task.title ILIKE :title', { title: `%${criteria.title}%` });
  }
    return queryBuilder.getMany();
  }
}
