import {  ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateTaskDto } from "./task.dto";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class UpdateTaskDto{
    @IsNotEmpty({ message: 'Please write your task title' })
    @IsString()
    @ApiProperty()
    title: string;
    
    @IsNotEmpty({ message: 'Please write your task description' })
    @IsString()
    @ApiProperty()
    description: string;
    
    @IsNotEmpty({ message: 'Please write the time you are supposed to complete the task' })
    @Matches(/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/, { 
      message: 'Time must be in the format MM/DD/YYYY',
    })
    @ApiProperty({ example: '10/03/2024', description: 'The time you are supposed to complete the task, in MM/DD/YYYY format' })
    time: string;
}