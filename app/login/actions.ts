"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const getOrigin = async () => {
  const headersList = await headers();
  const origin = headersList.get("origin");
  return origin || "http://localhost:3000";
};

export async function signInWithPassword(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const next = String(formData.get("next") || "/profile");
  if (!supabase) {
    redirect("/login?mode=demo");
  }

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(next);
}

export async function signUpWithPassword(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const next = String(formData.get("next") || "/profile");
  if (!supabase) {
    redirect("/login?mode=demo");
  }

  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "");
  const origin = await getOrigin();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/login?success=${encodeURIComponent("Check your email to confirm your account")}&next=${encodeURIComponent(next)}`
  );
}

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const next = String(formData.get("next") || "/profile");
  if (!supabase) {
    redirect("/login?mode=demo");
  }

  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`
    }
  });

  if (error || !data.url) {
    redirect(`/login?error=${encodeURIComponent(error?.message || "Google auth failed")}`);
  }

  redirect(data.url);
}
