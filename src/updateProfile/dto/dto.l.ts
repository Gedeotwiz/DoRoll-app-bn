
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsUppercase } from 'class-validator';

export class UpdateImage {
 

  @ApiProperty({ required: false }) 
  profileImage?: string;
}
