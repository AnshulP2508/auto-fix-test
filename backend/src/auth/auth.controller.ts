import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto): Promise<{ accessToken: string }> {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return this.auth.login(dto);
  }

  @Post('oauth')
  oauth(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return this.auth.oauth(dto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string): { accessToken: string; refreshToken: string } {
    return this.auth.refresh(refreshToken);
  }
}
