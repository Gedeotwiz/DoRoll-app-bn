import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import UserOperation from './user.controller';
import { User } from './user.entity';
import { AuthModule } from 'src/Auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule, 
  ],
  providers: [UserService],
  controllers: [UserOperation],
})
export class UserModule {}
