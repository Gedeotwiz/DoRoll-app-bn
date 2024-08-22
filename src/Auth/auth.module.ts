import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/User/user.entity';
import { AuthService } from './auth.service';
import { AccessFile } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Authguard } from './gaurd/auth.gaurd';
import { JwtStrategy } from './gaurd/jwt.stratege';

const screKey='qawsedrftgyh'
@Module({
  
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      
      secret: screKey,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, Authguard],
  controllers: [AccessFile],
  exports: [AuthService], 
})
export class AuthModule {}
