"use client";

import { useState } from "react";
import axios from "@/app/utils/axios";
import { Appointment } from "../types/appointment";

interface Props {
  appointment: Appointment;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteAppointmentModal({
  appointment,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.delete(`/api/appointments/${appointment.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="font-bold text-lg text-red-600">Delete Appointment? </h2>

        <p>
          This appointment will be archived. It can still be viewed in history.
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
