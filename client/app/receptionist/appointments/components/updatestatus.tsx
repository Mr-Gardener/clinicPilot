"use client";

import { useState } from "react";
import axios from "@/app/utils/axios";
import { Appointment } from "../types/appointment";

interface Props {
  appointment: Appointment;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateAppointmentStatus({
  appointment,
  onClose,
  onSuccess,
}: Props) {
  const [statusUpdate, setStatusUpdate] = useState<string>(appointment.status);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `/api/appointments/${appointment.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Status updated successfully!");
      onSuccess();
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  return (
    <select
      className="border p-1 rounded"
      value={statusUpdate}
      onChange={(e) => setStatusUpdate(e.target.value)}
      onBlur={() => {
        if (statusUpdate && statusUpdate !== appointment.status) {
          handleStatusChange(statusUpdate);
        }
        onClose();
      }}
      autoFocus
    >
      <option value="booked">booked</option>
      <option value="confirmed">confirmed</option>
      <option value="completed">completed</option>
      <option value="cancelled">cancelled</option>
      <option value="no_show">no-show</option>
    </select>
  );
}
