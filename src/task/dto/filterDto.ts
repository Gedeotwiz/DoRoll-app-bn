
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FilterTasksDto {
  @IsString()
  @ApiProperty()
  status: string;
}