import { NextFunction, Request, Response } from 'express';
import { requestCounter, requestDurationHistogram } from '../metrics/registry';

export const requestMetrics =
  (routeTag = 'unknown') =>
  (req: Request, res: Response, next: NextFunction) => {
    const end = requestDurationHistogram.startTimer({
      method: req.method,
      route: routeTag
    });

    res.on('finish', () => {
      const status = res.statusCode.toString();
      requestCounter.inc({ method: req.method, route: routeTag, status });
      end({ status });
    });

    next();
  };

