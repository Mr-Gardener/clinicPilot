"use client";

import axiosInstance from "../../utils/axios";
import { useState } from "react";
import axios from "axios";

interface DeletePatientProps {
  patientId: string;
  onDeleted: () => void; // refresh list
  onCancel: () => void;
}

export default function DeletePatient({
  patientId,
  onDeleted,
  onCancel,
}: DeletePatientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Patient deleted successfully!");
      onDeleted();
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
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-lg font-bold mb-4">Delete Patient</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <p className="mb-4">
          Are you sure you want to delete this patient? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
