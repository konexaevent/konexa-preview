import type { Locale } from "./i18n";

const localeMap: Record<Locale, string> = {
  ca: "ca-ES",
  es: "es-ES",
  en: "en-GB"
};

export function formatActivityDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeMap[locale], {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
