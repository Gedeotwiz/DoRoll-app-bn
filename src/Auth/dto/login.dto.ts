import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, IsUppercase } from 'class-validator';  
 
export class Login {  
    

    @IsNotEmpty({ message: "Please provide your email" })  
    @ApiProperty()   
    email: string;  

    @IsNotEmpty({ message: "Please provide your phone number" }) 
    @ApiProperty()
     password: string;

    
}