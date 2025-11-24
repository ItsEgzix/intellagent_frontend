/**
 * Constants used across the application
 */

import { getLanguageName } from "@/lib/language-registry";

// Helper function to get language name (with fallback)
export function getLanguageDisplayName(code: string): string {
  return getLanguageName(code, true);
}
