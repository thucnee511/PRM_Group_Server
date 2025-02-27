import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '.';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn() {}

  @Post('signup')
  async signUp() {}

  @Post('signout')
  async signOut() {}

  @Post('refresh')
  async refresh() {}

  @Get('me')
  async me() {}
}
