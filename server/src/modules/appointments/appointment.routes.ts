import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { requireRole } from '../../middleware/roleMiddleware';
import { createAppointmentController } from './appointment.controller';
import { updateAppointmentStatusController } from './appointment.controller';
import { rescheduleAppointmentController } from './appointment.controller';
import { getAppointmentHistoryController } from './appointment.controller';
import { deleteAppointmentController } from './appointment.controller';
import { getAppointmentsController } from './appointment.controller';

const router = Router();

/**
 * All appointment routes require authentication
 */
router.use(authMiddleware);

/**
 * -----------------------------
 * CREATE APPOINTMENT
 * -----------------------------
 * superAdmin, receptionist
 */
router.post('/', requireRole(['superAdmin', 'receptionist']), createAppointmentController);
/**
 * -----------------------------
 * LIST APPOINTMENTS
 * -----------------------------
 * superAdmin, doctor, receptionist
 */
router.get('/', requireRole(['superAdmin', 'doctor', 'receptionist']), getAppointmentsController);

/**
 * -----------------------------
 * MANAGE APPOINTMENTS
 * -----------------------------
 * superAdmin, doctor, receptionist
 */
router.patch(
  '/:id/status',
  requireRole(['superAdmin', 'doctor', 'receptionist']),
  updateAppointmentStatusController,
);

router.patch(
  '/:id/reschedule',
  requireRole(['superAdmin', 'receptionist']),
  rescheduleAppointmentController,
);

router.delete(
  '/:id',
  requireRole(['superAdmin', 'doctor', 'receptionist']),
  deleteAppointmentController,
);

/**
 * -----------------------------
 * READ APPOINTMENT HISTORY
 * -----------------------------
 * superAdmin, doctor, receptionist, staff
 */
router.get(
  '/:id/history',
  requireRole(['superAdmin', 'doctor', 'receptionist', 'staff']),
  getAppointmentHistoryController,
);

export default router;
