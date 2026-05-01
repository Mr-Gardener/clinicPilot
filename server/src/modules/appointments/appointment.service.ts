import { prisma } from '../../lib/prisma';
import { assertFutureDateTime, assertNotDeleted, assertNotFinalized } from './appointment.rules';
import { logAppointmentAudit } from './appointment.audit';
import { getAppointmentDateTime } from '../../utils/appointmentTime';
import { ROLE_STATUS_PERMISSIONS } from '../../constants/appointmentPermissions';
import { VALID_TRANSITIONS } from '../../constants/appointmentTransitions';
import { AppointmentStatus } from '@prisma/client';
import { UserPayload } from '../../types/express';
import { CreateAppointmentDTO } from './appointment.types';
import { NotFoundError } from '../../errors/http.errors';

/* =====================================================
   CREATE
===================================================== */

export const createAppointmentService = async (data: CreateAppointmentDTO, user: UserPayload) => {
  return prisma.$transaction(async (tx) => {
    assertFutureDateTime(data.date, data.time);

    const conflict = await tx.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        date: data.date,
        time: data.time,
        isDeleted: false,
        status: { not: 'cancelled' },
      },
    });

    if (conflict) throw new Error('TIME_CONFLICT');

    const appointment = await tx.appointment.create({
      data: {
        ...data,
        createdBy: user.id,
      },
    });

    await logAppointmentAudit({
      tx,
      appointmentId: appointment.id,
      action: 'CREATED',
      performedBy: user.id,
    });

    return appointment;
  });
};

/* =====================================================
   RESCHEDULE
===================================================== */

export const rescheduleAppointmentService = async (
  id: string,
  newDate: Date,
  newTime: Date,
  user: UserPayload,
) => {
  return prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    assertNotDeleted(appointment);
    assertNotFinalized(appointment.status);
    assertFutureDateTime(newDate, newTime);

    const conflict = await tx.appointment.findFirst({
      where: {
        doctorId: appointment.doctorId,
        date: newDate,
        time: newTime,
        id: { not: id },
        isDeleted: false,
      },
    });

    if (conflict) throw new Error('TIME_CONFLICT');

    const oldDateTime = `${appointment.date} ${appointment.time}`;

    const updated = await tx.appointment.update({
      where: { id },
      data: { date: newDate, time: newTime },
    });

    await logAppointmentAudit({
      tx,
      appointmentId: id,
      action: 'RESCHEDULED',
      performedBy: user.id,
      changes: [
        {
          field: 'date_time',
          oldValue: `${appointment.date} ${appointment.time}`,
          newValue: `${newDate} ${newTime}`,
        },
      ],
    });

    return updated;
  });
};

/* =====================================================
   DELETE (SOFT DELETE)
===================================================== */

export const deleteAppointmentService = async (id: string, user: UserPayload) => {
  return prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    assertNotDeleted(appointment);
    assertNotFinalized(appointment.status);

    const deleted = await tx.appointment.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await logAppointmentAudit({
      tx,
      appointmentId: id,
      action: 'DELETED',
      performedBy: user.id,
    });

    return deleted;
  });
};

/* =====================================================
   HISTORY
===================================================== */

export const getAppointmentHistoryService = async (id: string) => {
  return prisma.appointmentAuditLog.findMany({
    where: { appointmentId: id },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { id: true, name: true, role: true } },
    },
  });
};

/* =====================================================
   UPDATE STATUS
===================================================== */

export const updateAppointmentStatusService = async (
  appointmentId: string,
  newStatus: AppointmentStatus,
  user: UserPayload,
) => {
  return prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    assertNotDeleted(appointment);

    /* Transition rules */
    const allowedNext = VALID_TRANSITIONS[appointment.status];
    if (!allowedNext.includes(newStatus)) {
      throw new Error('INVALID_STATUS_TRANSITION');
    }

    /* Role rules */
    const roleAllowed = ROLE_STATUS_PERMISSIONS[user.role];

    if (!roleAllowed.includes(newStatus)) {
      throw new Error('FORBIDDEN');
    }

    /* Doctor ownership */
    if (user.role === 'doctor' && appointment.doctorId !== user.id) {
      throw new Error('FORBIDDEN');
    }

    /* Time rule */
    const now = new Date();
    const appointmentDateTime = getAppointmentDateTime(appointment.date, appointment.time);

    if ((newStatus === 'completed' || newStatus === 'no_show') && appointmentDateTime > now) {
      throw new Error('CANNOT_UPDATE_BEFORE_TIME');
    }

    const updated = await tx.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus },
    });

    await logAppointmentAudit({
      tx,
      appointmentId,
      action: 'STATUS_UPDATED',
      performedBy: user.id,
      changes: [
        {
          field: 'status',
          oldValue: appointment.status,
          newValue: newStatus,
        },
      ],
    });

    return updated;
  });
};

/* =====================================================
   LIST
===================================================== */

export const getAppointmentsService = async (query: any, user: UserPayload) => {
  const { page = 1, limit = 10, date } = query;

  const pageNumber = Math.max(Number(page), 1);
  const pageSize = Math.min(Number(limit), 50);
  const skip = (pageNumber - 1) * pageSize;

  const where: any = {
    isDeleted: false,
    ...(user.role === 'doctor' && { doctorId: user.id }),
    ...(date && { date: new Date(date) }),
  };

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { time: 'asc' },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true } },
      },
    }),
    prisma.appointment.count({ where }),
  ]);

  return {
    data: appointments,
    meta: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};
