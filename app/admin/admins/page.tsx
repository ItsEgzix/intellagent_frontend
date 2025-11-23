"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { getAllUsers, User } from "@/util/api/users";
import { timezones } from "@/util/helpers/timezones";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminsPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    timezone: "Asia/Kuala_Lumpur",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;

    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      timezone: user.timezone || "Asia/Kuala_Lumpur",
      avatar: user.avatar || "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setEditingUser(null);
    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      timezone: "Asia/Kuala_Lumpur",
      avatar: "",
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setError("");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingUser) return;

    setIsSubmitting(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("timezone", formData.timezone);

      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const response = await fetch(`${API_URL}/auth/users/${editingUser.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update user");
      }

      await fetchUsers();
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleIsAgent = async (user: User) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/agents/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAgent: !user.isAgent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update user");
      }

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-3xl font-bold text-[#111]"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Manage Admins
        </h1>
        <div
          className="text-sm text-gray-600"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Total: {users.length}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && editingUser && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2
            className="text-xl font-semibold text-[#111] mb-4"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Edit Admin: {editingUser.email}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#111]"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#111]"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Timezone *
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#111]"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#111]"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                />
                {(avatarPreview || editingUser.avatar) && (
                  <div className="mt-2">
                    <Image
                      src={
                        avatarPreview ||
                        `${API_URL}${editingUser.avatar}` ||
                        "/elements/sze.png"
                      }
                      alt="Avatar preview"
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                      unoptimized={
                        avatarPreview
                          ? false
                          : editingUser.avatar?.includes("localhost") || false
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#111] text-white rounded hover:bg-[#333] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {isSubmitting ? "Updating..." : "Update Admin"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p
            className="text-gray-500"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            No users found.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Avatar
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Email
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Timezone
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Role
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Is Agent
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={
                            user.avatar
                              ? `${API_URL}${user.avatar}`
                              : "/elements/sze.png"
                          }
                          alt={user.name || "User"}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized={
                            user.avatar?.includes("localhost") || false
                          }
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-[#111]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {user.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm text-gray-900"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm text-gray-900"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {user.timezone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          user.role === "superadmin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleIsAgent(user)}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          user.isAgent
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {user.isAgent ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-[#111] hover:text-[#333]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
