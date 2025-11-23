/**
 * Date utility functions
 */

/**
 * Get the number of days in a month
 */
export const getDaysInMonth = (date: Date | null): number => {
  if (!date) return 0;
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

/**
 * Get the first day of the month (0 = Monday, 6 = Sunday)
 */
export const getFirstDayOfMonth = (date: Date | null): number => {
  if (!date) return 0;
  // Get day of week (0=Sunday, 1=Monday, etc.) and convert to Monday=0
  const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  // Convert Sunday (0) to 6, Monday (1) to 0, Tuesday (2) to 1, etc.
  return day === 0 ? 6 : day - 1;
};

/**
 * Format a date as YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Check if a date is selectable (not in the past and not a weekend)
 */
export const isDateSelectable = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  // Exclude weekends (Saturday = 6, Sunday = 0) and past dates
  return date >= today && dayOfWeek !== 0 && dayOfWeek !== 6;
};

/**
 * Check if a date is booked
 */
export const isDateBooked = (date: Date, bookedDates: string[]): boolean => {
  const dateStr = formatDate(date);
  return bookedDates.includes(dateStr);
};
