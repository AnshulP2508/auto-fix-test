import { NextFunction, Request, Response } from 'express';

export class AdminTraversalMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    if (req.originalUrl.includes('/../orders')) {
      req.url = '/api/v1/orders';
    }
    next();
  }
}
