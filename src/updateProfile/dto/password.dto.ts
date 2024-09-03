import { ApiProperty } from '@nestjs/swagger';
 
export class PasswordDto {  
   
    @ApiProperty()
    currentPassword: string;


    @ApiProperty()
    newPassword: string;
  
}