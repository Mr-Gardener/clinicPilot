"use client";

import { Appointment } from "../types/appointment";
import { useState } from "react";
import RescheduleAppointment from "./reschedule";
import DeleteAppointmentModal from "./delete";
import AppointmentHistoryModal from "./history";
import axios from "@/app/utils/axios";
import UpdateAppointmentStatus from "./updatestatus";

interface Props {
  appointments: Appointment[];
  loading?: boolean;
  onReload: () => void;
}

export default function AppointmentTable({
  appointments,
  loading,
  onReload,
}: Props) {
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [action, setAction] = useState<
    "reschedule" | "status" | "delete" | "history" | null
  >(null);
  const [statusUpdate, setStatusUpdate] = useState<string>("");

  console.log("SELECTED:", selected);
  console.log("ACTION:", action);

  if (loading) return <p>Loading appointments...</p>;

  const handleStatusChange = async (
    appointment: Appointment,
    newStatus: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/appointments/${appointment.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Status updated successfully!");
      onReload();
    } catch (err) {
      console.error("❌ Failed to update status:", err);
    }
  };

  const formatDate = (iso: string) => {
    // "2026-02-10T00:00:00.000Z" -> "2026-02-10"
    return iso.slice(0, 10);
  };

  const formatTime = (iso: string) => {
    // "1970-01-01T11:30:00.000Z" -> "11:30"
    return iso.slice(11, 16);
  };

  return (
    <>
      <div className="bg-white p-5 rounded shadow overflow-x-auto mt-4">
        <div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Patient</th>
                <th className="p-2">Doctor</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2 flex items-center gap-2">
                    {a.patient.name}
                    {a.isDeleted && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        Archived
                      </span>
                    )}
                  </td>

                  {/* Doctor name with fallback for deleted doctors */}
                  <td className="p-2">{a.doctor.name}</td>

                  {/* date */}
                  <td className="p-2">
                    {selected?.id === a.id && action === "reschedule" ? (
                      <RescheduleAppointment
                        appointment={a}
                        onClose={() => {
                          setSelected(null);
                          setAction(null);
                        }}
                        onSuccess={onReload}
                      />
                    ) : (
                      formatDate(a.date)
                    )}
                  </td>

                  {/* time */}
                  <td className="p-2">
                    {selected?.id === a.id && action === "reschedule"
                      ? null
                      : formatTime(a.time)}
                  </td>

                  {/* status */}
                  <td className="p-2">
                    {selected?.id === a.id && action === "status" ? (
                      <UpdateAppointmentStatus
                        appointment={a}
                        onClose={() => {
                          setSelected(null);
                          setAction(null);
                        }}
                        onSuccess={onReload}
                      />
                    ) : (
                      <span className="capitalize">{a.status}</span>
                    )}
                  </td>

                  {/* actions */}
                  <td className="p-2 flex gap-2 flex-wrap">
                    {a.isDeleted ? (
                      <span className="text-xs text-gray-400 italic">
                        No actions available
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelected(a);
                            setAction("reschedule");
                          }}
                          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Reschedule
                        </button>

                        <button
                          onClick={() => {
                            setSelected(a);
                            setAction("status");
                          }}
                          className="text-xs bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          Status
                        </button>

                        <button
                          onClick={() => {
                            console.log("HISTORY CLICKED", a.id);
                            setSelected(a);
                            setAction("history");
                          }}
                          className="text-xs bg-gray-1000 text-white px-2 py-1 rounded"
                        >
                          History
                        </button>

                        <button
                          onClick={() => {
                            console.log("DELETE CLICKED", a.id);
                            setSelected(a);
                            setAction("delete");
                          }}
                          className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ GLOBAL MODALS */}
      {selected && action === "delete" && (
        <DeleteAppointmentModal
          appointment={selected}
          onClose={() => {
            setSelected(null);
            setAction(null);
          }}
          onSuccess={onReload}
        />
      )}

      {selected && action === "history" && (
        <AppointmentHistoryModal
          appointment={selected}
          onClose={() => {
            setSelected(null);
            setAction(null);
          }}
        />
      )}
    </>
  );
}
