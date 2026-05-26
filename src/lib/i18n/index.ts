import "server-only";
import { cookies, headers } from "next/headers";
import { LOCALES, DEFAULT_LOCALE, type Locale } from "./config";

export * from "./config";

// Lazy-loaded dictionaries (only the chosen one is imported)
const loaders: Record<Locale, () => Promise<{ default: Dict }>> = {
  en: () => import("./locales/en.json"),
  de: () => import("./locales/de.json"),
  es: () => import("./locales/es.json"),
  fr: () => import("./locales/fr.json"),
  pt: () => import("./locales/pt.json"),
};

export type Dict = typeof import("./locales/en.json");

export async function getDict(locale: Locale): Promise<Dict> {
  const mod = await loaders[locale]();
  return ((mod as unknown as { default: Dict }).default ?? (mod as unknown as Dict)) as Dict;
}

function parseAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const parts = header.split(",").map((p) => p.trim().split(";")[0].toLowerCase());
  for (const p of parts) {
    const base = p.split("-")[0];
    if ((LOCALES as readonly string[]).includes(base)) return base as Locale;
  }
  return null;
}

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const cookieLocale = c.get("lang")?.value;
  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as Locale;
  }
  const h = await headers();
  return parseAcceptLanguage(h.get("accept-language")) ?? DEFAULT_LOCALE;
}
