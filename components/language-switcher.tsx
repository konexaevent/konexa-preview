"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = {
  ca: "CAT",
  es: "ES",
  en: "EN"
};

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.toString();
  const next = currentSearch ? `${pathname}?${currentSearch}` : pathname;

  return (
    <div className="language-switcher" aria-label="Language switcher">
      {locales.map((locale) => (
        <a
          key={locale}
          href={`/lang/${locale}?next=${encodeURIComponent(next)}`}
          className={`language-pill ${currentLocale === locale ? "language-pill-active" : ""}`}
        >
          {labels[locale]}
        </a>
      ))}
    </div>
  );
}
