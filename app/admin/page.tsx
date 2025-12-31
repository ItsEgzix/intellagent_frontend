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
import { calculateTimeDifference } from "@/util/helpers/time-difference";
import { timezoneToLocation } from "@/util/helpers/timezone-location";
import { MapPin } from "lucide-react";
import Image from "next/image";

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
            <div className="space-y-6">
              {stats.recentMeetings.map((meeting) => {
                // Calculate time difference if both timezones are available
                const timeDiff =
                  meeting.customerTimezone && meeting.agent?.timezone
                    ? calculateTimeDifference(
                        meeting.customerDate,
                        meeting.customerTime,
                        meeting.customerTimezone,
                        meeting.agent.timezone
                      )
                    : null;

                // Get client initial
                const clientInitial = (
                  meeting.customer?.name ||
                  meeting.customer?.email ||
                  "C"
                )
                  .charAt(0)
                  .toUpperCase();

                return (
                  <div
                    key={meeting.id}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {/* Client Avatar */}
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shrink-0">
                      <span
                        className="text-primary font-semibold text-lg"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {clientInitial}
                      </span>
                    </div>

                    {/* Agent Avatar */}
                    <div className="relative h-12 w-12 rounded-full border-2 border-border shrink-0">
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
                          className="h-full w-full rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = parent.querySelector(
                                ".agent-avatar-fallback"
                              ) as HTMLElement;
                              if (fallback) {
                                fallback.style.display = "flex";
                              }
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className={`agent-avatar-fallback h-full w-full rounded-full bg-muted flex items-center justify-center ${
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
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          {/* Agent Name */}
                          <p
                            className="text-sm font-semibold leading-tight mb-1"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            {meeting.agent?.name || "Agent N/A"}
                          </p>

                          {/* Agent Location */}
                          {meeting.agent?.timezone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground leading-tight mb-1">
                              <MapPin className="h-3 w-3" />
                              <span
                                style={{ fontFamily: "var(--font-dm-sans)" }}
                              >
                                {timezoneToLocation(meeting.agent.timezone)}
                              </span>
                            </div>
                          )}

                          {/* Client Name */}
                          <p
                            className="text-sm text-muted-foreground leading-tight mt-2 mb-1"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            Client: {meeting.customer?.name || "N/A"}
                          </p>

                          {/* Client Location */}
                          {meeting.customerTimezone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground leading-tight">
                              <MapPin className="h-3 w-3" />
                              <span
                                style={{ fontFamily: "var(--font-dm-sans)" }}
                              >
                                {timezoneToLocation(meeting.customerTimezone)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p
                            className="text-sm font-medium"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            {meeting.customerDate}
                          </p>
                          <p
                            className="text-xs text-muted-foreground"
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            {meeting.customerTime}
                          </p>
                        </div>
                      </div>
                      {timeDiff && (
                        <p
                          className="text-xs text-muted-foreground mt-1"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          Time difference: {timeDiff}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
