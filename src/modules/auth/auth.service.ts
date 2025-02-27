import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/models';
import { Repository } from 'typeorm';

export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signIn() {}

  async signUp() {}

  async signOut() {}

  async refresh() {}

  async me() {}
}
