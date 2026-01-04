import { Router } from 'express';
import { registerSuperAdmin, loginUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.post('/register-superadmin', registerSuperAdmin); // one-time
router.post('/login', loginUser);

// Example protected route
router.get('/admin-only', protect, requireRole(['superAdmin']), (_req, res) => {
  res.send('You are a super admin!');
});

export default router;
