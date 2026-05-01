"use client";

import axios from "@/app/utils/axios";
import { useEffect, useState } from "react";
import AddPatientForm from "../patients/PatientForm";
import EditPatientModal from "../patients/EditPatientModal";
import AppointmentTable from "../appointments/components/AppointmentTable";
import { Appointment } from "../appointments/types/appointment";
import CreateAppointmentCard from "../appointments/components/CreateAppointmentModal";

export type Patient = {
  id: string;
  name: string;
  dob?: string;
  email?: string;
  phone?: string;
  insurance?: string;
  medicalHistory?: string;
  status: "active" | "inactive";
  createdAt: string;
};

export default function ReceptionistDashboard() {
  const [activeTab, setActiveTab] = useState<"patients" | "appointments">(
    "patients"
  );

  /** Patients state */
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchPatient, setSearchPatient] = useState("");
  const [pagePatient, setPagePatient] = useState(1);
  const [totalPagesPatient, setTotalPagesPatient] = useState(1);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);

  /** Appointments state */
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pageAppointment, setPageAppointment] = useState(1);
  const [totalPagesAppointment, setTotalPagesAppointment] = useState(1);
  const [loadingAppointment, setLoadingAppointment] = useState(false);
  const [appointmentsReload, setAppointmentsReload] = useState(false);

  /** Fetch patients */
  const fetchPatients = async () => {
    setLoadingPatient(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/patients", {
        params: { search: searchPatient, page: pagePatient },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data.data);
      setTotalPagesPatient(res.data.pages);
    } catch (err) {
      console.error("Fetch patients error:", err);
    } finally {
      setLoadingPatient(false);
    }
  };

  /** Fetch appointments */
  const fetchAppointments = async () => {
    setLoadingAppointment(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/appointments", {
        params: { page: pageAppointment, limit: 10 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data.data);
      setTotalPagesAppointment(res.data.pages);
    } catch (err) {
      console.error("Fetch appointments error:", err);
    } finally {
      setLoadingAppointment(false);
    }
  };

  /** Effects */
  useEffect(() => {
    const loadPatients = async () => await fetchPatients();
    loadPatients();
  }, [searchPatient, pagePatient]);

  useEffect(() => {
    const loadAppointments = async () => await fetchAppointments();
    loadAppointments();
  }, [pageAppointment, appointmentsReload]);

  return (
    <div className="space-y-10">
      {/* ===== TOGGLE BAR ===== */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("patients")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "patients"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Patients
        </button>

        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "appointments"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Appointments
        </button>
      </div>

      <div className="space-y-10">
        {/* ===== PATIENTS SECTION ===== */}
        {activeTab === "patients" && (
          <section className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h1 className="text-2xl font-bold">Patients</h1>

              <input
                type="text"
                placeholder="Search by name, phone or email"
                className="border p-2 rounded w-full md:max-w-sm"
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
              />
            </div>

            {/* Add patient */}
            <AddPatientForm onPatientAdded={fetchPatients} />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Active Patients</p>
                <p className="text-2xl font-bold">
                  {patients.filter((p) => p.status === "active").length}
                </p>
              </div>
            </div>

            {/* Patients table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">DOB</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Insurance</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Created</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">{p.dob || "-"}</td>
                      <td className="p-3">{p.email || "-"}</td>
                      <td className="p-3">{p.phone || "-"}</td>
                      <td className="p-3">{p.insurance || "-"}</td>
                      <td className="p-3 capitalize">{p.status}</td>
                      <td className="p-3">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => setEditPatient(p)}
                          className="text-sm bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <button
                disabled={pagePatient === 1}
                onClick={() => setPagePatient((p) => p - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm">
                Page {pagePatient} of {totalPagesPatient}
              </span>
              <button
                disabled={pagePatient === totalPagesPatient}
                onClick={() => setPagePatient((p) => p + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
        )}

        {editPatient && (
          <EditPatientModal
            patient={editPatient}
            onClose={() => setEditPatient(null)}
            onSaved={fetchPatients}
          />
        )}
        {/* ===== APPOINTMENTS SECTION ===== */}
        {activeTab === "appointments" && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointments table */}
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-2xl font-bold">Appointments</h1>

              <AppointmentTable
                appointments={appointments}
                loading={loadingAppointment}
                onReload={() => setAppointmentsReload((v) => !v)}
              />

              {/* pagination */}
            </div>

            {/* Floating card */}
            <div className="lg:sticky lg:top-24 h-fit">
              <CreateAppointmentCard
                onAppointmentCreated={() => setAppointmentsReload((v) => !v)}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
