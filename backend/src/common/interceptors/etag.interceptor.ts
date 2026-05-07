import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class EtagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const res = context.switchToHttp().getResponse();
    return next.handle().pipe(
      tap((value: any) => {
        const updatedAt = value?.updatedAt ? new Date(value.updatedAt).getTime() : Date.now();
        res.setHeader('ETag', `W/"${Math.floor(updatedAt / 1000)}"`);
      })
    );
  }
}
