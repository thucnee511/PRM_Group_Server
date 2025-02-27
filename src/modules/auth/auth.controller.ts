import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignUpRequestBody } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn() {}

  @Post('signup')
  async signUp(@Body() body: SignUpRequestBody) {
    return await this.authService.signUp(body);
  }

  @Post('signout')
  async signOut() {}

  @Post('refresh')
  async refresh() {}

  @Get('me')
  async me() {}
}
