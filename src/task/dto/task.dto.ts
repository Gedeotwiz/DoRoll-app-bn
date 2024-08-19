

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Please write your task title' })
  @IsString()
  title: string;
  
  @IsNotEmpty({ message: 'Please write your task description' })
  @IsString()
  description: string;
  
  @IsNotEmpty({ message: 'Please write the time you suposed to complete the task' })
  @IsString()
  time: string;
}
