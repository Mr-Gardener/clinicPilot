export const getAppointmentDateTime = (date: Date, time: Date) => {
  const appointmentDateTime = new Date(date);
  appointmentDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
  return appointmentDateTime;
};
