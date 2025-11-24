"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-dm-sans)" }}>
            Create Account
          </CardTitle>
          <CardDescription style={{ fontFamily: "var(--font-dm-sans)" }}>
            Enter the details for the new admin user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded text-sm"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {success}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="name"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Name (Optional)
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Name"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Password *
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
              <p
                className="text-xs text-muted-foreground"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Minimum 6 characters
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {isLoading ? "Registering..." : "Register Admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
