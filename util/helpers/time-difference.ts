/**
 * Calculate time difference between two timezones
 * @param date - Date string in YYYY-MM-DD format
 * @param time - Time string in HH:mm format
 * @param fromTimezone - Source timezone (e.g., 'America/New_York')
 * @param toTimezone - Target timezone (e.g., 'Asia/Kuala_Lumpur')
 * @returns Formatted time difference string (e.g., "2 hours ahead" or "3 hours behind")
 */
export function calculateTimeDifference(
  date: string,
  time: string,
  fromTimezone: string,
  toTimezone: string
): string {
  try {
    if (fromTimezone === toTimezone) {
      return "Same timezone";
    }

    // Parse the input date and time
    const [hours, minutes] = time.split(":").map(Number);
    const dateTimeStr = `${date}T${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:00`;

    // Create a date object - this will be interpreted in local time
    // We need to find what UTC time this represents when it's the given time in fromTimezone
    // Then see what that UTC time is in toTimezone

    // Use a simpler approach: get the timezone offset for a specific date
    // Create a date in the fromTimezone
    const testDate = new Date(dateTimeStr);

    // Get what this same moment is in both timezones
    const fromTimeStr = testDate.toLocaleString("en-US", {
      timeZone: fromTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const toTimeStr = testDate.toLocaleString("en-US", {
      timeZone: toTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Parse the times
    const [fromH, fromM] = fromTimeStr.split(":").map(Number);
    const [toH, toM] = toTimeStr.split(":").map(Number);

    // Calculate difference
    const fromTotal = fromH * 60 + fromM;
    const toTotal = toH * 60 + toM;
    let diffMinutes = toTotal - fromTotal;

    // Handle day rollover (could be ±24 hours difference)
    if (Math.abs(diffMinutes) > 12 * 60) {
      // If difference is more than 12 hours, it might be a day boundary issue
      // Adjust by 24 hours
      if (diffMinutes > 0) {
        diffMinutes -= 24 * 60;
      } else {
        diffMinutes += 24 * 60;
      }
    }

    if (diffMinutes === 0) {
      return "Same timezone";
    }

    // Calculate hours and minutes
    const diffHours = Math.floor(Math.abs(diffMinutes) / 60);
    const diffMins = Math.abs(diffMinutes) % 60;

    // Determine direction
    const direction = diffMinutes > 0 ? "ahead" : "behind";

    // Format output
    const parts: string[] = [];
    if (diffHours > 0) {
      parts.push(`${diffHours} hour${diffHours > 1 ? "s" : ""}`);
    }
    if (diffMins > 0) {
      parts.push(`${diffMins} minute${diffMins > 1 ? "s" : ""}`);
    }

    if (parts.length === 0) {
      return "Same time";
    }

    return `${parts.join(" and ")} ${direction}`;
  } catch (error) {
    console.error("Error calculating time difference:", error);
    return "";
  }
}
