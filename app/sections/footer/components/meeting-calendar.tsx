"use client";

import { useState, useEffect } from "react";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatDate,
  isDateSelectable,
  isDateBooked,
} from "@/util/helpers/date";

interface MeetingCalendarProps {
  selectedDate: Date | null;
  bookedDates: string[];
  onDateSelect: (date: Date) => void;
}

export default function MeetingCalendar({
  selectedDate,
  bookedDates,
  onDateSelect,
}: MeetingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize currentMonth after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setCurrentMonth(new Date());
  }, []);

  const handleDateSelect = (day: number) => {
    if (!currentMonth) return;
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    if (isDateSelectable(date) && !isDateBooked(date, bookedDates)) {
      onDateSelect(date);
    }
  };

  const handlePrevMonth = () => {
    if (!currentMonth) return;
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    if (!currentMonth) return;
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  if (!currentMonth || !mounted) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        Loading calendar...
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const isSelectable = isDateSelectable(date);
    const isBooked = isDateBooked(date, bookedDates);
    const isSelected =
      selectedDate && date.toDateString() === selectedDate.toDateString();
    days.push({ day, date, isSelectable, isSelected, isBooked });
  }

  // Generate years (current year ± 2 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-between mb-4 gap-2">
        <button
          onClick={handlePrevMonth}
          className="p-2 bg-[#111] text-white hover:bg-[#333] shrink-0 transition-colors"
          type="button"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex items-center gap-2 flex-1 justify-center">
          <select
            value={currentMonth?.getMonth() ?? 0}
            onChange={(e) => {
              if (!currentMonth) return;
              const newMonth = parseInt(e.target.value);
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), newMonth, 1)
              );
            }}
            className="px-2 py-1 text-sm font-semibold text-white bg-[#111] border border-[#111] focus:outline-none focus:border-white transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
            disabled={!currentMonth}
          >
            {monthNames.map((month, index) => (
              <option
                key={index}
                value={index}
                className="bg-white text-[#111]"
              >
                {month}
              </option>
            ))}
          </select>

          <select
            value={currentMonth?.getFullYear() ?? new Date().getFullYear()}
            onChange={(e) => {
              if (!currentMonth) return;
              const newYear = parseInt(e.target.value);
              setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1));
            }}
            className="px-2 py-1 text-sm font-semibold text-white bg-[#111] border border-[#111] focus:outline-none focus:border-white transition-colors"
            style={{ fontFamily: "var(--font-dm-sans)" }}
            disabled={!currentMonth}
          >
            {years.map((year) => (
              <option key={year} value={year} className="bg-white text-[#111]">
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 bg-[#111] text-white hover:bg-[#333] shrink-0 transition-colors"
          type="button"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-[#111] py-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((dayData, index) => {
          if (dayData === null) {
            return <div key={index} className="aspect-square" />;
          }

          const { day, date, isSelectable, isSelected, isBooked } = dayData;
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <button
              key={index}
              onClick={() => handleDateSelect(day)}
              disabled={!isSelectable || isBooked}
              type="button"
              className={`aspect-square text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                isSelected || isBooked
                  ? "rounded-full"
                  : isSelectable
                  ? "rounded-none hover:rounded-full"
                  : "rounded-none"
              } ${
                isSelected
                  ? "bg-[#111] text-white"
                  : isBooked
                  ? "bg-red-100 text-red-600 cursor-not-allowed rounded-full"
                  : isWeekend
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isSelectable
                  ? "hover:bg-gray-100 text-[#111]"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
              title={
                isBooked
                  ? "Already booked"
                  : isWeekend
                  ? "Weekend - not available"
                  : ""
              }
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
