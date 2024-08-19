import { Controller, Post, Body, Get, Put, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/task.dto';
import { ApiTags } from '@nestjs/swagger';
import { TaskStatus } from './task.enum';

interface CreateTaskResponse {
  message: string;
  data?: Task | Task[];
}

@Controller('tasks')
@ApiTags('Task')
export class TaskController {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  private determineStatus(time: Date): TaskStatus {
    const taskDate = new Date(time);
    const currentDate = new Date();

    if (taskDate > currentDate) {
      return TaskStatus.ON_TRACK;
    } else if (taskDate.toDateString() === currentDate.toDateString()) {
      return TaskStatus.DONE;
    } else {
      return TaskStatus.OFF_TRACK;
    }
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<CreateTaskResponse> {
    const status = this.determineStatus(new Date(createTaskDto.time));
    const savedTask = await this.taskRepository.save({ ...createTaskDto, status });
    return { message: 'Task successfully created', data: savedTask };
  }

  @Get()
  async getAllTasks(): Promise<CreateTaskResponse> {
    const tasks = await this.taskRepository.find();
    return { message: 'Tasks successfully retrieved', data: tasks };
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: number,
    @Body() task: Partial<Task>,
  ): Promise<CreateTaskResponse> {
    const status = this.determineStatus(new Date(task.time));
    await this.taskRepository.update(id, { ...task, status });
    const updatedTask = await this.taskRepository.findOne({ where: { id } });
    return {
      message: `The task with ID ${id} has been successfully updated`,
      data: updatedTask,
    };
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<{ message: string }> {
    await this.taskRepository.delete(id);
    return { message: `Task with ID ${id} successfully deleted` };
  }

  @Delete()
  async deleteAllTasks(): Promise<{ message: string }> {
    await this.taskRepository.clear();
    return { message: 'All tasks successfully deleted' };
  }
}
