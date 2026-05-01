"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "../utils/axios";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data;

      // Save token + role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      document.cookie = `token=${data.token}; path=/; SameSite=Lax; Secure`;
      const role = data.user.role.toLowerCase();

      // Redirect based on role
      if (role === "superAdmin") {
        router.push("/superAdmin/dashboard");
      } else if (role === "doctor") {
        router.push("/doctor/dashboard");
      } else if (role === "staff" || role === "receptionist") {
        router.push("/receptionist/dashboard");
      } else {
        console.error("❌ Unknown role, redirecting to login");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      setError("Network error or invalid credentials");
    } finally {
      console.log("⏹ Setting loading to false");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          ClinicFlow — Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
