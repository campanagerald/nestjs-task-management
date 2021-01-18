import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { secret } from '../config/jwt.config';
import { JWTPayload } from '../core/interface/JWTPayload.interface';
import { User, UserModel, UserModelName } from './user.schema';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(UserModelName) private userModel: UserModel) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    const { username } = payload;

    const user = await this.userModel.findOneByUsernameAndSelect(username, { password: 0 });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}