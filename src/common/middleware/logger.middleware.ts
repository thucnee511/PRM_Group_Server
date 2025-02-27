import { Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const logger = new Logger('LoggerMiddleware', { timestamp: true });
    const { method, originalUrl } = req;
    res.on('finish', () => {
      const { statusCode , statusMessage} = res;
      const origin = req.get('origin') || '';
      logger.log(
        `${method} ${originalUrl} ${statusCode} ${statusMessage} - ${origin}`,
      );
    });
    next();
  }
}
