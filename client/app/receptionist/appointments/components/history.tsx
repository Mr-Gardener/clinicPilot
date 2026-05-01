"use client";

import { useEffect, useState } from "react";
import axios from "@/app/utils/axios";
import { Appointment } from "../types/appointment";

interface AuditLog {
  id: number;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    role: string;
  };
}

interface Props {
  appointment: Appointment;
  onClose: () => void;
}

export default function AppointmentHistoryModal({
  appointment,
  onClose,
}: Props) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `/api/appointments/${appointment.id}/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [appointment.id]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <h2 className="font-bold text-lg">Appointment History</h2>

        {loading ? (
          <p>Loading history...</p>
        ) : logs.length === 0 ? (
          <p>No history available.</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border rounded p-3 text-sm space-y-1"
              >
                <p>
                  <strong>Action:</strong> {log.action}
                </p>

                <p>
                  <strong>By:</strong> {log.user.name} ({log.user.role})
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(log.createdAt).toLocaleString()}
                </p>

                {log.field && (
                  <div className="pl-3 border-l mt-2">
                    <p>
                      <strong>{log.field}:</strong>{" "}
                      {`${log.oldValue ?? "-"} → ${log.newValue ?? "-"}`}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
