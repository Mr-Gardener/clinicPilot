"use client";

import { useState, useRef } from "react";
import axios from "@/app/utils/axios";
import { Appointment } from "../types/appointment";

interface Props {
  appointment: Appointment;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RescheduleAppointment({
  appointment,
  onClose,
  onSuccess,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const formatDate = (iso: string) => iso.split("T")[0];
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [date, setDate] = useState(formatDate(appointment.date));
  const [time, setTime] = useState(formatTime(appointment.time));

  const handleReschedule = async () => {
    console.log("New date:", date, "New time:", time);

    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `/api/appointments/${appointment.id}/reschedule`,
        { date, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Rescheduled successfully");
      onSuccess();
    } catch (err) {
      console.error("❌ Reschedule failed:", err);
    }
  };

  /**
   * Runs only when leaving the WHOLE component
   */
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;

    // still inside component → ignore
    if (wrapperRef.current?.contains(next)) return;

    const originalDate = formatDate(appointment.date);
    const originalTime = formatTime(appointment.time);

    if (date !== originalDate || time !== originalTime) {
      handleReschedule();
    }

    onClose();
  };

  return (
    <div
      ref={wrapperRef}
      tabIndex={-1}
      onBlur={handleBlur}
      className="flex gap-2"
    >
      <input
        type="date"
        className="border rounded px-1"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        autoFocus
      />

      <input
        type="time"
        className="border rounded px-1"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
    </div>
  );
}
