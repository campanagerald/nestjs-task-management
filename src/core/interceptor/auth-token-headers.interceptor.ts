import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

@Injectable()
export class AuthTokenHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map(data => {
      context.switchToHttp().getResponse().set('Authorization', 'Bearer ' + data.token);
      return data.user;
    }));
  }
}