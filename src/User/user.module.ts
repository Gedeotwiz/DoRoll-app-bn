import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import UserOperation from './user.controller';
import { User } from './user.entity';
import { AuthModule } from 'src/Auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule, 
    CloudinaryModule,
  ],
  providers: [UserService],
  controllers: [UserOperation],
})
export class UserModule {}
