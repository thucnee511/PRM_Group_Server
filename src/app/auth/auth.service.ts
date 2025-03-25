import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/models';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SignInRequestBody, SignUpRequestBody, AssignResponseData, RefreshRequestBody, GoogleSignInRequestBody } from './auth.dto';
import { ItemBaseResponse } from 'src/common/base';
import { emit } from 'process';

@Injectable()
export class AuthService {
  private readonly DEFAULT_GOOGLE_PASSWORD = "User@12345";
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signIn(body: SignInRequestBody): Promise<ItemBaseResponse<AssignResponseData>> {
    this.validatePassword(body.password);
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (!user) throw new NotFoundException('This email does not exist');
    if (user.isActive === false) throw new BadRequestException('This account has been deactivated');
    if (user.isDeleted === true) throw new BadRequestException('This account has been deleted');
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) throw new BadRequestException('Wrong login credentials');
    const payload = {
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      fullname: user.fullname,
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRATION,
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    })
    return {
      status: HttpStatus.OK,
      data:{
        token: {
          accessToken,
          refreshToken
        }
      },
      message: 'Assign successfully'
    }
  }

  async google(body: GoogleSignInRequestBody): Promise<ItemBaseResponse<AssignResponseData>> {
    const user = await this.userRepository.findOne({where:{email: body.email}});
    if (!user) {
      return await this.signUp({
        email: body.email,
        fullname: body.username,
        password: this.DEFAULT_GOOGLE_PASSWORD,
        phoneNumber: body.phoneNumber
      })
    }
    const payload = {
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      fullname: user.fullname,
    }
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    })
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRATION,
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    })
    return {
      status: HttpStatus.OK,
      data:{
        token: {
          accessToken,
          refreshToken
        }
      },
      message: 'Assign successfully'
    }
  }

  async signUp(body: SignUpRequestBody): Promise<ItemBaseResponse<AssignResponseData>> {
    this.validatePassword(body.password);
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (user) throw new BadRequestException('This email already exists');
    const password = body.password;
    const hasedPassword = await bcrypt.hash(body.password, 10);
    body.password = hasedPassword;
    await this.userRepository.insert(body);
    return await this.signIn({ email: body.email, password });
  }

  async refresh(body : RefreshRequestBody) : Promise<ItemBaseResponse<AssignResponseData>> {
    const payload = await this.jwtService.verifyAsync(body.refreshToken, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });
    delete payload.iat;
    delete payload.exp;
    if (!payload) throw new BadRequestException('Invalid token');
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: +process.env.JWT_ACCESS_TOKEN_EXPIRATION,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: +process.env.JWT_REFRESH_TOKEN_EXPIRATION,
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    });
    return {
      status: HttpStatus.OK,
      data: {
        token: {
          accessToken,
          refreshToken
        }
      },
      message: 'Refresh token successfully'
    }
  }

  async me(token: string):Promise<ItemBaseResponse<User>> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
    if (!payload) throw new BadRequestException('Invalid token');
    const user = await this.userRepository.findOne({ where: { email: payload.email } });
    return {
      status: HttpStatus.OK,
      data: user,
      message: 'Get user information successfully'
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 8) 
      throw new BadRequestException('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password))
      throw new BadRequestException('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password))
      throw new BadRequestException('Password must contain at least one lowercase letter');
    if (!/[0-9]/.test(password))
      throw new BadRequestException('Password must contain at least one number');
    if (!/[!@#$%^&*]/.test(password))
      throw new BadRequestException('Password must contain at least one special character');
  }
}
