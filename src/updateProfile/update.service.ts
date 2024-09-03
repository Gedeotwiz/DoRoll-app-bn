import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/User/user.entity';
import { UpdateUserDto } from './dto/update.dto';
import { PasswordDto } from './dto/password.dto';
import * as bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';




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

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private configService: ConfigService
  ) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async updateProfile(userId: string, updateProfileDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update({ id: userId }, updateProfileDto);

    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updatePassword(userId: string, updatePassword: PasswordDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(updatePassword.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(updatePassword.newPassword, 10);
    console.log(hashedPassword)

    await this.userRepository.update({ id: userId }, { password: hashedPassword });

    return this.userRepository.findOne({ where: { id: userId } });
  }


  async uploadImage(file: MulterFile): Promise<any> {
    if (!file || !file.buffer) {
        throw new Error('No file provided or file buffer is undefined');
      }
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(file.buffer);
    });
  }
}
