import { Appointment } from '@prisma/client';

export const assertNotDeleted = (appointment: Appointment | null) => {
  if (!appointment || appointment.isDeleted) {
    throw new Error('APPOINTMENT_NOT_FOUND');
  }
};

export const assertNotFinalized = (status: string) => {
  if (['completed', 'cancelled', 'no_show'].includes(status)) {
    throw new Error('FINALIZED_APPOINTMENT');
  }
};

export const assertFutureDateTime = (date: Date, time: Date) => {
  const combined = new Date(
    `${date.toISOString().split('T')[0]}T${time.toISOString().split('T')[1]}`,
  );

  if (combined <= new Date()) {
    throw new Error('CANNOT_SCHEDULE_IN_PAST');
  }
};
