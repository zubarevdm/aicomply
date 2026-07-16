import type { Locale } from "@/i18n/config";

/** Persist the chosen locale for a year so the proxy can honour it next visit. */
export function setLocaleCookie(locale: Locale): void {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
}
