import { PrismaClient, AuditAction } from '@prisma/client';

const prisma = new PrismaClient();

export const logAppointmentAudit = async ({
  tx,
  appointmentId,
  action,
  performedBy,
  changes = [],
}: {
  tx: any;
  appointmentId: string;
  action: AuditAction;
  performedBy: number;
  changes?: { field: string; oldValue?: string; newValue?: string }[];
}) => {
  if (changes.length === 0) {
    await tx.appointmentAuditLog.create({
      data: { appointmentId, action, performedBy },
    });
    return;
  }

  for (const change of changes) {
    await tx.appointmentAuditLog.create({
      data: {
        appointmentId,
        action,
        performedBy,
        field: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue,
      },
    });
  }
};
