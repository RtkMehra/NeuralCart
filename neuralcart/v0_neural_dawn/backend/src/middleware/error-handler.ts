/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/http-error';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err instanceof HttpError ? err.status : err.status ?? 500;
  const message = err.message ?? 'Internal server error';
  const details = err instanceof HttpError ? err.details : undefined;

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('[UnhandledError]', err);
  }

  res.status(status).json({ message, details });
};

