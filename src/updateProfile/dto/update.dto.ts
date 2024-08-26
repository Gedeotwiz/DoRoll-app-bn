
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, IsUppercase } from 'class-validator';  
 
export class UpdateUserDto {  
    @IsNotEmpty({ message: "Please provide your first name" })  
    @IsUppercase({ message: "First name should be in uppercase letters" })  
    @IsString()
    @ApiProperty()   
    firstName: string;  

    @IsNotEmpty({ message: "Please provide your last name" })  
    @IsString()
    @ApiProperty()   
    lastName: string;  

    @IsNotEmpty({ message: "Please provide your email" })  
    @IsEmail({}, { message: "Email must be valid" }) 
    @ApiProperty()   
    email: string;  

    @IsNotEmpty({ message: "Please provide your phone number" })  
    @IsPhoneNumber(null, { message: "Phone number must be valid" }) 
    @ApiProperty()    
    phoneNumber: string;
    
    
     @IsOptional()
     @IsString()
     @ApiProperty()
    currentPassword?: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    newPassword?: string;

    profileImage:string
}