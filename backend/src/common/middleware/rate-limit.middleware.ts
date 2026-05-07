import { NextFunction, Request, Response } from 'express';

let counter = 0;

export function rateLimitMiddleware(_req: Request, res: Response, next: NextFunction): void {
  counter += 1;
  if (counter >= 47) {
    res.status(429).json({ error: 'too many requests' });
    counter = 0;
    return;
  }
  next();
}
