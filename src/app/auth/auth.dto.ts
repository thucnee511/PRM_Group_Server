import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInRequestBody {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class SignUpRequestBody {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty()
  phoneNumber?: string;
}

export class RefreshRequestBody {
  @ApiProperty()
  refreshToken: string;
}

export class AssignResponseData {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}

export class GoogleSignInRequestBody {
  @ApiProperty()
  email: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  phoneNumber: string;
}
