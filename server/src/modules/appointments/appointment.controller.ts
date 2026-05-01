import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../types/express';
import {
  createAppointmentService,
  updateAppointmentStatusService,
  rescheduleAppointmentService,
  deleteAppointmentService,
  getAppointmentHistoryService,
  getAppointmentsService,
} from './appointment.service';
import { UnauthorizedError } from '../../errors/http.errors';

/* =====================================================
   CREATE
===================================================== */

export const createAppointmentController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }

    const result = await createAppointmentService(req.body, req.user);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   UPDATE STATUS
===================================================== */

export const updateAppointmentStatusController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }

    const updated = await updateAppointmentStatusService(req.params.id, req.body.status, req.user);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   RESCHEDULE
===================================================== */

export const rescheduleAppointmentController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }

    const { date, time } = req.body;

    // combine into one valid date
    const combinedDateTime = new Date(`${date}T${time}:00`);

    if (isNaN(combinedDateTime.getTime())) {
      throw new Error('Invalid date or time format');
    }

    const result = await rescheduleAppointmentService(
      req.params.id,
      combinedDateTime,
      combinedDateTime,
      req.user,
    );

    res.json({ message: 'Appointment rescheduled successfully', data: result });
  } catch (error) {
    console.error('Reschedule error:', error);
    next(error);
  }
};

/* =====================================================
   DELETE (SOFT DELETE)
===================================================== */

export const deleteAppointmentController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }

    await deleteAppointmentService(req.params.id, req.user);

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   HISTORY
===================================================== */

export const getAppointmentHistoryController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const history = await getAppointmentHistoryService(req.params.id);

    res.json(history);
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   LIST (PAGINATED)
===================================================== */

export const getAppointmentsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Unauthorized');
    }

    const result = await getAppointmentsService(req.query, req.user);

    res.json(result);
  } catch (error) {
    next(error);
  }
};
