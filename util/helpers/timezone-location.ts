/**
 * Convert timezone string to a readable location name
 * @param timezone - IANA timezone string (e.g., 'America/New_York', 'Asia/Kuala_Lumpur')
 * @returns Formatted location string (e.g., "New York, USA" or "Kuala Lumpur, Malaysia")
 */
export function timezoneToLocation(timezone: string): string {
  if (!timezone) return "";

  // Common timezone to location mappings
  const timezoneMap: Record<string, string> = {
    // Asia
    "Asia/Kuala_Lumpur": "Kuala Lumpur, Malaysia",
    "Asia/Singapore": "Singapore",
    "Asia/Tokyo": "Tokyo, Japan",
    "Asia/Shanghai": "Shanghai, China",
    "Asia/Hong_Kong": "Hong Kong",
    "Asia/Seoul": "Seoul, South Korea",
    "Asia/Bangkok": "Bangkok, Thailand",
    "Asia/Jakarta": "Jakarta, Indonesia",
    "Asia/Manila": "Manila, Philippines",
    "Asia/Dubai": "Dubai, UAE",
    "Asia/Kolkata": "Mumbai, India",
    "Asia/Dhaka": "Dhaka, Bangladesh",

    // America
    "America/New_York": "New York, USA",
    "America/Chicago": "Chicago, USA",
    "America/Denver": "Denver, USA",
    "America/Los_Angeles": "Los Angeles, USA",
    "America/Toronto": "Toronto, Canada",
    "America/Vancouver": "Vancouver, Canada",
    "America/Mexico_City": "Mexico City, Mexico",
    "America/Sao_Paulo": "São Paulo, Brazil",
    "America/Buenos_Aires": "Buenos Aires, Argentina",

    // Europe
    "Europe/London": "London, UK",
    "Europe/Paris": "Paris, France",
    "Europe/Berlin": "Berlin, Germany",
    "Europe/Rome": "Rome, Italy",
    "Europe/Madrid": "Madrid, Spain",
    "Europe/Amsterdam": "Amsterdam, Netherlands",
    "Europe/Stockholm": "Stockholm, Sweden",
    "Europe/Moscow": "Moscow, Russia",

    // Oceania
    "Australia/Sydney": "Sydney, Australia",
    "Australia/Melbourne": "Melbourne, Australia",
    "Pacific/Auckland": "Auckland, New Zealand",
  };

  // Check if we have a direct mapping
  if (timezoneMap[timezone]) {
    return timezoneMap[timezone];
  }

  // Try to extract location from timezone string format: Continent/City
  const parts = timezone.split("/");
  if (parts.length >= 2) {
    const city = parts[parts.length - 1].replace(/_/g, " ");
    const continent = parts[0];

    // Format city name (capitalize words)
    const formattedCity = city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return formattedCity;
  }

  // Fallback: return the timezone as-is
  return timezone;
}
