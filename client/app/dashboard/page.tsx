"use client";

import DashboardLayout from "../components/DashboardLayout";

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Welcome to ClinicPilot</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold">Todays Appointments</h2>
          <p className="text-gray-600 mt-2">No data yet</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold">Pending Tasks</h2>
          <p className="text-gray-600 mt-2">Coming soon</p>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-gray-600 mt-2">None</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
