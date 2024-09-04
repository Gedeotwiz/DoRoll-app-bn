import { Controller, Put, Body, UseGuards, Request, NotFoundException, Param, Post, UseInterceptors, UploadedFile, Req, BadRequestException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update.dto';
import { ProfileService } from './update.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/Auth/decorator/roles.decorator';
import { User, UserRole } from 'src/User/user.entity';
import { JwtAuthGuard } from 'src/Auth/gaurd/jwt.auth.gaurd';
import { PasswordDto } from './dto/password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/uploadDto';
import { UserService } from 'src/User/user.service';
import { UpdateImage } from './dto/dto.l';

type MulterFile = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  };



interface UpdateUserResponse {
    message: string;
    data: User;
}

interface RequestWithUser extends Request {
    user?: {
      userId: number; 
    };
  }

@Controller('profile')
@ApiTags('UpdateProfile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService,
        private readonly userService:UserService
    ) {}

    @Put('update/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER)
    async updateProfile(
        @Param('id') id: string,
        @Request() req:RequestWithUser,
        @Body() updateProfileDto: UpdateUserDto,
    ): Promise<UpdateUserResponse> {
        const userId = req.user.userId.toString();
        console.log(userId)
        try {
            const user = await this.profileService.updateProfile(userId, updateProfileDto); 

            if (!user) {
                throw new NotFoundException('User not found');
            }

            return {
                message: "User profile data successfully seved",
                data: user
            };
        } catch (error) {
            console.log(error)
            throw error;
        }
    }



    @Put('updatePassword/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER)
    @ApiResponse({ status: 200, description: 'Password updated successfully',})
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiResponse({ status: 401, description: 'Invalid current password' })
    async updatePassword(
      @Param('id') id: string,
      @Request() req: any,
      @Body() updatePasswordDto: PasswordDto,
    ): Promise<UpdateUserResponse> {
      const userId = req.user.userId.toString();
  
      try {
        const user = await this.profileService.updatePassword(userId, updatePasswordDto);
  
        if (!user) {
          throw new NotFoundException('User not found');
        }
  
        return {
          message: 'User password successfully seved',
          data: user,
        };
      } catch (error) {
        console.log(error);
        throw error;
      }
    }


    @Post("uploadImage/:id")
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload an image' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ description: 'File to upload', type: UploadFileDto })
    @ApiResponse({ status: 201, description: 'The image has been uploaded successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request. No file provided or file buffer is undefined.' })
    async uploadImage(
      @UploadedFile() file: MulterFile,
      @Param('id') id: string,
      @Req() req: RequestWithUser,
    ): Promise<{ message: string; data?: User }> {
      
      const userId = req.user.userId.toString();
    
      if (!file) {
        throw new BadRequestException('No file provided');
      }
    
      const result = await this.profileService.uploadImage(file);
      const imageUrl = result.secure_url;
      console.log(imageUrl)
    
      if (!userId) {
        throw new NotFoundException('User not found');
      }
    
      
      const user = await this.userService.findById(userId);
    
      if (!user) {
        throw new NotFoundException('User not found');
      }
    
      const updatedUserDto: UpdateUserDto = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: imageUrl,  
      };
    
      const updatedUser = await this.profileService.updateProfile(userId, updatedUserDto);
    
      return {
        message: 'Image uploaded and profile updated successfully',
        data: updatedUser,
      };
    }
    
}
