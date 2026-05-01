"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import axios from "axios";
import { Patient as PagePatientType } from "../dashboard/page";

type EditPatientProps = {
  patient: PagePatientType;
  onClose: () => void;
  onSaved: () => void; // refresh patient list after update
};

export default function EditPatientModal({
  patient,
  onClose,
  onSaved,
}: EditPatientProps) {
  const [form, setForm] = useState({ ...patient });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/patients/${patient.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Patient updated successfully!");
      onSaved();
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err))
        setError(err.response?.data?.message || err.message);
      else if (err instanceof Error) setError(err.message);
      else setError(JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Edit Patient</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="date"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Insurance"
            value={form.insurance}
            onChange={(e) => setForm({ ...form, insurance: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Medical History"
            value={form.medicalHistory}
            onChange={(e) =>
              setForm({ ...form, medicalHistory: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
