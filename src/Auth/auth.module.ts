
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/User/user.entity";
import { ResetToken } from "src/entity/resetToken.entity";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./gaurd/jwt.stratege";
import { Authguard } from "./gaurd/auth.gaurd";
import { UserService } from "src/User/user.service";
import { AccessFile } from "./auth.controller";

const screKey='qawsedrftgyh'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([User, ResetToken]), 
    PassportModule,
    JwtModule.register({
      secret: screKey,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, Authguard, UserService],
  controllers: [AccessFile],
  exports: [AuthService],
})
export class AuthModule {}

