/**
 * Timezone utility functions
 */

/**
 * Convert time from agent timezone to customer timezone
 */
export const convertTimeToCustomerTimezone = (
  time: string,
  date: Date,
  agentTimezone: string,
  customerTimezone: string
): string => {
  try {
    // Parse the time (HH:mm format)
    const [hour, minute] = time.split(":").map(Number);

    // Get the date components in agent timezone
    const agentDateStr = date.toLocaleString("en-US", {
      timeZone: agentTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const [agentMonth, agentDay, agentYear] = agentDateStr.split("/");

    // Create an ISO string for the date and time
    const isoStr = `${agentYear}-${agentMonth.padStart(
      2,
      "0"
    )}-${agentDay.padStart(2, "0")}T${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}:00`;

    // Create a date object - this will be interpreted as local time
    // We need to find the UTC moment that corresponds to this time in agent timezone
    // Then format that moment in customer timezone

    // Use a workaround: create a date and use Intl to format
    // We'll create a date that, when formatted in agent timezone, gives us the desired time
    // Then format that same moment in customer timezone

    // Create a date object (this is tricky because Date doesn't support timezone in constructor)
    // We'll use the fact that we can format a date in agent timezone and customer timezone
    // to find the equivalent time

    // Simpler approach: create a date and adjust
    // Since we can't directly create a date in a specific timezone, we'll use a workaround
    const tempDate = new Date(isoStr);

    // Get the time in customer timezone by formatting the date
    // But first, we need to adjust for the timezone difference
    // Actually, let's use a different approach: format the date in both timezones

    // Get what time it is in agent timezone for this date
    const agentTimeStr = tempDate.toLocaleTimeString("en-US", {
      timeZone: agentTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Calculate the difference
    const [agentHour, agentMin] = agentTimeStr.split(":").map(Number);
    const targetHour = hour;
    const targetMin = minute;

    // Calculate offset in minutes
    const targetMinutes = targetHour * 60 + targetMin;
    const agentMinutes = agentHour * 60 + agentMin;
    const offsetMinutes = targetMinutes - agentMinutes;

    // Adjust the date
    const adjustedDate = new Date(
      tempDate.getTime() + offsetMinutes * 60 * 1000
    );

    // Format in customer timezone
    const customerTime = adjustedDate.toLocaleTimeString("en-US", {
      timeZone: customerTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return customerTime;
  } catch (e) {
    console.error("Error converting time:", e);
    return time;
  }
};

/**
 * Get available time slots based on agent's working hours
 * Uses agent's timezone for working hours (9 AM to 5 PM)
 */
export const getAvailableTimeSlots = (
  agentTimezone: string,
  customerTimezone: string,
  selectedDate?: Date
): string[] => {
  const slots: string[] = [];

  // Use selected date or today for calculation
  const dateToUse = selectedDate || new Date();
  const year = dateToUse.getFullYear();
  const month = dateToUse.getMonth();
  const day = dateToUse.getDate();

  // Loop from 9 to 17 (5 PM) - these are working hours in agent's timezone
  for (let hour = 9; hour <= 17; hour++) {
    if (hour === 14) continue; // Skip 14:00 (2 PM) lunch break

    try {
      // Create a date string representing the hour in agent's timezone
      // We need to construct a date that represents "hour:00" in agent's timezone
      // Then convert it to customer's timezone

      // Get date components in agent's timezone
      const agentDateStr = dateToUse.toLocaleString("en-US", {
        timeZone: agentTimezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      // Parse the date string (format: MM/DD/YYYY)
      const [monthStr, dayStr, yearStr] = agentDateStr.split("/");

      // Create ISO string for the specific hour in agent's timezone
      const hourStr = String(hour).padStart(2, "0");
      const isoDateStr = `${yearStr}-${monthStr.padStart(
        2,
        "0"
      )}-${dayStr.padStart(2, "0")}T${hourStr}:00:00`;

      // Create date object
      const dateForHour = new Date(isoDateStr);

      // Format in customer timezone
      const timeString = dateForHour.toLocaleTimeString("en-US", {
        timeZone: customerTimezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      slots.push(timeString);
    } catch (e) {
      console.error("Error calculating time slot:", e);
    }
  }
  return slots;
};

/**
 * Sort time slots by time
 */
export const sortTimeSlots = (slots: string[]): string[] => {
  return [...slots].sort((a: string, b: string) => {
    const [aHour, aMin] = a.split(":").map(Number);
    const [bHour, bMin] = b.split(":").map(Number);
    return aHour * 60 + aMin - (bHour * 60 + bMin);
  });
};
