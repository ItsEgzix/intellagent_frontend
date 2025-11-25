import enFallback from "../messages/en.json";

// Fallback English translations - used while loading from database
const fallbackMessages = enFallback as Record<string, any>;

export type Messages = typeof enFallback;
export type Locale = string;

export interface LanguageOption {
  code: Locale;
  nativeName: string;
  englishName: string;
}

// Cache for language options fetched from database
let cachedLanguageOptions: LanguageOption[] | null = null;

// Fetch available languages from database and map with display names
export async function fetchLanguageOptions(
  forceRefresh: boolean = false
): Promise<LanguageOption[]> {
  if (cachedLanguageOptions && !forceRefresh) {
    return cachedLanguageOptions;
  }

  try {
    const response = await fetch("/api/translations", {
      cache: "no-store",
    });

    if (!response.ok) {
      // If API fails, only return English (never fallback to all file options)
      console.warn(
        "Failed to fetch languages from database, using English only"
      );
      return [
        {
          code: "en",
          nativeName: "English",
          englishName: "English",
        },
      ];
    }

    const translations = await response.json();

    if (!Array.isArray(translations) || translations.length === 0) {
      // If database is empty, only return English (fallback)
      cachedLanguageOptions = [
        {
          code: "en",
          nativeName: "English",
          englishName: "English",
        },
      ];
      return cachedLanguageOptions;
    }

    console.log("Languages from database:", translations);

    // Map database translations to language options
    // ONLY include languages that exist in the database
    const options: LanguageOption[] = translations
      .map((t: { code: string; nativeName?: string; englishName?: string }) => {
        // Use display names from database, fallback to code if not provided
        return {
          code: t.code,
          nativeName: t.nativeName || t.code.toUpperCase(),
          englishName: t.englishName || t.code.toUpperCase(),
        };
      })
      .filter((opt: LanguageOption | undefined): opt is LanguageOption =>
        Boolean(opt)
      );

    // Only return languages from database, never fallback to all file options
    cachedLanguageOptions =
      options.length > 0
        ? options
        : [
            {
              code: "en",
              nativeName: "English",
              englishName: "English",
            },
          ];
    return cachedLanguageOptions;
  } catch (error) {
    console.warn("Failed to fetch language options from database:", error);
    // On error, only return English (fallback), not all file-based options
    return [
      {
        code: "en",
        nativeName: "English",
        englishName: "English",
      },
    ];
  }
}

// Static export for immediate use (will be populated async from database)
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "en",
    nativeName: "English",
    englishName: "English",
  },
];

export const DEFAULT_LOCALE: Locale = "en";
export const SUPPORTED_LOCALES: Locale[] = LANGUAGE_OPTIONS.map(
  (option) => option.code
);

export function isValidLocale(locale: string): boolean {
  return typeof locale === "string" && locale.trim().length > 0;
}

const messageCache: Record<string, Messages> = {};

export function getTranslations(locale: Locale): Messages {
  const normalized = locale || DEFAULT_LOCALE;
  // Return cached translations or fallback to English
  return messageCache[normalized] ?? fallbackMessages;
}

export async function loadLanguage(
  locale: Locale,
  forceReload: boolean = false
): Promise<Messages | null> {
  const normalized = locale || DEFAULT_LOCALE;

  if (messageCache[normalized] && !forceReload) {
    return messageCache[normalized];
  }

  try {
    const cacheBuster = forceReload ? `?t=${Date.now()}` : "";
    const response = await fetch(
      `/api/translations/${normalized}${cacheBuster}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.warn(
        `Failed to fetch translations for ${normalized}: ${response.statusText}`
      );
      // If server fails and it's not English, try to fallback to English
      if (normalized !== DEFAULT_LOCALE) {
        const englishFallback = await loadLanguage(DEFAULT_LOCALE, false);
        return englishFallback ?? (fallbackMessages as Messages);
      }
      // If English also fails, return the static fallback
      return fallbackMessages as Messages;
    }

    const payload = await response.json();
    const data = (payload?.data ?? payload) as Messages;

    if (data) {
      messageCache[normalized] = data;
      return data;
    }

    return null;
  } catch (error) {
    console.warn(`Failed to load language file for ${normalized}:`, error);
    // If server fails, fallback to English JSON file
    if (normalized !== DEFAULT_LOCALE) {
      // Try to get English from cache or return fallback
      return messageCache[DEFAULT_LOCALE] ?? (fallbackMessages as Messages);
    }
    // If English fails, return the static fallback
    return fallbackMessages as Messages;
  }
}

export function clearMessageCache(locale?: string) {
  if (locale) {
    delete messageCache[locale];
    return;
  }

  // Clear all cached messages
  Object.keys(messageCache).forEach((key) => {
    delete messageCache[key];
  });
}

export function clearLanguageOptionsCache() {
  cachedLanguageOptions = null;
}

export function getLanguageLabel(
  locale: Locale,
  useNative: boolean = true
): string {
  const option = LANGUAGE_OPTIONS.find((opt) => opt.code === locale);
  if (!option) {
    return locale.toUpperCase();
  }
  return useNative ? option.nativeName : option.englishName;
}
