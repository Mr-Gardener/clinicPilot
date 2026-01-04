import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';

export const requireRole =
  (
    roles: Array<
      AuthRequest['user'] extends undefined
        ? string
        : AuthRequest['user'] extends { role: infer R }
          ? R
          : string
    >,
  ) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
