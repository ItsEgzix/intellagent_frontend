import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

import {
  DEFAULT_LANGUAGE_REGISTRY,
  type LanguageInfo,
} from "@/lib/language-registry";

function getLanguagesFilePath() {
  return path.join(process.cwd(), "messages", "languages.json");
}

function normalizeRegistryPayload(payload: unknown): LanguageInfo[] {
  const normalized = Array.isArray(payload)
    ? payload
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const code = (entry as { code?: string }).code;
          if (!code) return null;
          const fallbackName = code.toUpperCase();
          const name =
            (entry as { name?: string }).name ||
            (entry as { nameEn?: string }).nameEn ||
            fallbackName;
          const nameEn =
            (entry as { nameEn?: string }).nameEn ||
            (entry as { name?: string }).name ||
            fallbackName;
          return {
            code,
            name,
            nameEn,
          } as LanguageInfo;
        })
        .filter((entry): entry is LanguageInfo => entry !== null)
    : [];

  const registryMap = new Map<string, LanguageInfo>();
  DEFAULT_LANGUAGE_REGISTRY.forEach((language) =>
    registryMap.set(language.code, language)
  );
  normalized.forEach((language) => {
    const cleaned: LanguageInfo = {
      code: language.code,
      name: language.name.trim() || language.code.toUpperCase(),
      nameEn: language.nameEn.trim() || language.code.toUpperCase(),
    };
    registryMap.set(cleaned.code, cleaned);
  });

  return Array.from(registryMap.values());
}

const responseHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    const registryPath = getLanguagesFilePath();

    if (!fs.existsSync(registryPath)) {
      return NextResponse.json(DEFAULT_LANGUAGE_REGISTRY, {
        headers: responseHeaders,
      });
    }

    const fileContents = fs.readFileSync(registryPath, "utf-8");
    const parsed = JSON.parse(fileContents);
    const payload = normalizeRegistryPayload(parsed);

    return NextResponse.json(payload, { headers: responseHeaders });
  } catch (error) {
    console.error("Failed to load language registry:", error);
    return NextResponse.json(DEFAULT_LANGUAGE_REGISTRY, {
      headers: responseHeaders,
      status: 200,
    });
  }
}
