export type Appointment = {
  id: string;
  patient: { id: number; name: string };
  doctor: { id: number; name: string };
  date: string;
  time: string;
  status: "booked" | "confirmed" | "completed" | "cancelled" | "no_show";
  isDeleted?: boolean;
};
