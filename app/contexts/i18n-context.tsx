"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, getTranslations, loadLanguage } from "@/lib/i18n";
import type { messages } from "@/lib/i18n";
import {
  isValidLocale,
  refreshLanguageRegistry,
} from "@/lib/language-registry";

type Messages = typeof messages.en;

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
} | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default locale and ensure translations are available immediately
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Ensure default translations are available immediately for SSR
  const [t] = useState(() => getTranslations("en"));

  useEffect(() => {
    let isMounted = true;

    async function bootstrapLocale() {
      // Always refresh the registry so newly generated languages become available
      await refreshLanguageRegistry(true);
      if (!isMounted) return;

      const savedLocale = localStorage.getItem("locale") as Locale | null;
      if (savedLocale && isValidLocale(savedLocale)) {
        await loadLanguage(savedLocale);
        if (isMounted) {
          setLocaleState(savedLocale);
        }
      }
    }

    bootstrapLocale();

    return () => {
      isMounted = false;
    };
  }, []);

  const setLocale = async (newLocale: Locale) => {
    // Prevent page reload by using state update instead of navigation
    if (newLocale === locale) return;

    setIsLoading(true);
    try {
      let localeExists = isValidLocale(newLocale);
      if (!localeExists) {
        await refreshLanguageRegistry(true);
        localeExists = isValidLocale(newLocale);
      }

      // In development, always force reload to get fresh translations
      const isDev =
        typeof window !== "undefined"
          ? window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1"
          : process.env.NODE_ENV === "development";
      // Load the language file if it's not already loaded
      const loadedMessages = await loadLanguage(
        newLocale,
        isDev || !localeExists
      );
      if (loadedMessages) {
        setLocaleState(newLocale);
        localStorage.setItem("locale", newLocale);
        // Force a re-render by updating refresh key
        setRefreshKey((prev) => prev + 1);
      } else {
        console.warn(
          `Language ${newLocale} not available, keeping current locale`
        );
      }
    } catch (error) {
      console.error(`Failed to load language ${newLocale}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-compute translations when locale or refreshKey changes
  const currentT = React.useMemo(
    () => getTranslations(locale),
    [locale, refreshKey]
  );

  // Use current translations, fallback to initial if not available
  const translations = currentT || t;

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
