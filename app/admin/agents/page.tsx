"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import Link from "next/link";
import { getAllUsers, User } from "@/util/api/users";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Agent {
  id: string;
  name: string;
  email: string;
  timezone: string;
  avatar?: string;
  isActive: boolean;
  isAgent: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AgentsPage() {
  const { token } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    userId: "",
    timezone: "Asia/Kuala_Lumpur",
    avatar: "",
    isActive: true,
    isAgent: true,
  });

  useEffect(() => {
    fetchAgents();
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    setIsLoadingUsers(true);
    try {
      const usersData = await getAllUsers(token);
      // Filter out users who are already agents
      const nonAgentUsers = usersData.filter((user) => !user.isAgent);
      setUsers(nonAgentUsers);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchAgents = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/agents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }

      const data = await response.json();
      setAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load agents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!editingAgent && !formData.userId) {
      setError("Please select a user");
      return;
    }

    try {
      const url = editingAgent
        ? `${API_URL}/agents/${editingAgent.id}`
        : `${API_URL}/agents`;
      const method = editingAgent ? "PATCH" : "POST";

      // For creating, send userId; for editing, send update data
      const requestData = editingAgent
        ? {
            timezone: formData.timezone,
            avatar: formData.avatar,
            isActive: formData.isActive,
            isAgent: formData.isAgent,
          }
        : {
            userId: formData.userId,
            timezone: formData.timezone,
            avatar: formData.avatar,
            isActive: formData.isActive,
            isAgent: formData.isAgent,
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save agent");
      }

      await fetchAgents();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save agent");
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      userId: agent.id,
      timezone: agent.timezone,
      avatar: agent.avatar || "",
      isActive: agent.isActive,
      isAgent: agent.isAgent,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      const response = await fetch(`${API_URL}/agents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete agent");
      }

      await fetchAgents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete agent");
    }
  };

  const resetForm = () => {
    setFormData({
      userId: "",
      timezone: "Asia/Kuala_Lumpur",
      avatar: "",
      isActive: true,
      isAgent: true,
    });
    setEditingAgent(null);
    setShowForm(false);
    fetchUsers(); // Refresh users list
  };

  const timezones = [
    "Asia/Kuala_Lumpur",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Asia/Seoul",
    "Asia/Hong_Kong",
    "Asia/Shanghai",
    "Asia/Taipei",
    "Asia/Bangkok",
    "Asia/Jakarta",
    "Asia/Manila",
    "Asia/Ho_Chi_Minh",
    "Asia/Dubai",
    "Asia/Aden",
    "Asia/Riyadh",
    "Asia/Jerusalem",
    "Asia/Kolkata",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Rome",
    "Europe/Madrid",
    "Europe/Amsterdam",
    "Europe/Brussels",
    "Europe/Zurich",
    "Europe/Moscow",
    "Europe/Istanbul",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Toronto",
    "America/Vancouver",
    "America/Sao_Paulo",
    "America/Mexico_City",
    "Australia/Sydney",
    "Australia/Melbourne",
    "Australia/Brisbane",
    "Australia/Perth",
    "Pacific/Auckland",
    "UTC",
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading agents...</div>
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
          Manage Agents
        </h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-[#111] text-white rounded hover:bg-[#333] transition-colors"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Add New Agent
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2
            className="text-xl font-semibold text-[#111] mb-4"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {editingAgent ? "Edit Agent" : "Add New Agent"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!editingAgent ? (
                <div className="md:col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Select User *
                  </label>
                  {isLoadingUsers ? (
                    <div className="text-sm text-gray-500">
                      Loading users...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      No users available. All users are already agents.
                    </div>
                  ) : (
                    <select
                      value={formData.userId}
                      onChange={(e) => {
                        const selectedUser = users.find(
                          (u) => u.id === e.target.value
                        );
                        setFormData({
                          ...formData,
                          userId: e.target.value,
                          timezone: selectedUser?.timezone || formData.timezone,
                          avatar: selectedUser?.avatar || formData.avatar,
                        });
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#111]"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      <option value="">-- Select a user --</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.email} ({user.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingAgent.name}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingAgent.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    />
                  </div>
                </>
              )}

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
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-2"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Avatar URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#111]"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                  placeholder="/elements/avatar.png"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Active
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAgent"
                  checked={formData.isAgent}
                  onChange={(e) =>
                    setFormData({ ...formData, isAgent: e.target.checked })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="isAgent"
                  className="text-sm font-medium text-gray-700"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Is Agent
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#111] text-white rounded hover:bg-[#333] transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {editingAgent ? "Update" : "Create"} Agent
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {agents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p
            className="text-gray-500"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            No agents found. Create your first agent to get started.
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
                    Status
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-[#111]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {agent.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm text-gray-900"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {agent.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm text-gray-900"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {agent.timezone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          agent.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {agent.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          agent.isAgent
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {agent.isAgent ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(agent)}
                        className="text-[#111] hover:text-[#333] mr-4"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(agent.id)}
                        className="text-red-600 hover:text-red-800"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Delete
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
