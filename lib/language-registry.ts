/**
 * Language registry - automatically includes all available languages
 * When a new language JSON is added, update this registry
 */

export interface LanguageInfo {
  code: string;
  name: string; // Display name in the language itself
  nameEn: string; // Display name in English
}

export const DEFAULT_LANGUAGE_REGISTRY: LanguageInfo[] = [
  { code: "en", name: "English", nameEn: "English" },
  { code: "zh", name: "中文", nameEn: "Chinese" },
  { code: "ms", name: "Bahasa Melayu", nameEn: "Malay" },
];

const REGISTRY_ENDPOINT = "/api/languages/registry";

let runtimeRegistry: LanguageInfo[] = [...DEFAULT_LANGUAGE_REGISTRY];
let inFlightRefresh: Promise<LanguageInfo[]> | null = null;
export const LANGUAGE_REGISTRY_UPDATED_EVENT = "language-registry-updated";

function emitRegistryUpdate(languages: LanguageInfo[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(LANGUAGE_REGISTRY_UPDATED_EVENT, {
      detail: languages,
    })
  );
}

function sanitizeLanguage(
  languageInfo: Partial<LanguageInfo>
): LanguageInfo | null {
  if (!languageInfo || !languageInfo.code) {
    return null;
  }

  const fallbackName = languageInfo.code.toUpperCase();
  const name = (
    languageInfo.name ||
    languageInfo.nameEn ||
    fallbackName
  ).trim();
  const nameEn = (
    languageInfo.nameEn ||
    languageInfo.name ||
    fallbackName
  ).trim();

  return {
    code: languageInfo.code,
    name,
    nameEn,
  };
}

function setLanguageRegistry(
  languages: Partial<LanguageInfo>[]
): LanguageInfo[] {
  const registryMap = new Map<string, LanguageInfo>();

  DEFAULT_LANGUAGE_REGISTRY.forEach((language) => {
    registryMap.set(language.code, { ...language });
  });

  languages.forEach((language) => {
    const normalized = sanitizeLanguage(language);
    if (!normalized) return;
    registryMap.set(normalized.code, normalized);
  });

  runtimeRegistry = Array.from(registryMap.values());
  emitRegistryUpdate(runtimeRegistry);
  return runtimeRegistry;
}

/**
 * Force-refresh the runtime registry from the API route.
 * Falls back to the last known snapshot when offline or during SSR.
 */
export async function refreshLanguageRegistry(
  force: boolean = false
): Promise<LanguageInfo[]> {
  if (typeof window === "undefined") {
    return runtimeRegistry;
  }

  if (inFlightRefresh && !force) {
    return inFlightRefresh;
  }

  const cacheBuster = force ? `?t=${Date.now()}` : "";

  const fetchPromise = fetch(`${REGISTRY_ENDPOINT}${cacheBuster}`, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch language registry: ${response.status} ${response.statusText}`
        );
      }
      const payload = (await response.json()) as Partial<LanguageInfo>[];
      if (Array.isArray(payload)) {
        return setLanguageRegistry(payload);
      }
      return runtimeRegistry;
    })
    .catch((error) => {
      console.warn("Unable to refresh language registry:", error);
      return runtimeRegistry;
    })
    .finally(() => {
      if (inFlightRefresh === fetchPromise) {
        inFlightRefresh = null;
      }
    });

  inFlightRefresh = fetchPromise;
  return fetchPromise;
}

/**
 * Get language name for display
 */
export function getLanguageName(
  code: string,
  useNative: boolean = true
): string {
  const lang = runtimeRegistry.find((l) => l.code === code);
  if (!lang) return code.toUpperCase();
  return useNative ? lang.name : lang.nameEn;
}

/**
 * Get a snapshot of the currently known languages
 */
export function getLanguageRegistrySnapshot(): LanguageInfo[] {
  return [...runtimeRegistry];
}

/**
 * Get all available language codes
 */
export function getAvailableLocales(): string[] {
  return runtimeRegistry.map((l) => l.code);
}

/**
 * Check if a locale code is valid
 */
export function isValidLocale(code: string): boolean {
  return runtimeRegistry.some((l) => l.code === code);
}

/**
 * Add or update a language in the runtime registry.
 * Useful for optimistically updating UI after creation.
 */
export function addLanguageToRegistry(languageInfo: LanguageInfo): void {
  const nextRegistry = runtimeRegistry.filter(
    (language) => language.code !== languageInfo.code
  );
  setLanguageRegistry([...nextRegistry, languageInfo]);
}
