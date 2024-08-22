import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/User/user.entity';
import { Repository } from 'typeorm';
import { Login } from './dto/login.dto';
import * as bcrypt from 'bcrypt'; 
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {
    const screKey='qawsedrftgyh'
    this.jwtSecret = screKey;
  }

  async createTask(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async loginUser(loginUserDto: Login): Promise<{ message: string; token: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { email: loginUserDto.email } });
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = jwt.sign({ userId: user.id, userRole: user.role }, this.jwtSecret, { expiresIn: '1h' });

      return {
        message: 'Login successful',
        token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        console.log(error);
        throw new InternalServerErrorException('An error occurred while logging in the user');
      }
    }
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
