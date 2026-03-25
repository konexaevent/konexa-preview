import { cookies } from "next/headers";
import { defaultLocale, getMessages, localeCookieName, locales, type Locale } from "./i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(localeCookieName)?.value;
  if (value && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return defaultLocale;
}

export async function getServerMessages() {
  const locale = await getLocale();
  return getMessages(locale);
}
