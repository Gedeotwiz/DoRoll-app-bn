import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/User/user.entity';
import { UpdateUserDto } from './dto/update.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

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
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async updateProfile(userId: string, updateProfileDto: UpdateUserDto, file?: MulterFile): Promise<User> {
    if (file) {
      const profileImageUrl = await this.cloudinaryService.uploadImage(file);
      updateProfileDto.profileImage = profileImageUrl.secure_url;
    }

    const updateResult = await this.userRepository.update(userId, updateProfileDto);

    if (updateResult.affected === 0) {
      throw new NotFoundException('User not found');
    }


    const updatedUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }

    return updatedUser;
  }
}
