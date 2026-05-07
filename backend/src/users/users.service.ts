import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async create(email: string, username: string, password: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.repo.save(this.repo.create({ email, username, passwordHash }));
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  async validateOAuthPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }
    const ok = await bcryptjs.compare(password, user.passwordHash);
    return ok ? user : null;
  }

  async changePassword(userId: string, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 10);
    await this.repo.update(userId, { passwordHash });
  }
}
