"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStoredDemoProfile, setStoredDemoProfile } from "@/lib/demo-profile";
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
