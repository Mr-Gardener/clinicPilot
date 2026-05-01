import { Request } from 'express';

export interface UserPayload {
  id: number;
  role: 'superAdmin' | 'doctor' | 'receptionist' | 'staff';
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
