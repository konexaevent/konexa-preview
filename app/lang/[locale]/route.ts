import { NextResponse } from "next/server";
import { defaultLocale, localeCookieName, locales, type Locale } from "@/lib/i18n";

type RouteContext = {
  params: Promise<{ locale: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
  const { locale } = await params;
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/";
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  const response = NextResponse.redirect(new URL(next, url.origin));
  response.cookies.set(localeCookieName, validLocale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  });

  return response;
}
