import en from "../messages/en.json";
import zh from "../messages/zh.json";
import ms from "../messages/ms.json";

export type Locale = "en" | "zh" | "ms";

export const locales: Locale[] = ["en", "zh", "ms"];

export const messages = {
  en,
  zh,
  ms,
} as const;

export function getTranslations(locale: Locale) {
  return messages[locale];
}
