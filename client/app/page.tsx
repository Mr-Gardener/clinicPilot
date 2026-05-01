"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-600">
          Welcome to ClinicFlow
        </h1>
        <p className="text-gray-600 mb-6">
          A Modern Healthcare Management System
        </p>

        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
        >
          Login
        </button>
      </div>
    </main>
  );
}
