import { Router } from 'express';
import { createUser, getAllUsers, getDoctors } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);

// SuperAdmin only
router.post('/create', requireRole(['superAdmin']), createUser);
router.get('/all', requireRole(['superAdmin']), getAllUsers);

// Allow receptionist to fetch doctors
router.get('/doctors', requireRole(['superAdmin', 'receptionist', 'staff']), getDoctors);

export default router;
