import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshRequestBody, SignInRequestBody, SignUpRequestBody } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthenticationGuard } from 'src/common/guards';
import { AccessToken } from 'src/common/decorators/token.decorator';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: SignInRequestBody) {
    return await this.authService.signIn(body);
  }

  @Post('signup')
  async signUp(@Body() body: SignUpRequestBody) {
    return await this.authService.signUp(body);
  }

  @UseGuards(AuthenticationGuard)
  @Post('refresh')
  @ApiBearerAuth()
  async refresh(@Body() body: RefreshRequestBody) {
    return await this.authService.refresh(body);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  @ApiBearerAuth()
  async me(@AccessToken() token: string) {
    return await this.authService.me(token);
  }
}
