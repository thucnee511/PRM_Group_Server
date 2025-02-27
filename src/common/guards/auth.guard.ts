import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models';
import { Repository } from 'typeorm';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new ForbiddenException('Authorization header not found');
    }
    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('Token not found');
    }
    const payload = await this.jwtService.verifyAsync<User>(token);
    if (!payload) {
      throw new ForbiddenException('Invalid token');
    }
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    request.user = user;
    return true;
  }
}
