import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task/task.module';
import { Task } from './task/task.entity';
import { AuthModule } from './Auth/auth.module';
import { User } from './User/user.entity';
import { UserModule } from './User/user.module';
import { UpdateProfileModule } from './updateProfile/update.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ResetToken } from './entity/resetToken.entity';


@Module({
  imports: [
    ConfigModule.forRoot(), 
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10) || 5432,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Task,ResetToken],
        synchronize: true,
      }),
    }),
    TaskModule,
    AuthModule,
    UserModule,
    UpdateProfileModule,
  ],
})
export class AppModule {}
