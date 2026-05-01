import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
} from '../controllers/patient.controller';
import { UserPayload } from '../types/express';

const router = Router();

type Role = UserPayload['role'];

const allowedRoles: Role[] = ['superAdmin', 'receptionist', 'staff'];

router.use(authMiddleware);

router.post('/', requireRole(allowedRoles), createPatient);
router.get('/', requireRole(allowedRoles), getPatients);
router.put('/:id', requireRole(allowedRoles), updatePatient);
router.delete('/:id', requireRole(allowedRoles), deletePatient);

export default router;
