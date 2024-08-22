import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
