"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale, getTranslations } from "@/lib/i18n";
import type { messages } from "@/lib/i18n";

type Messages = typeof messages.en;

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
} | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    if (
      savedLocale &&
      (savedLocale === "en" || savedLocale === "zh" || savedLocale === "ms")
    ) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = getTranslations(locale);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
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
