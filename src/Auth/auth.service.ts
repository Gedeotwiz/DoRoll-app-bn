import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/User/user.entity';
import { Repository } from 'typeorm';
import { Login } from './dto/login.dto';
import * as bcrypt from 'bcrypt'; 
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot.dto';
import { UserService } from 'src/User/user.service';
import * as crypto from 'crypto';
import { ResetPasswordDto } from './dto/resent.dto';
import { v4 as uuidv4 } from 'uuid';
import { ResetToken } from 'src/entity/resetToken.entity';
import * as nodemailer from 'nodemailer'; // Import nodemailer 


@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private transporter: nodemailer.Transporter; 

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
    @InjectRepository(ResetToken) 
    private readonly resetTokenRepository: Repository<ResetToken> 
  ) {
    this.jwtSecret = configService.get<string>('JWT_SECRET');
    this.transporter = nodemailer.createTransport({  
      host: 'smtp.ethereal.email', 
      port: 587,  
      secure: false,   
      auth: {  
        user: 'noah83@ethereal.email',
        pass: 'kguQUkhn2784JKD83Q' 
      },  
    });
  }

  async sendEmail(to: string, subject: string, text: string, html: string): Promise<void> {  
    const mailOptions = {  
      from: '"Maddison Foo Koch 👻" <noah83@ethereal.email>',  
      to:to,  
      subject,  
      text,  
      html,  
    };  

    try {  
      const info = await this.transporter.sendMail(mailOptions);  
        
    } catch (error) {  
      console.error("Error sending email:", error);  
      throw new InternalServerErrorException('An error occurred while sending email');  
    }  
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
       const scret='qawsedrftgyh'
      const token = jwt.sign({ userId: user.id, userRole: user.role }, scret, { expiresIn: '1h' });
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
    const scret='qawsedrftgyh'
    try {
      const decoded = jwt.verify(token, scret);
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }


  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = uuidv4();
    const resetToken = this.resetTokenRepository.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 3600000), 
    });
    await this.resetTokenRepository.save(resetToken);

    const resetUrl = `${process.env.FRONTEND_URL}/reset?token=${token}`;
    await this.sendEmail(  
      email,  
      'Password Reset Request',  
      `Please use the following link to reset your password: ${resetUrl}`,  
      `<p>Please use the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,  
    );  
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await this.resetTokenRepository.findOne({
      where: { token },
    });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const user = await this.userRepository.findOne({
      where: { id: resetToken.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    await this.resetTokenRepository.delete({ token });
  }
}