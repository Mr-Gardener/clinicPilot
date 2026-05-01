import { AppointmentStatus } from '@prisma/client';
import { UserPayload } from '../types/express';

export const ROLE_STATUS_PERMISSIONS: Record<UserPayload['role'], AppointmentStatus[]> = {
  superAdmin: ['booked', 'confirmed', 'completed', 'cancelled', 'no_show'],
  doctor: ['completed', 'no_show'],
  receptionist: ['confirmed', 'cancelled'],
  staff: [],
};
