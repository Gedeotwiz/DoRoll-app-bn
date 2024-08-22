import { Controller, Post, Body, Get, Put, Param, Delete, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/task.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaskStatus } from './task.enum';
import { Roles } from 'src/Auth/decorator/roles.decorator';
import { UserRole } from 'src/User/user.entity';
import { JwtAuthGuard } from 'src/Auth/gaurd/jwt.auth.gaurd';


@ApiTags('Task') 
@Controller('tasks')
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) 
  @Roles(UserRole.USER)
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<{ message: string; data?: Task | Task[] }> {
    try {
      const status = this.determineStatus(new Date(createTaskDto.time));
      const savedTask = await this.taskRepository.save({ ...createTaskDto, status });
      return { message: 'Task successfully created', data: savedTask };
    } catch (error) {
      throw new HttpException('Failed to create task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) 
  @Roles(UserRole.USER)
  async getAllTasks(): Promise<{ message: string; data?: Task | Task[] }> {
    try {
      const tasks = await this.taskRepository.find();
      return { message: 'Tasks successfully retrieved', data: tasks };
    } catch (error) {
      throw new HttpException('Failed to retrieve tasks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN) 
  async updateTask(
    @Param('id') id: number,
    @Body() task: Partial<Task>,
  ): Promise<{ message: string; data?: Task }> {
    try {
      const status = this.determineStatus(new Date(task.time));
      await this.taskRepository.update(id, { ...task, status });
      const updatedTask = await this.taskRepository.findOne({ where: { id } });
      if (!updatedTask) {
        throw new HttpException(`Task with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return {
        message: `The task with ID ${id} has been successfully updated`,
        data: updatedTask,
      };
    } catch (error) {
      throw new HttpException('Failed to update task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.USER)
  async deleteTask(@Param('id') id: number): Promise<{ message: string }> {
    try {
      const deleteResult = await this.taskRepository.delete(id);
      if (deleteResult.affected === 0
) {
        throw new HttpException(`Task with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }
      return { message: `Task with ID ${id} successfully deleted` };
    } catch (error) {
      throw new HttpException('Failed to delete task', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) 
  @Roles(UserRole.USER)
  async deleteAllTasks(): Promise<{ message: string }> {
    try {
      await this.taskRepository.clear();
      return { message: 'All tasks successfully deleted' };
    } catch (error) {
      throw new HttpException('Failed to delete all tasks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
