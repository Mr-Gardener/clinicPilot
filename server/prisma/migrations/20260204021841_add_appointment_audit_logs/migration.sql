-- CreateTable
CREATE TABLE "AppointmentAuditLog" (
    "id" SERIAL NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "performedBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppointmentAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentAuditLog_appointmentId_idx" ON "AppointmentAuditLog"("appointmentId");

-- AddForeignKey
ALTER TABLE "AppointmentAuditLog" ADD CONSTRAINT "AppointmentAuditLog_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentAuditLog" ADD CONSTRAINT "AppointmentAuditLog_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
