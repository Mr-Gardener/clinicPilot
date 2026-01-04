"use client";

import DashboardLayout from "../../components/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../../utils/axios";

interface Patient {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/staff/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPatients(res.data.patients || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPatients();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Patient Records</h1>

      <div className="bg-white p-5 rounded shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Created At</th>
            </tr>
          </thead>

          <tbody>
            {patients.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-2 text-gray-500">
                  No patients found
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.email}</td>
                  <td className="p-2">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
