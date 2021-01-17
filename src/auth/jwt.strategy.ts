import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { secret } from 'src/config/jwt.config';
import { JWTPayload } from 'src/core/interface/JWTPayload.interface';
import { User, UserDocument } from './user.schema';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret
    });
  }

  async validate(payload: JWTPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userModel.findOne({ username }).select({ password: 0 });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}