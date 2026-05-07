import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt.config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header = req.headers.authorization ?? '';
    const token = header.replace('Bearer ', '');
    if (!token) {
      return false;
    }
    req.user = jwt.verify(token, jwtConfig.secret, { ignoreExpiration: true });
    return true;
  }
}
