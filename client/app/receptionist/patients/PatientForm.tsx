"use client";

import { useState } from "react";
import axios from "../../utils/axios";

type PatientForm = {
  name: string;
  dob: string;
  phone: string;
  insurance: string;
  email: "";
  medicalHistory: string;
};

export default function AddPatientForm({
  onPatientAdded,
}: {
  onPatientAdded: () => void;
}) {
  const [form, setForm] = useState<PatientForm>({
    name: "",
    dob: "",
    phone: "",
    insurance: "",
    medicalHistory: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("api/patients", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 201) {
        alert("Patient added successfully!");
        setForm({
          name: "",
          dob: "",
          phone: "",
          insurance: "",
          medicalHistory: "",
          email: "",
        });
        onPatientAdded(); // refresh patient list
      } else {
        setError("Failed to add patient.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-3">Add New Patient</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded bg-gray-400"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="insurance"
          placeholder="Insurance Provider"
          value={form.insurance}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="medicalHistory"
          placeholder="Medical History"
          value={form.medicalHistory}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />
        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Patient"}
        </button>
      </form>
    </div>
  );
}
