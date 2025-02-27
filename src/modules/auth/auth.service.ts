import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/models';
import { Repository } from 'typeorm';
import { AssignResponseData, SignInRequestBody, SignUpRequestBody } from '.';
import * as bcrypt from 'bcrypt';

export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signIn(body: SignInRequestBody) {}

  async signUp(body: SignUpRequestBody): Promise<AssignResponseData> {
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (user) throw new Error('This email already exists');
    const hasedPassword = await bcrypt.hash(body.password, 10);
    body.password = hasedPassword;
    await this.userRepository.insert(body);
    return { message: 'User created successfully' };
  }

  async signOut() {}

  async refresh() {}

  async me() {}
}
