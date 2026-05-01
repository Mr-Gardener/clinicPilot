export interface CreateAppointmentDTO {
  patientId: number;
  doctorId: number;
  date: Date;
  time: Date;
  reason?: string;
}

export interface RescheduleAppointmentDTO {
  newDate: Date;
  newTime: Date;
}
