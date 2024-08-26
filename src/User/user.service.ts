import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
    });
  }


  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async deleteAllUsers(): Promise<void> {
    await this.userRepository.clear();
  }

  async findById(id:string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  
  async update(id: string, updateUser: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateUser);
    return this.findById(id);
  }
}
