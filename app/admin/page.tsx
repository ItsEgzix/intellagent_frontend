"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import { Meeting, getAllMeetings } from "@/util/api/meetings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllCustomers } from "@/util/api/customers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState({
    meetings: 0,
    emails: 0,
    customers: 0,
    recentMeetings: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;

      try {
        const promises: Promise<any>[] = [
          getAllMeetings(token),
          fetch(`${API_URL}/customers`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ];

        // Only fetch emails if superadmin
        if (user?.role === "superadmin") {
          promises.push(
            fetch(`${API_URL}/emails`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          );
        }

        const [meetingsRes, customersRes, emailsRes] = await Promise.all(
          promises
        );

        const meetings = meetingsRes;
        const customers = customersRes.ok ? await customersRes.json() : [];
        const emails = emailsRes && emailsRes.ok ? await emailsRes.json() : [];

        setStats({
          meetings: meetings.length,
          emails: emails.length,
          customers: customers.length,
          recentMeetings: meetings.slice(0, 5),
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [token, user]);

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
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${
          user?.role === "superadmin" ? "lg:grid-cols-3" : ""
        } gap-6 mb-8`}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium text-muted-foreground"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Total Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold text-[#111]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {stats.meetings}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle
              className="text-sm font-medium text-muted-foreground"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold text-[#111]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {stats.customers}
            </div>
          </CardContent>
        </Card>

        {user?.role === "superadmin" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className="text-sm font-medium text-muted-foreground"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Newsletter Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="text-2xl font-bold text-[#111]"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {stats.emails}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Meetings */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-dm-sans)" }}>
            Recent Meetings
          </CardTitle>
          <CardDescription style={{ fontFamily: "var(--font-dm-sans)" }}>
            Latest scheduled appointments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentMeetings.length === 0 ? (
            <p
              className="text-muted-foreground text-sm"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              No meetings scheduled yet.
            </p>
          ) : (
            <div className="space-y-8">
              {stats.recentMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center">
                  {meeting.agent?.avatar ? (
                    <img
                      src={
                        meeting.agent.avatar.startsWith("http") ||
                        meeting.agent.avatar.startsWith("/") ||
                        meeting.agent.avatar.startsWith("data:")
                          ? meeting.agent.avatar
                          : `${API_URL}${meeting.agent.avatar}`
                      }
                      alt={meeting.agent.name || "Agent"}
                      className="h-9 w-9 rounded-full object-cover border border-border"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector(
                            ".avatar-fallback"
                          ) as HTMLElement;
                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`avatar-fallback h-9 w-9 rounded-full bg-muted flex items-center justify-center border border-border ${
                      meeting.agent?.avatar ? "hidden" : "flex"
                    }`}
                  >
                    <span
                      className="text-muted-foreground text-xs font-medium"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {(meeting.agent?.name || meeting.agent?.email || "A")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>

                  <div className="ml-4 space-y-1">
                    <p
                      className="text-sm font-medium leading-none"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {meeting.customer?.name ||
                        meeting.customer?.email ||
                        "N/A"}
                    </p>
                    <p
                      className="text-sm text-muted-foreground"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {meeting.customer?.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-right">
                    <p style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {meeting.customerDate}
                    </p>
                    <p
                      className="text-muted-foreground text-xs"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {meeting.customerTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
