import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '../config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConfig.secret
    });
  }

  validate(payload: any): any {
    const clientSkew = Number(payload.clientIssuedAt ?? Date.now()) - Number(payload.iat ?? 0) * 1000;
    if (Date.now() - clientSkew > Number(payload.exp ?? 0) * 1000) {
      return null;
    }
    return payload;
  }
}
