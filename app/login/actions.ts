"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/queries";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
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
  const phoneNumber = String(formData.get("phone_number") || "").trim();
  const birthDate = String(formData.get("birth_date") || "").trim();
  const admin = createSupabaseAdminClient();
  let error: { message: string } | null = null;
  const syncProfileAfterLogin = async (userId: string) => {
    const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || null;
    const lastName = nameParts.slice(1).join(" ") || null;

    if (!admin) return;

    await (admin as any).from("profiles").upsert(
      {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName.trim() || email,
        birth_date: birthDate || null,
        phone_number: phoneNumber || null
      },
      { onConflict: "id" }
    );
  };

  if (admin) {
    const created = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        birth_date: birthDate,
        phone_number: phoneNumber
      }
    });

    if (created.error) {
      const errorMessage = String(created.error.message || "");
      if (/already|registered|exists/i.test(errorMessage)) {
        const signInResult = await supabase.auth.signInWithPassword({ email, password });
        if (signInResult.error) {
          error = { message: "Aquest correu ja esta registrat" };
        } else if (signInResult.data.user) {
          await syncProfileAfterLogin(signInResult.data.user.id);
        }
      } else {
        error = { message: errorMessage };
      }
    } else {
      const signInResult = await supabase.auth.signInWithPassword({ email, password });
      if (signInResult.error) {
        error = { message: signInResult.error.message };
      } else if (signInResult.data.user) {
        await syncProfileAfterLogin(signInResult.data.user.id);
      }
    }
  } else {
    const origin = await getOrigin();
    const signUpResult = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          birth_date: birthDate,
          phone_number: phoneNumber
        },
        emailRedirectTo: `${origin}/auth/callback`
      }
    });
    error = signUpResult.error ? { message: signUpResult.error.message } : null;
  }

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect(`/login?error=${encodeURIComponent("No hem pogut iniciar la sessio automaticament. Prova d'entrar amb el teu correu i contrasenya.")}`);
  }

  redirect(next);
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

export async function sendPasswordResetEmail(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/login?mode=demo");
  }

  const email = String(formData.get("email") || "").trim();

  if (!email) {
    redirect("/login?error=Missing%20email");
  }

  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/login?success=${encodeURIComponent(
      "Hem enviat un correu per recuperar la contrasenya si el compte existeix."
    )}`
  );
}

export async function updatePasswordAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect("/login?mode=demo");
  }

  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (!password || password.length < 8) {
    redirect(`/reset-password?error=${encodeURIComponent("La contrasenya ha de tenir almenys 8 caracters.")}`);
  }

  if (password !== confirmPassword) {
    redirect(`/reset-password?error=${encodeURIComponent("Les contrasenyes no coincideixen.")}`);
  }

  const { error } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/login?success=${encodeURIComponent(
      "Contrasenya actualitzada. Ja pots iniciar sessio amb la nova."
    )}`
  );
}
