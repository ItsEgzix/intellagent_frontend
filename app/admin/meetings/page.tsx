"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { Meeting, getAllMeetings } from "@/util/api/meetings";

export default function MeetingsPage() {
  const { token } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!token) return;

      try {
        const data = await getAllMeetings(token);
        setMeetings(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load meetings"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading meetings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        {error}
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
          Scheduled Meetings
        </h1>
        <div
          className="text-sm text-gray-600"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Total: {meetings.length}
        </div>
      </div>

      {meetings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p
            className="text-gray-500"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            No meetings scheduled yet.
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
                    Customer
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Customer Time
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Agent Time
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Agent
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {meetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-[#111]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {meeting.customer?.name || "N/A"}
                      </div>
                      <div
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {meeting.customer?.email || "N/A"}
                      </div>
                      <div
                        className="text-xs text-gray-400"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {meeting.customer?.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-[#111]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {meeting.customerDate} at {meeting.customerTime}
                      </div>
                      <div
                        className="text-xs text-gray-500"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {meeting.customerTimezone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {meeting.agentDate && meeting.agentTime ? (
                        <>
                          <div
                            className="text-sm font-medium text-[#111]"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            {meeting.agentDate} at {meeting.agentTime}
                          </div>
                          <div
                            className="text-xs text-gray-500"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            {meeting.agentTimezone}
                          </div>
                        </>
                      ) : (
                        <div
                          className="text-sm text-gray-400"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          No agent assigned
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {meeting.agent ? (
                        <div
                          className="text-sm text-gray-900"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {meeting.agent.name || meeting.agent.email}
                        </div>
                      ) : (
                        <div
                          className="text-sm text-gray-400"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          -
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {new Date(meeting.createdAt).toLocaleString()}
                      </div>
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
