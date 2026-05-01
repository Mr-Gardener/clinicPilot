"use client";

import { useEffect, useState } from "react";
import axios from "@/app/utils/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  onAppointmentCreated: () => void;
}

type Option = {
  id: number;
  name: string;
};

export default function CreateAppointmentCard({ onAppointmentCreated }: Props) {
  const [patients, setPatients] = useState<Option[]>([]);
  const [doctors, setDoctors] = useState<Option[]>([]);
  const [patientId, setPatientId] = useState<number | "">("");
  const [doctorId, setDoctorId] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");

      const [patientsRes, doctorsRes] = await Promise.all([
        axios.get("/api/patients", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/users/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPatients(patientsRes.data.data);
      setDoctors(doctorsRes.data.data);
    };

    loadData();
  }, []);

  const handleCreate = async () => {
    if (!patientId || !doctorId || !date || !time) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/appointments",
        { patientId, doctorId, date, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onAppointmentCreated();
      setPatientId("");
      setDoctorId("");
      setDate("");
      setTime("");
    } catch (err) {
      console.error("Create appointment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 space-y-4">
      <h2 className="text-lg font-semibold">Create Appointment</h2>

      <select
        className="w-full border rounded p-2"
        value={patientId}
        onChange={(e) => setPatientId(Number(e.target.value))}
      >
        <option value="">Select Patient</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        className="w-full border rounded p-2"
        value={doctorId}
        onChange={(e) => setDoctorId(Number(e.target.value))}
      >
        <option value="">Select Doctor</option>
        {doctors.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <Button onClick={handleCreate} disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create Appointment"}
      </Button>
    </div>
  );
}
