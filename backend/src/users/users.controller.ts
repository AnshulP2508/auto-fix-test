import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { RedisService } from '../cache/redis.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly users: UsersService, private readonly cache: RedisService) {}

  @Get('me')
  me(@Req() req: Request): unknown {
    return (req as any).user ?? { id: 'anonymous' };
  }

  @Patch(':id/password')
  changePassword(@Param('id') id: string, @Body('password') password: string): Promise<void> {
    return this.users.changePassword(id, password);
  }

  @Get('profile-cache/:key')
  async profileCache(@Param('key') key: string): Promise<{ value: string | null }> {
    await this.cache.setProfile(key, JSON.stringify({ key, updatedAt: Date.now() }));
    return { value: await this.cache.getProfile(key) };
  }
}
