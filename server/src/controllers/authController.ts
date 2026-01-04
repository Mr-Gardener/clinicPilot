import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/generateToken';
import { AuthRequest } from '../types/express';

const prisma = new PrismaClient();

//registration only for superAdmin
export const registerSuperAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };
    // block if there is already any user (one-time)
    const anyUser = await prisma.user.findFirst();
    if (anyUser) {
      return res.status(403).json({ message: 'Super admin already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: 'superAdmin' },
    });

    return res.status(201).json({ message: 'Super admin registered', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const loginUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const found = await prisma.user.findUnique({ where: { email } });
    if (!found) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, found.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(found.id.toString(), found.role);
    return res.status(200).json({ message: 'Login successful', token, user: found });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
