"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  DEFAULT_LOCALE,
  Locale,
  Messages,
  getTranslations,
  isValidLocale,
  loadLanguage,
} from "@/lib/i18n";

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
} | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  // Initialize with English fallback to prevent undefined errors
  const [translations, setTranslations] = useState<Messages>(() =>
    getTranslations(DEFAULT_LOCALE)
  );

  const changeLocale = useCallback(
    async (
      newLocale: Locale,
      options: { force?: boolean; persist?: boolean } = {}
    ) => {
      const normalized = isValidLocale(newLocale) ? newLocale : DEFAULT_LOCALE;

      if (!options.force && normalized === locale) {
        return;
      }

      const loaded = await loadLanguage(normalized, options.force);
      if (loaded) {
        setTranslations(loaded);
        setLocaleState(normalized);
        if (options.persist ?? true) {
          localStorage.setItem("locale", normalized);
        }
        return;
      }

      if (normalized !== DEFAULT_LOCALE) {
        const fallback = await loadLanguage(DEFAULT_LOCALE, options.force);
        if (fallback) {
          setTranslations(fallback);
          setLocaleState(DEFAULT_LOCALE);
          if (options.persist ?? true) {
            localStorage.setItem("locale", DEFAULT_LOCALE);
          }
        }
      }
    },
    [locale]
  );

  useEffect(() => {
    // Load default locale first, then check for saved locale
    const loadInitialLocale = async () => {
      const savedLocale = localStorage.getItem("locale");
      const localeToLoad =
        savedLocale && isValidLocale(savedLocale)
          ? savedLocale
          : DEFAULT_LOCALE;

      await changeLocale(localeToLoad, { force: false });
    };

    void loadInitialLocale();
  }, [changeLocale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      void changeLocale(newLocale);
    },
    [changeLocale]
  );

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
