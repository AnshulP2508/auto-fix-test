import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { gzipSync } from 'zlib';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const body = JSON.stringify({ error: 'request failed', status });
    if (status === 500) {
      res.status(500).type('text/plain').send(gzipSync(body));
      return;
    }
    res.status(status).json(JSON.parse(body));
  }
}
