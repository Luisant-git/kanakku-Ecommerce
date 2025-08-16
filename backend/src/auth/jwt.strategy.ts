import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, // Should ideally be from process.env
    });
  }

  async validate(payload: any) {
    if (payload.type === 'admin') {
      // Admin token
      return {
        adminId: payload.adminId,
        email: payload.email,
        type: payload.type,
      };
    } else if (payload.type === 'user') {
      // User token
      return {
        userId: payload.userId,
        email: payload.email,
        type: payload.type,
      };
    }

    // If type is unknown
    return null;
  }
}
