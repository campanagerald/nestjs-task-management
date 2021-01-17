import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleRequest(err: any, user: any, info: Error): any {
    if (err || info || !user) {
      throw new UnauthorizedException(err || info);
    }

    return user
  }

}