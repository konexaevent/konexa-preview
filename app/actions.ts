"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cancelDemoBooking } from "@/lib/demo-data";
import { getStoredDemoProfile, setStoredDemoProfile } from "@/lib/demo-profile";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type JoinableActivity = {
  id: string;
  max_participants: number;
};

function getAvatarContentType(file: File) {
  return file.type || "application/octet-stream";
}

async function saveDemoAvatar(file: File, userId: string) {
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase() || "png"
    : "png";
  const relativeDir = path.join("demo-uploads", userId);
  const targetDir = path.join(process.cwd(), "public", relativeDir);
  const fileName = `avatar-${Date.now()}.${extension}`;
  const targetPath = path.join(targetDir, fileName);

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, Buffer.from(await file.arrayBuffer()));

  return `/${relativeDir}/${fileName}`;
}

async function getOrigin() {
  const headersList = await headers();
  return headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function joinActivityAction(formData: FormData) {
  const activityId = String(formData.get("activity_id") || "");
  const redirectTo = String(formData.get("redirect_to") || "/profile");

  if (!activityId) {
    redirect(redirectTo);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}mode=demo`);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const db = supabase as any;

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(redirectTo)}`);
  }

  const [{ data: existingBooking }, { data: activity }, { count: participantCount }] = await Promise.all([
    supabase
      .from("activity_participants")
      .select("id")
      .eq("activity_id", activityId)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("activities")
      .select("id,max_participants")
      .eq("id", activityId)
      .maybeSingle(),
    supabase
      .from("activity_participants")
      .select("id", { count: "exact", head: true })
      .eq("activity_id", activityId)
      .neq("status", "cancelled")
  ]);

  const joinableActivity = activity as JoinableActivity | null;

  if (!existingBooking && joinableActivity && (participantCount ?? 0) < joinableActivity.max_participants) {
    await db.from("activity_participants").insert({
      activity_id: activityId,
      user_id: user.id
    });
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath(`/activities/${activityId}`);

  redirect(redirectTo);
}

export async function requestActivityJoinAction(formData: FormData) {
  const activityId = String(formData.get("activity_id") || "");
  const redirectTo = String(formData.get("redirect_to") || `/activities/${activityId}/join`);
  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const birthDate = String(formData.get("birth_date") || "").trim();
  const motivation = String(formData.get("motivation") || "").trim();

  if (!activityId) {
    redirect("/");
  }

  const successRedirect = `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}requested=1`;
  const errorRedirect = `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}error=1`;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect(successRedirect);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const db = supabase as any;

  let targetUserId = user?.id || null;
  const admin = createSupabaseAdminClient();

  if (user) {
    const fullName = [firstName, lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || user.user_metadata.full_name || user.email || "User";

    await db.from("profiles").upsert({
      id: user.id,
      first_name: firstName || user.user_metadata.first_name || null,
      last_name: lastName || user.user_metadata.last_name || null,
      full_name: fullName,
      birth_date: birthDate || user.user_metadata.birth_date || null
    });
  } else {
    if (!firstName || !lastName || !email || !birthDate || !motivation) {
      redirect(errorRedirect);
    }

    if (!admin) {
      redirect(successRedirect);
    }

    const existingUsers = await admin.auth.admin.listUsers();
    let existingUser = existingUsers.data.users.find(
      (candidate) => candidate.email?.toLowerCase() === email
    );

    if (!existingUser) {
      const created = await admin.auth.admin.createUser({
        email,
        password: crypto.randomUUID(),
        email_confirm: true,
        user_metadata: {
          full_name: `${firstName} ${lastName}`.trim(),
          first_name: firstName,
          last_name: lastName,
          birth_date: birthDate
        }
      });

      if (created.error || !created.data.user) {
        redirect(errorRedirect);
      }

      existingUser = created.data.user;
    }

    targetUserId = existingUser.id;

    await (admin as any).from("profiles").upsert({
      id: existingUser.id,
      first_name: firstName || null,
      last_name: lastName || null,
      full_name: `${firstName} ${lastName}`.trim(),
      birth_date: birthDate || null
    });

    await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${await getOrigin()}/auth/callback?next=${encodeURIComponent("/profile")}`
      }
    });
  }

  if (!targetUserId) {
    redirect(errorRedirect);
  }

  const requestDb = !user && admin ? (admin as any) : db;

  const [{ data: existingBooking }, { data: activity }] = await Promise.all([
    requestDb
      .from("activity_participants")
      .select("id")
      .eq("activity_id", activityId)
      .eq("user_id", targetUserId)
      .maybeSingle(),
    requestDb.from("activities").select("id").eq("id", activityId).maybeSingle()
  ]);

  if (!activity) {
    redirect(errorRedirect);
  }

  if (!existingBooking) {
    await requestDb.from("activity_participants").insert({
      activity_id: activityId,
      user_id: targetUserId,
      status: "pending",
      request_message: motivation || null
    });
  } else {
    await requestDb
      .from("activity_participants")
      .update({
        status: "pending",
        request_message: motivation || null
      })
      .eq("activity_id", activityId)
      .eq("user_id", targetUserId);
  }

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath(`/activities/${activityId}`);
  revalidatePath(`/activities/${activityId}/join`);

  redirect(successRedirect);
}

export async function updateProfileAction(formData: FormData) {
  const redirectTo = String(formData.get("redirect_to") || "/profile");
  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const birthDate = String(formData.get("birth_date") || "").trim();
  const avatarFile = formData.get("avatar_file");

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    const existingProfile = await getStoredDemoProfile();
    const avatarUrl =
      avatarFile instanceof File && avatarFile.size > 0
        ? await saveDemoAvatar(avatarFile, existingProfile.id)
        : existingProfile.avatarUrl;

    await setStoredDemoProfile({
      firstName,
      lastName,
      email,
      birthDate,
      avatarUrl
    });
    revalidatePath("/");
    revalidatePath("/profile");
    redirect(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}saved=1`);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const db = supabase as any;

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(redirectTo)}`);
  }

  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || user.email || "User";
  let resolvedAvatarUrl =
    user.user_metadata.avatar_url ||
    `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(fullName)}`;

  if (avatarFile instanceof File && avatarFile.size > 0) {
    const extension = avatarFile.name.includes(".")
      ? avatarFile.name.split(".").pop()?.toLowerCase() || "png"
      : "png";
    const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;
    const fileBuffer = Buffer.from(await avatarFile.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, fileBuffer, {
        contentType: getAvatarContentType(avatarFile),
        upsert: true
      });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      resolvedAvatarUrl = publicUrlData.publicUrl;
    }
  }

  await db.from("profiles").upsert({
    id: user.id,
    first_name: firstName || null,
    last_name: lastName || null,
    full_name: fullName,
    birth_date: birthDate || null,
    avatar_url: resolvedAvatarUrl
  });

  if (email && email !== user.email) {
    await supabase.auth.updateUser({
      email,
      data: {
        ...user.user_metadata,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        avatar_url: resolvedAvatarUrl
      }
    });
  } else {
    await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        avatar_url: resolvedAvatarUrl
      }
    });
  }

  revalidatePath("/profile");
  redirect(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}saved=1`);
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath("/");
  revalidatePath("/profile");
  redirect("/");
}

export async function reviewPendingAction(formData: FormData) {
  const activityId = String(formData.get("activity_id") || "");
  const attendeeId = String(formData.get("attendee_id") || "");
  const decision = String(formData.get("decision") || "confirmed");
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    redirect("/admin/pending?review=demo");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const db = supabase as any;

  if (!user) {
    redirect("/login?next=/admin/pending");
  }

  await db
    .from("activity_participants")
    .update({
      status: decision === "cancelled" ? "cancelled" : "confirmed"
    })
    .eq("activity_id", activityId)
    .eq("user_id", attendeeId);

  revalidatePath("/admin/pending");
  revalidatePath("/profile");
  redirect("/admin/pending?review=1");
}

export async function cancelActivityReservationAction(formData: FormData) {
  const activityId = String(formData.get("activity_id") || "");
  const redirectTo = String(formData.get("redirect_to") || `/activities/${activityId}`);

  if (!activityId) {
    redirect(redirectTo);
  }

  const successRedirect = `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}cancelled=1`;
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const demoProfile = await getStoredDemoProfile();
    cancelDemoBooking(demoProfile.id, activityId);
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath(`/activities/${activityId}`);
    redirect(successRedirect);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const db = supabase as any;

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(redirectTo)}`);
  }

  await db
    .from("activity_participants")
    .update({
      status: "cancelled"
    })
    .eq("activity_id", activityId)
    .eq("user_id", user.id)
    .in("status", ["pending", "confirmed"]);

  revalidatePath("/");
  revalidatePath("/profile");
  revalidatePath(`/activities/${activityId}`);
  revalidatePath(`/activities/${activityId}/join`);

  redirect(successRedirect);
}
