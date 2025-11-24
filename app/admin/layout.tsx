"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/auth-context";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Don't show layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    ...(user?.role === "superadmin"
      ? [
          { href: "/admin/admins", label: "Admins" },
          { href: "/admin/register", label: "Register Admin" },
        ]
      : []),
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/meetings", label: "Meetings" },
    ...(user?.role === "superadmin"
      ? [{ href: "/admin/emails", label: "Newsletter Subscribers" }]
      : []),
    { href: "/admin/profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#111] text-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Admin Portal
              </h1>
              {user && (
                <p
                  className="text-sm text-gray-300 mt-1"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {user.email}
                </p>
              )}
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-white text-[#111] rounded hover:bg-gray-100 transition-colors"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-4 border-b-2 transition-colors ${
                  pathname === item.href
                    ? "border-[#111] text-[#111] font-semibold"
                    : "border-transparent text-gray-600 hover:text-[#111] hover:border-gray-300"
                }`}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
