import { Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRole } from "./user.entity";
import { Repository } from "typeorm";
import { Roles } from "src/Auth/decorator/roles.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/Auth/gaurd/jwt.auth.gaurd";
import { UserService } from "./user.service";

interface CreateResponse {
    message: string;
    data: User[]; 
}

interface DeleteUserResponse {
    message: string;
}

@Controller('users')
@ApiTags('Users')
export default class UserOperation {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly profileService: UserService
    ) {}

    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @Roles(UserRole.USER)
    async getAllUser(): Promise<CreateResponse> {
        try {
            const users = await this.userRepository.find({
                select: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt',],
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


    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard) 
    @Roles(UserRole.USER)
    async getUser(@Param('id') id: string): Promise< {message: string; data?: User}> {
        const user = await this.userRepository.findOne({ where: { id } });
        console.log(user.id)
        try {
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
         return {message:"user successfuly retrived",data:user}
        } catch (error) {
            throw new HttpException('Failed to retrive user', HttpStatus.INTERNAL_SERVER_ERROR);
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
}