import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/models';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInRequestBody, SignUpRequestBody, AssignResponseData } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signIn(body: SignInRequestBody) {}

  async signUp(body: SignUpRequestBody): Promise<AssignResponseData> {
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (user) throw new BadRequestException('This email already exists');
    const hasedPassword = await bcrypt.hash(body.password, 10);
    body.password = hasedPassword;
    await this.userRepository.insert(body);
    return { message: 'User created successfully' };
  }

  async signOut() {}

  async refresh() {}

  async me() {}
}
