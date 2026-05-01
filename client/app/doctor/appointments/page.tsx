"use client";

import DashboardLayout from "../../components/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../utils/axios";

interface Appointment {
  id: string;
  patientName: string;
  time: string;
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/doctor/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(res.data.appointments || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>

      <div className="bg-white p-5 rounded shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Patient</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td className="p-2 text-gray-500" colSpan={2}>
                  No appointments yet
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.patientName}</td>
                  <td className="p-2">{a.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
