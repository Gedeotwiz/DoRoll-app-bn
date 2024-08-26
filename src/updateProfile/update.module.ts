
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/Auth/auth.module';
import { ProfileService } from './update.service';
import { ProfileController } from './update.controller';
import { User } from 'src/User/user.entity';
import { UserModule } from 'src/User/user.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UserService } from 'src/User/user.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UserModule,
    CloudinaryModule,
  ],
  providers: [ProfileService,UserService],
  controllers: [ProfileController],
})
export class UpdateProfileModule {}
