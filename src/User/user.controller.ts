import { Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Body, Put, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "./user.entity";
import { Repository } from "typeorm";
import { Roles } from "src/Auth/decorator/roles.decorator";

import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { Authguard } from "src/Auth/gaurd/auth.gaurd";
import { JwtAuthGuard } from "src/Auth/gaurd/jwt.auth.gaurd";

interface CreateResponse {
    message: string;
    data: User[]; 
}

interface DeleteUserResponse {
    message: string;
}

interface UpdateUserResponse {
    message: string;
    data: User;
}

@Controller('users')
@ApiTags('Users')
@UseGuards(Authguard) 
export default class UserOperation {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @Roles(UserRole.USER)
    async getAllUser(): Promise<CreateResponse> {
        try {
            const users = await this.userRepository.find({
                select: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
            });
            if (!users || users.length === 0) {
                throw new NotFoundException('Users not found');
            }
            return {
                message: 'Users successfully retrieved',
                data: users,
            };
        } catch (error) {
            throw new HttpException('Failed to retrieve users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @Roles(UserRole.USER)
    async deleteUser(@Param('id') id: string): Promise<DeleteUserResponse> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        try {
            await this.userRepository.delete(id);
            return { message: `User with ID ${id} successfully deleted` };
        } catch (error) {
            throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @Roles(UserRole.USER)
    async deleteAllUsers(): Promise<DeleteUserResponse> {
        try {
            await this.userRepository.clear(); 
            return { message: 'All users successfully deleted' };
        } catch (error) {
            throw new HttpException('Failed to delete users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    // @Put(':id')
    // async updateUser(
    //     @Param('id') id: string,
    //     @Body() updateUserDto: Partial<User>,
    // ): Promise<UpdateUserResponse> {
    //     const user = await this.userRepository.findOne({ where: { id } });

    //     if (!user) {
    //         throw new NotFoundException(`User with ID ${id} not found`);
    //     }

    //     try {
    //         await this.userRepository.update(id, updateUserDto);
    //         const updatedUser = await this.userRepository.findOne({ where: { id } });

    //         if (!updatedUser) {
    //             throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    //         }

    //         return {
    //             message: `User with ID ${id} successfully updated`,
    //             data: updatedUser,
    //         };
    //     } catch (error) {
    //         throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
}
