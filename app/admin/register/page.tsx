"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useAuth();
  const router = useRouter();

  // Check if user is superadmin
  if (user?.role !== "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <h1
              className="text-2xl font-bold text-red-600 mb-4"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Access Denied
            </h1>
            <p
              className="text-gray-600 mb-6"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Only superadmin can register new admin users.
            </p>
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-[#111] text-white rounded hover:bg-[#333] transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }

      setSuccess("Admin user registered successfully!");
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1
        className="text-3xl font-bold text-[#111] mb-8"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Register New Admin
      </h1>

      <div className="bg-white rounded-lg shadow p-8 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {success}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Name (Optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#111] focus:border-transparent"
              style={{ fontFamily: "var(--font-dm-sans)" }}
              placeholder="Admin Name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#111] focus:border-transparent"
              style={{ fontFamily: "var(--font-dm-sans)" }}
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Password *
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#111] focus:border-transparent"
              style={{ fontFamily: "var(--font-dm-sans)" }}
              placeholder="••••••••"
            />
            <p
              className="text-xs text-gray-500 mt-1"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Minimum 6 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#111] text-white py-2.5 px-4 font-semibold rounded hover:bg-[#333] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {isLoading ? "Registering..." : "Register Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
