"use client";

import Link from "next/link";
import { useI18n } from "../../contexts/i18n-context";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  getAvailableTimeSlots as getAvailableTimeSlotsAPI,
  getActiveAgents,
} from "@/util/api/agents";
import { getAllMeetings, createMeeting } from "@/util/api/meetings";
import { subscribeToNewsletter } from "@/util/api/emails";
import { formatDate } from "@/util/helpers/date";
import { getAvailableTimeSlots, sortTimeSlots } from "@/util/helpers/timezone";
import { timezones } from "@/util/helpers/timezones";
import AgentSelector from "./components/agent-selector";
import MeetingCalendar from "./components/meeting-calendar";
import SocialLoop from "./components/social-loop";
import {
  MeetingAutomationData,
  useAutomation,
} from "../../contexts/automation-context";
import { showToast } from "@/components/ui/toast";

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function Footer() {
  const { t } = useI18n();
  const {
    automationData,
    clearAutomation,
    registerAutomationTarget,
    automationStage,
    automationError,
  } = useAutomation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Meeting scheduling states
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kuala_Lumpur");
  const [customerName, setCustomerName] = useState("");
  const [meetingEmail, setMeetingEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [meetingMessage, setMeetingMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const footerSectionRef = useRef<HTMLElement | null>(null);
  const meetingFormRef = useRef<HTMLFormElement | null>(null);
  const timeSlotsRef = useRef<string[]>([]);
  const selectedAgentRef = useRef<any | null>(null);
  const selectedDateRef = useRef<Date | null>(null);
  const selectedTimeRef = useRef<string>("");
  const agentsCacheRef = useRef<any[] | null>(null);
  const automationClearTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const automationStatusMessage = useMemo(() => {
    switch (automationStage) {
      case "pending":
        return "Give me a moment while I get the booking assistant ready.";
      case "scrolling":
        return "Guiding you to the booking assistant…";
      case "filling":
        return "Auto-filling the form with the details you provided.";
      case "submitting":
        return "Submitting the booking request on your behalf.";
      case "completed":
        return "All set! Review the confirmation below.";
      case "error":
        return (
          automationError ||
          "The automation was interrupted. You can finish the form manually."
        );
      default:
        return null;
    }
  }, [automationStage, automationError]);

  // Fetch scheduled meetings for the selected agent
  useEffect(() => {
    const fetchMeetings = async () => {
      if (selectedAgent?.id) {
        setIsLoadingMeetings(true);
        try {
          const allMeetings = await getAllMeetings();
          // Filter meetings for the selected agent
          const agentMeetings = allMeetings.filter(
            (meeting: any) => meeting.agentId === selectedAgent.id
          );
          // Extract agent dates from agent's meetings (in agent's timezone)
          // Only include meetings that have an agentDate (assigned to an agent)
          const dates: string[] = agentMeetings
            .map((meeting: any) => meeting.agentDate)
            .filter((date: string | null | undefined) => date != null);
          // Remove duplicates
          setBookedDates([...new Set(dates)]);
        } catch (error) {
          console.error("Failed to fetch meetings:", error);
          // If fetch fails (network error, CORS, etc.), clear booked dates
          setBookedDates([]);
        } finally {
          setIsLoadingMeetings(false);
        }
      } else {
        // If no agent selected, clear booked dates
        setBookedDates([]);
      }
    };

    fetchMeetings();
  }, [selectedAgent]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await subscribeToNewsletter(email);
      setMessage({
        type: "success",
        text: "Thank you for subscribing, check your email",
      });
      setEmail("");
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTime("");
  }, []);

  const handleAgentSelect = useCallback((agent: any | null) => {
    setSelectedAgent(agent);
    // Reset steps if changing agent
    setSelectedDate(null);
    setSelectedTime("");
    setTimeSlots([]);
  }, []);

  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    timeSlotsRef.current = timeSlots;
  }, [timeSlots]);

  useEffect(() => {
    selectedAgentRef.current = selectedAgent;
  }, [selectedAgent]);

  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  useEffect(() => {
    selectedTimeRef.current = selectedTime;
  }, [selectedTime]);

  // Automation helpers will register via context below
  const automationScrollIntoView = useCallback(async () => {
    console.log("DEBUG: automationScrollIntoView called");
    if (!footerSectionRef.current) {
      footerSectionRef.current = document.getElementById("contact");
    }
    console.log("DEBUG: footerSectionRef.current:", footerSectionRef.current);
    footerSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    // Human-like delay: wait for scroll to complete, then pause
    await wait(1500);
  }, []);

  const ensureAgentSelected = useCallback(
    async (data: MeetingAutomationData) => {
      console.log("DEBUG: ensureAgentSelected called with", data);
      if (!data.agentId && !data.agentName) return;

      if (!agentsCacheRef.current) {
        agentsCacheRef.current = await getActiveAgents();
      }

      const agent =
        agentsCacheRef.current?.find(
          (a) =>
            a.id === data.agentId ||
            a.name?.toLowerCase() === data.agentName?.toLowerCase()
        ) ?? null;

      console.log("DEBUG: Found agent:", agent);
      if (agent) {
        handleAgentSelect(agent);
        // Human-like delay: pause after selecting agent
        await wait(1200);
      }
    },
    [handleAgentSelect]
  );

  const ensureTimeSlotSelected = useCallback(async (targetTime?: string) => {
    if (!targetTime) return;
    const normalized = targetTime.slice(0, 5);

    // Human-like delay: wait for time slots to load (with patience)
    for (let attempt = 0; attempt < 20; attempt++) {
      const slots = timeSlotsRef.current;
      if (slots.length > 0) {
        // Human-like delay: pause before selecting time slot
        await wait(600);
        const match =
          slots.find((slot) => slot.includes(normalized)) ?? slots[0];
        setSelectedTime(match);
        return;
      }
      await wait(400);
    }
  }, []);

  // Typing animation helper - types text character by character
  const typeText = useCallback(
    async (
      text: string,
      setter: (value: string) => void,
      speed: number = 50
    ) => {
      for (let i = 0; i <= text.length; i++) {
        setter(text.slice(0, i));
        await wait(speed + Math.random() * 30); // Randomize speed slightly for human-like feel
      }
    },
    []
  );

  const fillMeetingForm = useCallback(
    async (data: MeetingAutomationData) => {
      console.log("DEBUG: fillMeetingForm called with", data);
      await ensureAgentSelected(data);

      // Human-like delay: pause before filling timezone
      await wait(800);
      if (data.timezone) {
        setTimezone(data.timezone);
        await wait(600);
      }

      // Human-like delay: pause before selecting date
      await wait(800);
      if (data.date) {
        const parsedDate = new Date(`${data.date}T12:00:00`);
        if (!isNaN(parsedDate.getTime())) {
          handleDateSelect(parsedDate);
          // Wait for calendar to update and time slots to load
          await wait(1500);
        }
      }

      // Human-like delay: pause before selecting time
      await wait(800);
      await ensureTimeSlotSelected(data.time);
      await wait(1000);

      // Human-like delay: pause before filling contact info with typing animation
      await wait(600);
      if (data.customerName) {
        await typeText(data.customerName, setCustomerName, 60);
        await wait(500);
      }
      if (data.email) {
        await typeText(data.email, setMeetingEmail, 50);
        await wait(500);
      }
      if (data.phone) {
        await typeText(data.phone, setPhone, 60);
        await wait(500);
      }

      // Final pause to let user see everything is filled
      await wait(1000);
    },
    [ensureAgentSelected, ensureTimeSlotSelected, handleDateSelect, typeText]
  );

  const submitAutomationForm = useCallback(async () => {
    const formElement = meetingFormRef.current;
    if (!formElement) return;

    if (typeof formElement.requestSubmit === "function") {
      formElement.requestSubmit();
    } else {
      formElement.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
    await wait(400);
  }, []);

  useEffect(() => {
    // Register automation target with auto-submit enabled
    const unregister = registerAutomationTarget({
      scrollIntoView: automationScrollIntoView,
      fillForm: fillMeetingForm,
      submitForm: submitAutomationForm,
    });

    return () => {
      unregister();
    };
  }, [
    registerAutomationTarget,
    automationScrollIntoView,
    fillMeetingForm,
    submitAutomationForm,
  ]);

  useEffect(() => {
    if (automationStage === "error" && automationError) {
      showToast(`Automation failed: ${automationError}`, "error", 5000);
    }

    if (automationStage !== "completed") {
      if (automationClearTimeoutRef.current) {
        clearTimeout(automationClearTimeoutRef.current);
        automationClearTimeoutRef.current = null;
      }
      return;
    }

    automationClearTimeoutRef.current = setTimeout(() => {
      clearAutomation();
    }, 4000);

    return () => {
      if (automationClearTimeoutRef.current) {
        clearTimeout(automationClearTimeoutRef.current);
        automationClearTimeoutRef.current = null;
      }
    };
  }, [automationStage, automationError, clearAutomation]);

  // Fetch available time slots from backend (already filtered for existing meetings)
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedAgent?.id && selectedAgent?.timezone && selectedDate) {
        setIsLoadingAvailability(true);

        try {
          const dateStr = formatDate(selectedDate);

          // Fetch available slots from backend - these are already filtered
          // to exclude existing meetings
          const availableSlots = await getAvailableTimeSlotsAPI(
            selectedAgent.id,
            dateStr,
            timezone
          );

          // Backend returns slots in customer's timezone, so no conversion needed
          // Sort slots by time
          setTimeSlots(sortTimeSlots(availableSlots));
        } catch (error) {
          console.error("Failed to fetch available slots:", error);
          // Fallback to frontend calculation
          const allSlots = getAvailableTimeSlots(
            selectedAgent.timezone,
            timezone,
            selectedDate
          );
          setTimeSlots(allSlots);
        } finally {
          setIsLoadingAvailability(false);
        }
      } else if (selectedAgent?.timezone) {
        // If no date selected, use frontend calculation
        setTimeSlots(
          getAvailableTimeSlots(
            selectedAgent.timezone,
            timezone,
            selectedDate || undefined
          )
        );
      } else {
        setTimeSlots([]);
      }
    };

    fetchAvailableSlots();
  }, [selectedAgent, timezone, selectedDate]);

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedAgent ||
      !selectedDate ||
      !selectedTime ||
      !customerName ||
      !meetingEmail ||
      !phone
    ) {
      setMeetingMessage({
        type: "error",
        text: "Please fill in all fields",
      });
      return;
    }

    setIsScheduling(true);
    setMeetingMessage(null);

    try {
      await createMeeting({
        customerName: customerName,
        date: formatDate(selectedDate),
        time: selectedTime,
        timezone: timezone,
        email: meetingEmail,
        phone: phone,
        agentId: selectedAgent?.id,
      });

      const successMessage = `Meeting scheduled successfully with ${
        selectedAgent?.name || "agent"
      } on ${formatDate(
        selectedDate
      )} at ${selectedTime}! Check your email for confirmation.`;

      setMeetingMessage({
        type: "success",
        text: "Meeting scheduled successfully! Check your email for confirmation.",
      });

      // Show toast notification
      showToast(successMessage, "success", 6000);

      // Add the new meeting date to booked dates for this agent
      const newDate = formatDate(selectedDate);
      setBookedDates((prev) => {
        if (!prev.includes(newDate)) {
          return [...prev, newDate];
        }
        return prev;
      });

      // Reset form
      setSelectedAgent(null);
      setSelectedDate(null);
      setSelectedTime("");
      setCustomerName("");
      setMeetingEmail("");
      setPhone("");
    } catch (error) {
      setMeetingMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <footer
      id="contact"
      ref={(node) => {
        footerSectionRef.current = node;
      }}
      className="w-full bg-[#111] text-white pt-20 pb-10 overflow-hidden"
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 mb-20">
          {/* Left Column */}
          <div className="flex flex-col items-start">
            {/* Logo */}
            <h1
              className="text-[50px] md:text-[60px] lg:text-[80px] xl:text-[100px] font-bold text-white/80 mb-12 tracking-tight"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              INTELLAGENT
            </h1>

            <p
              className="text-[32px] md:text-[40px] lg:text-[48px] leading-tight text-white/70 mb-10 max-w-2xl"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {t.footer.slogan}
            </p>

            <button
              className="border border-white/50 rounded-full px-8 py-3 text-lg hover:bg-white hover:text-black transition-colors mb-8"
              style={{ fontFamily: "var(--font-dm-sans)" }}
              suppressHydrationWarning
            >
              {t.footer.tryServices}
            </button>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col gap-3 w-full max-w-md"
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="flex-1 bg-transparent border border-white/50 rounded-full px-6 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                  suppressHydrationWarning
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="border border-white/50 rounded-full px-6 py-3 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                  suppressHydrationWarning
                >
                  {isLoading ? "..." : "Subscribe"}
                </button>
              </div>
              {message && (
                <p
                  className={`text-sm ${
                    message.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {message.text}
                </p>
              )}
            </form>
          </div>

          {/* Right Column - Calendar Scheduling */}
          <div className="w-full">
            <div className="bg-white shadow-lg p-6">
              <div className="text-center mb-6">
                <AgentSelector
                  selectedAgent={selectedAgent}
                  onAgentSelect={handleAgentSelect}
                  onTimezoneChange={setTimezone}
                />

                <h2
                  className="text-2xl font-bold text-[#111] mb-2"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Schedule a Meeting
                </h2>
                <div className="flex items-center justify-center gap-4 text-gray-600 text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8 5v3l2 2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    30 min
                  </span>
                </div>
              </div>

              <form
                ref={meetingFormRef}
                onSubmit={handleMeetingSubmit}
                className="space-y-4"
              >
                {automationStatusMessage && (
                  <div className="rounded-md border border-dashed border-[#111]/20 bg-gray-50 p-3 text-sm text-gray-700">
                    <p style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {automationStatusMessage}
                    </p>
                    {automationStage === "completed" && automationData && (
                      <p
                        className="text-xs text-gray-500 mt-1"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Filled for {automationData.customerName}. You can make
                        any changes before confirming.
                      </p>
                    )}
                  </div>
                )}

                {/* Step 1: Agent Selection (Handled above) */}
                {!selectedAgent && (
                  <div className="text-center text-gray-500 text-sm py-4">
                    Please select an agent above to continue
                  </div>
                )}

                {/* Step 2: Timezone Selection */}
                {selectedAgent && !selectedDate && (
                  <div className="mb-4">
                    <label
                      className="block text-xs font-medium text-gray-700 mb-2"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Select your time zone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-[#111] bg-white text-[#111] focus:outline-none focus:border-[#111] transition-colors"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Step 3: Calendar */}
                {!selectedDate && (
                  <div>
                    <h3
                      className="text-sm font-semibold text-[#111] mb-3"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Select a Date
                    </h3>
                    <MeetingCalendar
                      selectedDate={selectedDate}
                      bookedDates={bookedDates}
                      onDateSelect={handleDateSelect}
                    />
                  </div>
                )}

                {/* Step 3: Time Selection */}
                {selectedDate && !selectedTime && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="text-sm font-semibold text-[#111]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Select Time
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate(null);
                          setSelectedTime("");
                        }}
                        className="text-xs text-[#111] hover:text-[#333]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Change date
                      </button>
                    </div>
                    <div className="mb-4 p-3 bg-gray-50">
                      <p
                        className="text-xs text-gray-600 mb-1"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Selected date:
                      </p>
                      <p
                        className="text-sm font-medium text-[#111]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {isLoadingAvailability ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Loading available times...
                      </div>
                    ) : timeSlots.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        No available time slots for this date. The agent may be
                        fully booked or unavailable.
                      </div>
                    ) : (
                      <div>
                        <p
                          className="text-xs text-gray-600 mb-3"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          Available times in your timezone (
                          {timezones.find((t) => t.value === timezone)?.label ||
                            timezone}
                          ):
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`px-3 py-2 border text-sm font-medium transition-colors ${
                                selectedTime === time
                                  ? "bg-[#111] text-white border-[#111]"
                                  : "bg-white text-[#111] border-[#111] hover:bg-[#111] hover:text-white"
                              }`}
                              style={{ fontFamily: "var(--font-dm-sans)" }}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 5: Contact Information */}
                {selectedAgent && selectedDate && selectedTime && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3
                        className="text-sm font-semibold text-[#111]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Enter Details
                      </h3>
                      <button
                        type="button"
                        onClick={() => setSelectedTime("")}
                        className="text-xs text-[#111] hover:text-[#333]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Change time
                      </button>
                    </div>

                    {/* Selected Date & Time Summary */}
                    <div className="mb-4 p-3 bg-gray-50">
                      <p
                        className="text-xs text-gray-600 mb-1"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Selected:
                      </p>
                      <p
                        className="text-sm font-medium text-[#111]"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {selectedDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at {selectedTime}
                      </p>
                    </div>

                    {/* Timezone Display (ReadOnly) */}
                    <div className="mb-4">
                      <label
                        className="block text-xs font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        Time zone
                      </label>
                      <div
                        className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-600"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {timezones.find((t) => t.value === timezone)?.label ||
                          timezone}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3">
                      <div>
                        <label
                          className="block text-xs font-medium text-gray-700 mb-1"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          required
                          className="w-full px-3 py-2 text-sm border border-[#111] bg-white text-[#111] focus:outline-none focus:border-[#111] transition-colors"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium text-gray-700 mb-1"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          value={meetingEmail}
                          onChange={(e) => setMeetingEmail(e.target.value)}
                          required
                          className="w-full px-3 py-2 text-sm border border-[#111] bg-white text-[#111] focus:outline-none focus:border-[#111] transition-colors"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-medium text-gray-700 mb-1"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full px-3 py-2 text-sm border border-[#111] bg-white text-[#111] focus:outline-none focus:border-[#111] transition-colors"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                          placeholder="+1234567890"
                        />
                      </div>
                    </div>

                    {meetingMessage && (
                      <div
                        className={`p-2 text-xs mt-4 ${
                          meetingMessage.type === "success"
                            ? "bg-green-50 text-green-800"
                            : "bg-red-50 text-red-800"
                        }`}
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {meetingMessage.text}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isScheduling}
                      className="w-full bg-[#111] text-white py-2.5 px-4 text-sm font-semibold hover:bg-[#333] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mt-4"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {isScheduling ? "Scheduling..." : "Schedule Meeting"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Stay In Touch & Loop */}
        <div className="flex flex-col items-center mt-20">
          <p
            className="text-white/50 uppercase tracking-widest text-sm mb-8"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {t.footer.stayInTouch}
          </p>

          <SocialLoop
            speed={50}
            direction="left"
            logoHeight={150}
            gap={100}
            hoverSpeed={0}
            scaleOnHover={false}
          />
        </div>
      </div>
    </footer>
  );
}
