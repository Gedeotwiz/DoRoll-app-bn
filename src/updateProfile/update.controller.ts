import { Controller, Put, Body, UseGuards, Request, UploadedFile, UseInterceptors, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update.dto';
import { ProfileService } from './update.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/Auth/decorator/roles.decorator';
import { User, UserRole } from 'src/User/user.entity';
import { JwtAuthGuard } from 'src/Auth/gaurd/jwt.auth.gaurd';

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

@Controller('profile')
@ApiTags('UpdateProfile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Put('update')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(UserRole.USER)
    @UseInterceptors(FileInterceptor('profileImage'))
    async updateProfile(
        @Request() req,
        @Body() updateProfileDto: UpdateUserDto,
        @UploadedFile() file: MulterFile,
    ): Promise<UpdateUserResponse> {
        const userId = req.user.id;
        console.log(userId)
        try {
            const user = await this.profileService.updateProfile(userId, updateProfileDto, file); 

            if (!user) {
                throw new NotFoundException('User not found');
            }

            return {
                message: "User profile successfully updated",
                data: user
            };
        } catch (error) {
            console.log(error)
            throw error;
        }
    }
}
