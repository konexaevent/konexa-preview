import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { defaultLocale, localeCookieName } from "@/lib/i18n";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./config";

type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export async function updateSession(request: NextRequest) {
  const ensureLocaleCookie = (response: NextResponse) => {
    if (!request.cookies.get(localeCookieName)) {
      response.cookies.set(localeCookieName, defaultLocale, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365
      });
    }
    return response;
  };

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseAnonKey) {
    return ensureLocaleCookie(NextResponse.next({ request }));
  }

  let response = ensureLocaleCookie(NextResponse.next({ request }));

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });

  await supabase.auth.getUser();
  return ensureLocaleCookie(response);
}
