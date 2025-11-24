import en from "../messages/en.json";
import zh from "../messages/zh.json";
import ms from "../messages/ms.json";
import { getAvailableLocales } from "./language-registry";

// Check if we're in development mode (client-side check)
const isDevelopment =
  typeof window !== "undefined"
    ? window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    : process.env.NODE_ENV === "development";

// Base type for known languages (for type safety)
type KnownLocale = "en" | "zh" | "ms";

// Extended type to support dynamically added languages
export type Locale = KnownLocale | string;

// Dynamic locales array from registry - computed on each access
export function getLocales(): string[] {
  return getAvailableLocales();
}

// Messages object - keep static imports for type safety
export const messages: Record<string, typeof en> = {
  en,
  zh,
  ms,
  // New languages will be added dynamically
} as const;

// Cache for dynamically loaded messages
const messageCache: Record<string, typeof en> = { ...messages };

// Clear the message cache (useful for development)
export function clearMessageCache(locale?: string) {
  if (locale) {
    delete messageCache[locale];
  } else {
    // Clear all except static imports
    Object.keys(messageCache).forEach((key) => {
      if (!messages[key as KnownLocale]) {
        delete messageCache[key];
      }
    });
  }
}

// Dynamically load a language file
export async function loadLanguage(
  locale: string,
  forceReload: boolean = false
): Promise<typeof en | null> {
  // If already cached and not forcing reload, return it
  if (messageCache[locale] && !forceReload) {
    return messageCache[locale];
  }

  // Clear cache if forcing reload
  if (forceReload) {
    delete messageCache[locale];
  }

  // If it's one of the static imports, return it
  if (messages[locale]) {
    messageCache[locale] = messages[locale];
    return messages[locale];
  }

  try {
    // Fetch the language file from API route with cache-busting in development
    const shouldBustCache = forceReload || isDevelopment;
    const cacheBuster = shouldBustCache ? `?t=${Date.now()}` : "";
    const response = await fetch(`/api/languages/${locale}${cacheBuster}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${locale}.json: ${response.statusText}`);
    }
    const data = await response.json();
    messageCache[locale] = data;
    return data;
  } catch (error) {
    console.warn(`Failed to load language file for ${locale}:`, error);
    return null;
  }
}

export function getTranslations(locale: Locale) {
  // Return the translation if available, fallback to English
  return messageCache[locale] || messages.en;
}
