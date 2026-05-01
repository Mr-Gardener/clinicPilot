-- create enum first
CREATE TYPE "AuditAction" AS ENUM ('CREATED','RESCHEDULED','STATUS_UPDATED','DELETED');

-- change column type safely
ALTER TABLE "AppointmentAuditLog"
ALTER COLUMN "action"
TYPE "AuditAction"
USING (
  CASE
    WHEN action = 'status_change' THEN 'STATUS_UPDATED'::"AuditAction"
    WHEN action = 'RESCHEDULE' THEN 'RESCHEDULED'::"AuditAction"
    WHEN action = 'SOFT_DELETE' THEN 'DELETED'::"AuditAction"
    ELSE 'CREATED'::"AuditAction"
  END
);

ALTER TABLE "Appointment"
ADD COLUMN "isDeleted" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "AppointmentAuditLog"
ADD COLUMN "field" TEXT;
