/**
 * Constants used across the application
 */

import { getLanguageLabel, isValidLocale } from "@/lib/i18n";

// Helper function to get language name (with fallback)
export function getLanguageDisplayName(code: string): string {
  if (isValidLocale(code)) {
    return getLanguageLabel(code, true);
  }
  return code.toUpperCase();
}
