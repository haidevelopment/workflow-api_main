import { NextFunction, Request, Response } from 'express';
import { requireAuth, getAuth } from '@clerk/express';

export const clerkRequireAuth = requireAuth();

export function attachUser(req: Request, _res: Response, next: NextFunction) {
  const auth = getAuth(req);
  if (!auth.userId) return next(new Error('Unauthorized'));
  (req as any).userId = auth.userId;
  next();
}
