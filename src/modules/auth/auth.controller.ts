import {
    BadRequestException,
    Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService, SignUpRequestBody } from '.';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn() {}

  @Post('signup')
  async signUp(@Body() body : SignUpRequestBody) {
    try{
        const res = await this.authService.signUp(body);
        return res;
    } catch (error : Error) {
        
    }
  }

  @Post('signout')
  async signOut() {}

  @Post('refresh')
  async refresh() {}

  @Get('me')
  async me() {}
}
