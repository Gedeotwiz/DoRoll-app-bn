import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
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

  async getUser(id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async deleteAllUsers(): Promise<void> {
    await this.userRepository.clear();
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async findOneByResetToken(resetPasswordToken: string, resetPasswordExpire: Date): Promise<User | null> {
    return this.userRepository.findOneBy({
      resetPasswordToken,
      resetPasswordExpire: MoreThan(new Date()),
    });
  }

  async update(id: string, updateUser: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateUser);
    return this.findById(id);
  }

  
}
