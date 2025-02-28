import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/models';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { SignInRequestBody, SignUpRequestBody, AssignResponseData, RefreshRequestBody } from './auth.dto';
import { ItemBaseResponse } from 'src/common/base';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signIn(body: SignInRequestBody): Promise<ItemBaseResponse<AssignResponseData>> {
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (!user) throw new NotFoundException('This email does not exist');
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) throw new BadRequestException('Wrong login credentials');
    const payload = {
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
}
