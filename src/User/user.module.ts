import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthModule } from 'src/Auth/auth.module';
import UserOperation from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule, 
  ],
  providers: [UserService],
  controllers: [UserOperation], 
  exports: [UserService],
})
export class UserModule {}
