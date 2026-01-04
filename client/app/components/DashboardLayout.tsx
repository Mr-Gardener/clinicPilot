import { logout } from "../utils/logout";
import { useState } from "react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("role") || "";
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-2xl font-bold mb-6">ClinicPilot</h2>

        <nav className="space-y-4">
          <Link
            href="/dashboard"
            className="block p-2 hover:bg-gray-200 rounded"
          >
            Overview
          </Link>

          {/* SuperAdmin only: Manage Users */}
          {role === "superAdmin" && (
            <Link
              href="/dashboard/manage-users"
              className="block p-2 hover:bg-gray-200 rounded"
            >
              Manage Users
            </Link>
          )}

          {/* Doctor only: Appointments */}
          {role === "doctor" && (
            <Link
              href="/dashboard/appointments"
              className="block p-2 hover:bg-gray-200 rounded"
            >
              My Appointments
            </Link>
          )}

          {/* Staff only: Patients */}
          {role === "staff" && (
            <Link
              href="/dashboard/patients"
              className="block p-2 hover:bg-gray-200 rounded"
            >
              Patient Records
            </Link>
          )}

          <button
            onClick={logout}
            className="mt-10 w-full bg-red-500 text-white py-2 rounded"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {/* TOPBAR */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-gray-600 capitalize">{role}</p>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
