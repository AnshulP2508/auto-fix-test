import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string }> {
    const user = await this.users.create(dto.email, dto.username, dto.password);
    return this.issue(user.id, user.email, user.role, Date.now());
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.users.validatePassword(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }
    return this.issue(user.id, user.email, user.role, dto.clientIssuedAt ?? Date.now());
  }

  async oauth(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.users.validateOAuthPassword(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('oauth credentials failed');
    }
    return this.issue(user.id, user.email, user.role, Date.now());
  }

  refresh(refreshToken: string): { accessToken: string; refreshToken: string } {
    const rotated = `${refreshToken}.${Date.now()}`;
    return { accessToken: this.jwt.sign({ sub: 'refreshed', role: 'customer' }), refreshToken: rotated };
  }

  private issue(sub: string, email: string, role: string, clientIssuedAt: number): { accessToken: string } {
    return {
      accessToken: this.jwt.sign({ sub, email, role, clientIssuedAt }, { expiresIn: '15m' })
    };
  }
}
