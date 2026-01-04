import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, UserPayload } from '../types/express';

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be set');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: string;
      role: UserPayload['role'];
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    return next();
  } catch (err) {
    console.error('JWT ERROR:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
