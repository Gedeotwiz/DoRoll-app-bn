import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Between } from 'typeorm';
import { UserRole } from 'src/User/user.entity';

interface Request {
  user?: {
    userId: number;
    role: UserRole;
  };
}

@Injectable()
export class TaskService {
  find(arg0: { where: { id: string; }; }) {
    throw new Error('Method not implemented.');
  }
  findOne(arg0: { where: { id: string; }; }) {
    throw new Error('Method not implemented.');
  }
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

  async getUserTasks(userId: number): Promise<{ message: string; data?: Task[] }> {
    try {
      const tasks = await this.taskRepository.find({ where: { userId } });

      if (!tasks || tasks.length === 0) {
        throw new HttpException('No tasks found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Tasks successfully retrieved', data: tasks };
    } catch (error) {
      console.error('Error retrieving tasks:', error.message);
      throw new HttpException('Failed to retrieve tasks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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

  async getTasksByStatus(status: string): Promise<Task[]> {
    return this.taskRepository.find({ where: { status } });
  }

// fliterling api using period

  private getDateRange(period: string): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'this-week':
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); 
        startDate = new Date(now.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now.setDate(startDate.getDate() + 6));
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'this-month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        startDate = new Date(0); 
        endDate = new Date();
    }
    return { startDate, endDate };
  }
  async getTasks(period: string): Promise<Task[]> {
    const { startDate, endDate } = this.getDateRange(period);
    return this.taskRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });
  }
}
