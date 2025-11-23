"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { Meeting, getAllMeetings } from "@/util/api/meetings";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    meetings: 0,
    emails: 0,
    recentMeetings: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const [meetings, emailsRes] = await Promise.all([
          getAllMeetings(token),
          fetch(`${API_URL}/emails`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const emails = emailsRes.ok ? await emailsRes.json() : [];

        setStats({
          meetings: meetings.length,
          emails: emails.length,
          recentMeetings: meetings.slice(0, 5),
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-3xl font-bold text-[#111] mb-8"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3
            className="text-lg font-semibold text-gray-600 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Total Meetings
          </h3>
          <p
            className="text-4xl font-bold text-[#111]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {stats.meetings}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3
            className="text-lg font-semibold text-gray-600 mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Newsletter Subscribers
          </h3>
          <p
            className="text-4xl font-bold text-[#111]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {stats.emails}
          </p>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2
            className="text-xl font-semibold text-[#111]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Recent Meetings
          </h2>
        </div>
        <div className="p-6">
          {stats.recentMeetings.length === 0 ? (
            <p
              className="text-gray-500"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              No meetings scheduled yet.
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      {meeting.agent?.avatar && (
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={`${API_URL}${meeting.agent.avatar}`}
                            alt={meeting.agent.name || "Agent"}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                            unoptimized={true}
                          />
                        </div>
                      )}
                      <div>
                        <p
                          className="font-semibold text-[#111]"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {meeting.customer?.name ||
                            meeting.customer?.email ||
                            "N/A"}
                        </p>
                        <p
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          Customer: {meeting.customerDate} at{" "}
                          {meeting.customerTime} ({meeting.customerTimezone})
                        </p>
                        {meeting.agentDate && meeting.agentTime && (
                          <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            Agent: {meeting.agentDate} at {meeting.agentTime} (
                            {meeting.agentTimezone})
                          </p>
                        )}
                        <p
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          Email: {meeting.customer?.email || "N/A"} | Phone:{" "}
                          {meeting.customer?.phone || "N/A"}
                        </p>
                        {meeting.agent && (
                          <p
                            className="text-sm text-gray-500"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            Agent: {meeting.agent.name || meeting.agent.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className="text-xs text-gray-500"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {new Date(meeting.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
