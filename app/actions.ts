"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  cancelDemoBooking,
  deleteDemoActivity,
  getDemoAdminDashboard,
  requestDemoBooking,
  reviewDemoPendingApproval,
  updateDemoHeroCarousel,
  updateDemoHosts,
  updateDemoMemories,
  upsertDemoActivity
} from "@/lib/demo-data";
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

async function saveDemoActivityImage(file: File, activityId: string) {
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase() || "jpg"
    : "jpg";
  const relativeDir = path.join("demo-uploads", "activities");
  const targetDir = path.join(process.cwd(), "public", relativeDir);
  const fileName = `${activityId}-${Date.now()}.${extension}`;
  const targetPath = path.join(targetDir, fileName);

  await mkdir(targetDir, { recursive: true });
  await writeFile(targetPath, Buffer.from(await file.arrayBuffer()));

  return `/${relativeDir}/${fileName}`;
}

async function uploadActivityAsset(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServerClient>>>,
  file: File,
  folder: string
) {
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase() || "jpg"
    : "jpg";
  const filePath = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from("activity-images")
    .upload(filePath, fileBuffer, {
      contentType: getAvatarContentType(file),
      upsert: true
    });

  if (uploadError) {
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("activity-images")
    .getPublicUrl(filePath);
  return publicUrlData.publicUrl;
}

async function getOrigin() {
  const headersList = await headers();
  return headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

async function requireAdminOrRedirect(next = "/admin") {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const demoProfile = await getStoredDemoProfile();
    if (demoProfile.role !== "admin") {
      redirect("/profile");
    }
    return { supabase: null as any, user: { id: demoProfile.id, email: demoProfile.email } };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const db = supabase as any;

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const profileResult = await db.from("profiles").select("role").eq("id", user.id).single();
  if (profileResult.data?.role !== "admin") {
    redirect("/profile");
  }

  return { supabase, user };
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
  const accountStatus = String(formData.get("account_status") || "new");
  const firstName = String(formData.get("first_name") || "").trim();
  const lastName = String(formData.get("last_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const birthDate = String(formData.get("birth_date") || "").trim();
  const phoneNumber = String(formData.get("phone_number") || "").trim();
  const motivation = String(formData.get("motivation") || "").trim();
  const whatsappConsent = String(formData.get("whatsapp_consent") || "") === "on";

  if (!activityId) {
    redirect("/");
  }

  const successRedirect = `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}requested=1`;
  const errorRedirect = `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}error=1`;
  const passwordRedirect = `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}error=password`;
  const credentialsRedirect = `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}error=credentials`;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    const demoProfile = await getStoredDemoProfile();
    if (firstName || lastName || email || birthDate || phoneNumber) {
      await setStoredDemoProfile({
        firstName: firstName || demoProfile.firstName,
        lastName: lastName || demoProfile.lastName,
        email: email || demoProfile.email,
        birthDate: birthDate || demoProfile.birthDate,
        phoneNumber: phoneNumber || demoProfile.phoneNumber || "",
        avatarUrl: demoProfile.avatarUrl
      });
    }
    requestDemoBooking({
      userId: demoProfile.id,
      activityId,
      phoneNumber: phoneNumber || demoProfile.phoneNumber,
      requestMessage: motivation,
      whatsappOptIn: whatsappConsent
    });
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/admin");
    revalidatePath(`/activities/${activityId}`);
    revalidatePath(`/activities/${activityId}/join`);
    redirect(successRedirect);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const db = supabase as any;

  let targetUserId = user?.id || null;
  let requestPhoneNumber = phoneNumber;
  const admin = createSupabaseAdminClient();

  if (user) {
    const fullName = [firstName, lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || user.user_metadata.full_name || user.email || "User";

    const profileUpsert = await db.from("profiles").upsert({
      id: user.id,
      first_name: firstName || user.user_metadata.first_name || null,
      last_name: lastName || user.user_metadata.last_name || null,
      full_name: fullName,
      birth_date: birthDate || user.user_metadata.birth_date || null,
      phone_number: phoneNumber || user.user_metadata.phone_number || null
    });

    if (profileUpsert?.error) {
      const errorMessage = String(profileUpsert.error.message || "");
      if (errorMessage.includes("phone_number")) {
        await db.from("profiles").upsert({
          id: user.id,
          first_name: firstName || user.user_metadata.first_name || null,
          last_name: lastName || user.user_metadata.last_name || null,
          full_name: fullName,
          birth_date: birthDate || user.user_metadata.birth_date || null
        });
      } else {
        redirect(errorRedirect);
      }
    }
  } else {
    if (!email || !password || !motivation || !whatsappConsent) {
      redirect(errorRedirect);
    }

    if (password.length < 8) {
      redirect(passwordRedirect);
    }

    if (!admin) {
      redirect(successRedirect);
    }

    const isExistingAccount = accountStatus === "existing";

    if (!isExistingAccount && (!firstName || !lastName || !birthDate || !phoneNumber)) {
      redirect(errorRedirect);
    }

    if (!isExistingAccount) {
      const existingUsers = await admin.auth.admin.listUsers();
      let existingUser = existingUsers.data.users.find(
        (candidate) => candidate.email?.toLowerCase() === email
      );

      if (!existingUser) {
        const created = await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: `${firstName} ${lastName}`.trim(),
            first_name: firstName,
            last_name: lastName,
            birth_date: birthDate,
            phone_number: phoneNumber
          }
        });

        if (created.error || !created.data.user) {
          redirect(errorRedirect);
        }

        existingUser = created.data.user;
      }
    }

    const signInResult = await supabase.auth.signInWithPassword({ email, password });
    if (signInResult.error || !signInResult.data.user) {
      redirect(credentialsRedirect);
    }

    targetUserId = signInResult.data.user.id;

    if (isExistingAccount) {
      const existingProfileResult = await db
        .from("profiles")
        .select("phone_number")
        .eq("id", targetUserId)
        .maybeSingle();

      if (existingProfileResult.data?.phone_number) {
        requestPhoneNumber = existingProfileResult.data.phone_number;
      }
    } else {
      const adminProfileUpsert = await (admin as any).from("profiles").upsert({
        id: targetUserId,
        first_name: firstName || null,
        last_name: lastName || null,
        full_name: `${firstName} ${lastName}`.trim(),
        birth_date: birthDate || null,
        phone_number: phoneNumber || null
      });

      if (adminProfileUpsert?.error) {
        const errorMessage = String(adminProfileUpsert.error.message || "");
        if (errorMessage.includes("phone_number")) {
          await (admin as any).from("profiles").upsert({
            id: targetUserId,
            first_name: firstName || null,
            last_name: lastName || null,
            full_name: `${firstName} ${lastName}`.trim(),
            birth_date: birthDate || null
          });
        } else {
          redirect(errorRedirect);
        }
      }
    }
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
    const insertResult = await requestDb.from("activity_participants").insert({
      activity_id: activityId,
      user_id: targetUserId,
      status: "pending",
      request_message: motivation || null,
      phone_number: requestPhoneNumber || null,
      whatsapp_opt_in: whatsappConsent
    });

    if (insertResult?.error) {
      const errorMessage = String(insertResult.error.message || "");
      if (errorMessage.includes("phone_number") || errorMessage.includes("whatsapp_opt_in")) {
        await requestDb.from("activity_participants").insert({
          activity_id: activityId,
          user_id: targetUserId,
          status: "pending",
          request_message: motivation || null
        });
      } else {
        redirect(errorRedirect);
      }
    }
  } else {
    const updateResult = await requestDb
      .from("activity_participants")
        .update({
          status: "pending",
          request_message: motivation || null,
          phone_number: requestPhoneNumber || null,
          whatsapp_opt_in: whatsappConsent
        })
      .eq("activity_id", activityId)
      .eq("user_id", targetUserId);

    if (updateResult?.error) {
      const errorMessage = String(updateResult.error.message || "");
      if (errorMessage.includes("phone_number") || errorMessage.includes("whatsapp_opt_in")) {
        await requestDb
          .from("activity_participants")
          .update({
            status: "pending",
            request_message: motivation || null
          })
          .eq("activity_id", activityId)
          .eq("user_id", targetUserId);
      } else {
        redirect(errorRedirect);
      }
    }
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
  const phoneNumber = String(formData.get("phone_number") || "").trim();
  const avatarFile = formData.get("avatar_file");

  const addRedirectFlag = (value: string) =>
    `${redirectTo}${redirectTo.includes("?") ? "&" : "?"}${value}`;

  try {
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
        phoneNumber,
        avatarUrl
      });
      revalidatePath("/");
      revalidatePath("/profile");
      redirect(addRedirectFlag("saved=1"));
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();
    const db = supabase as any;

    if (!user) {
      redirect(`/login?next=${encodeURIComponent(redirectTo)}`);
    }

    const existingProfileResult = await db
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || user.email || "User";
    let resolvedAvatarUrl =
      existingProfileResult.data?.avatar_url ||
      `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(fullName)}`;

    if (avatarFile instanceof File && avatarFile.size > 0) {
      const extension = avatarFile.name.includes(".")
        ? avatarFile.name.split(".").pop()?.toLowerCase() || "jpg"
        : "jpg";
      const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;
      const fileBuffer = Buffer.from(await avatarFile.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, fileBuffer, {
          contentType: getAvatarContentType(avatarFile),
          upsert: true
        });

      if (uploadError) {
        console.error("Avatar upload failed", uploadError);
        redirect(addRedirectFlag("error=avatar"));
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      resolvedAvatarUrl = publicUrlData.publicUrl;
    }

    const profilePayload = {
      id: user.id,
      first_name: firstName || null,
      last_name: lastName || null,
      full_name: fullName,
      birth_date: birthDate || null,
      phone_number: phoneNumber || null,
      avatar_url: resolvedAvatarUrl
    };

    const profileUpsert = await db.from("profiles").upsert(profilePayload);
    const admin = createSupabaseAdminClient();

    if (profileUpsert?.error) {
      const errorMessage = String(profileUpsert.error.message || "");
      if (errorMessage.includes("phone_number")) {
        const fallbackPayload = {
          id: user.id,
          first_name: firstName || null,
          last_name: lastName || null,
          full_name: fullName,
          birth_date: birthDate || null,
          avatar_url: resolvedAvatarUrl
        };
        const fallbackUpsert = await db.from("profiles").upsert(fallbackPayload);

        if (fallbackUpsert?.error) {
          if (admin) {
            const adminFallbackUpsert = await (admin as any).from("profiles").upsert(fallbackPayload);
            if (adminFallbackUpsert?.error) {
              console.error("Profile fallback upsert failed", adminFallbackUpsert.error);
              redirect(addRedirectFlag("error=profile"));
            }
          } else {
            console.error("Profile fallback upsert failed", fallbackUpsert.error);
            redirect(addRedirectFlag("error=profile"));
          }
        }
      } else {
        if (admin) {
          const adminUpsert = await (admin as any).from("profiles").upsert(profilePayload);
          if (adminUpsert?.error) {
            console.error("Profile upsert failed", adminUpsert.error);
            redirect(addRedirectFlag("error=profile"));
          }
        } else {
          console.error("Profile upsert failed", profileUpsert.error);
          redirect(addRedirectFlag("error=profile"));
        }
      }
    }

    if (email && email !== user.email) {
      const authUpdate = await supabase.auth.updateUser({
        email
      });

      if (authUpdate.error) {
        console.error("Auth email update failed", authUpdate.error);
        redirect(addRedirectFlag("error=email"));
      }
    }

    revalidatePath("/profile");
    redirect(addRedirectFlag("saved=1"));
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    console.error("Unexpected profile update failure", error);
    redirect(addRedirectFlag("error=unexpected"));
  }
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
  const { supabase } = await requireAdminOrRedirect("/admin");

  if (!supabase) {
    reviewDemoPendingApproval(
      activityId,
      attendeeId,
      decision === "cancelled" ? "cancelled" : "confirmed"
    );
    revalidatePath("/admin");
    revalidatePath("/profile");
    revalidatePath(`/activities/${activityId}`);
    redirect("/admin?review=1");
  }

  const db = supabase as any;

  await db
    .from("activity_participants")
    .update({
      status: decision === "cancelled" ? "cancelled" : "confirmed"
    })
    .eq("activity_id", activityId)
    .eq("user_id", attendeeId);

  revalidatePath("/admin");
  revalidatePath("/admin/pending");
  revalidatePath("/profile");
  revalidatePath(`/activities/${activityId}`);
  redirect("/admin?review=1");
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

export async function saveActivityAction(formData: FormData) {
  const { supabase } = await requireAdminOrRedirect("/admin");
  const activityId = String(formData.get("activity_id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const price = String(formData.get("price") || "").trim();
  const startsAt = String(formData.get("starts_at") || "").trim();
  const city = String(formData.get("city") || "Girona").trim() || "Girona";
  const ageRange = String(formData.get("age_range") || "25-35").trim() as
    | "18-25"
    | "25-35"
    | "35-50"
    | "50+";
  const hostUserId = String(formData.get("host_user_id") || "").trim();
  const hostName = String(formData.get("host_name") || "").trim();
  const hostAvatarUrl = String(formData.get("host_avatar_url") || "").trim();
  const existingImageUrl = String(formData.get("existing_image_url") || "").trim();
  const requiresApproval = String(formData.get("requires_approval") || "") === "on";
  const maxParticipants = Number(formData.get("max_participants") || 8);
  const imageFocusX = Number(formData.get("image_focus_x") || 50);
  const imageFocusY = Number(formData.get("image_focus_y") || 50);
  const imageZoom = Number(formData.get("image_zoom") || 1);
  const imageFile = formData.get("hero_image_file");

  if (!title || !summary || !price || !startsAt) {
    redirect("/admin?error=activity");
  }

  let heroImageUrl = existingImageUrl;

  if (!supabase) {
    if (imageFile instanceof File && imageFile.size > 0) {
      heroImageUrl = await saveDemoActivityImage(imageFile, activityId || crypto.randomUUID());
    }

    upsertDemoActivity({
      id: activityId || undefined,
      title,
      summary,
      price,
      startsAt,
      city,
      ageRange,
      heroImageUrl:
        heroImageUrl ||
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
      imageFocusX: Number.isFinite(imageFocusX) ? Math.max(0, Math.min(100, imageFocusX)) : 50,
      imageFocusY: Number.isFinite(imageFocusY) ? Math.max(0, Math.min(100, imageFocusY)) : 50,
      imageZoom: Number.isFinite(imageZoom) ? Math.max(1, Math.min(2, imageZoom)) : 1,
      hostUserId: hostUserId || undefined,
      hostName: hostName || undefined,
      hostAvatarUrl: hostAvatarUrl || undefined,
      requiresApproval,
      maxParticipants: Number.isFinite(maxParticipants) ? Math.max(2, maxParticipants) : 8
    });

    revalidatePath("/");
    revalidatePath("/admin");
    if (activityId) {
      revalidatePath(`/activities/${activityId}`);
    }
    redirect("/admin?saved=1");
  }

  if (imageFile instanceof File && imageFile.size > 0) {
    const extension = imageFile.name.includes(".")
      ? imageFile.name.split(".").pop()?.toLowerCase() || "jpg"
      : "jpg";
    const filePath = `${activityId || crypto.randomUUID()}/hero-${Date.now()}.${extension}`;
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from("activity-images")
      .upload(filePath, fileBuffer, {
        contentType: getAvatarContentType(imageFile),
        upsert: true
      });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("activity-images")
        .getPublicUrl(filePath);
      heroImageUrl = publicUrlData.publicUrl;
    }
  }

  const db = supabase as any;
  const payload = {
    title,
    summary,
    price,
    starts_at: startsAt,
    city,
    age_range: ageRange,
    hero_image_url:
      heroImageUrl ||
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    image_focus_x: Number.isFinite(imageFocusX) ? Math.max(0, Math.min(100, imageFocusX)) : 50,
    image_focus_y: Number.isFinite(imageFocusY) ? Math.max(0, Math.min(100, imageFocusY)) : 50,
    image_zoom: Number.isFinite(imageZoom) ? Math.max(1, Math.min(2, imageZoom)) : 1,
    host_user_id: hostUserId || null,
    host_name: hostName || null,
    host_avatar_url: hostAvatarUrl || null,
    requires_approval: requiresApproval,
    max_participants: Number.isFinite(maxParticipants) ? Math.max(2, maxParticipants) : 8
  };

  if (activityId) {
    await db.from("activities").update(payload).eq("id", activityId);
  } else {
    await db.from("activities").insert(payload);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  if (activityId) {
    revalidatePath(`/activities/${activityId}`);
  }
  redirect("/admin?saved=1");
}

export async function deleteActivityAction(formData: FormData) {
  const { supabase } = await requireAdminOrRedirect("/admin");
  const activityId = String(formData.get("activity_id") || "").trim();

  if (!activityId) {
    redirect("/admin");
  }

  if (!supabase) {
    deleteDemoActivity(activityId);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/profile");
    redirect("/admin?deleted=1");
  }

  const db = supabase as any;
  await db.from("activities").delete().eq("id", activityId);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/profile");
  redirect("/admin?deleted=1");
}

export async function saveHeroCarouselAction(formData: FormData) {
  const { supabase } = await requireAdminOrRedirect("/admin");

  const imageUrls = await Promise.all(
    [1, 2, 3].map(async (index) => {
      const currentValue = String(formData.get(`image_${index}_current`) || "").trim();
      const file = formData.get(`image_${index}_file`);

      if (!supabase) {
        if (file instanceof File && file.size > 0) {
          return saveDemoActivityImage(file, `hero-carousel-${index}`);
        }
        return currentValue;
      }

      if (file instanceof File && file.size > 0) {
        return uploadActivityAsset(supabase, file, `homepage/hero-${index}`);
      }

      return currentValue;
    })
  );

  const resolvedImages = (await Promise.all(imageUrls)).filter(Boolean) as string[];

  if (!supabase) {
    updateDemoHeroCarousel(resolvedImages);
    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin?saved=1");
  }

  const db = supabase as any;
  await db.from("homepage_content").upsert({
    id: "home",
    hero_carousel_images: resolvedImages
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}

export async function saveHostsContentAction(formData: FormData) {
  const { supabase } = await requireAdminOrRedirect("/admin");

  const hosts = await Promise.all(
    ["18-25", "25-35", "35-50", "50+"].map(async (age, index) => {
      const slot = index + 1;
      const currentAvatarUrl = String(formData.get(`host_${slot}_avatar_current`) || "").trim();
      const avatarFile = formData.get(`host_${slot}_avatar_file`);

      let avatarUrl = currentAvatarUrl;
      if (!supabase) {
        if (avatarFile instanceof File && avatarFile.size > 0) {
          avatarUrl = await saveDemoActivityImage(avatarFile, `host-${slot}`);
        }
      } else if (avatarFile instanceof File && avatarFile.size > 0) {
        avatarUrl =
          (await uploadActivityAsset(supabase, avatarFile, `homepage/host-${slot}`)) ||
          currentAvatarUrl;
      }

      return {
        age,
        name: String(formData.get(`host_${slot}_name`) || "").trim(),
        role: String(formData.get(`host_${slot}_role`) || "").trim(),
        bio: String(formData.get(`host_${slot}_bio`) || "").trim(),
        avatarUrl,
        videoUrl: String(formData.get(`host_${slot}_video_url`) || "").trim()
      };
    })
  );

  if (!supabase) {
    updateDemoHosts(hosts as any);
    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin?hosts_saved=1");
  }

  const db = supabase as any;
  const { data: existingRow, error: existingError } = await db
    .from("homepage_content")
    .select("id")
    .eq("id", "home")
    .maybeSingle();

  if (existingError) {
    redirect("/admin?hosts_error=1");
  }

  const payload = {
    id: "home",
    hosts,
    updated_at: new Date().toISOString()
  };

  const saveResult = existingRow
    ? await db.from("homepage_content").update(payload).eq("id", "home")
    : await db.from("homepage_content").insert({
        ...payload,
        hero_carousel_images: [],
        memories_items: []
      });

  if (saveResult?.error) {
    redirect("/admin?hosts_error=1");
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?hosts_saved=1");
}

export async function saveMemoriesContentAction(formData: FormData) {
  const { supabase } = await requireAdminOrRedirect("/admin");

  const items = await Promise.all(
    [1, 2, 3].map(async (slot) => {
      const currentImageUrl = String(formData.get(`memory_${slot}_image_current`) || "").trim();
      const imageFile = formData.get(`memory_${slot}_image_file`);

      let imageUrl = currentImageUrl;
      if (!supabase) {
        if (imageFile instanceof File && imageFile.size > 0) {
          imageUrl = await saveDemoActivityImage(imageFile, `memory-${slot}`);
        }
      } else if (imageFile instanceof File && imageFile.size > 0) {
        imageUrl =
          (await uploadActivityAsset(supabase, imageFile, `homepage/memory-${slot}`)) ||
          currentImageUrl;
      }

      return {
        title: String(formData.get(`memory_${slot}_title`) || "").trim(),
        imageUrl
      };
    })
  );

  const videoUrl = String(formData.get("memories_video_url") || "").trim();

  if (!supabase) {
    updateDemoMemories({ videoUrl, items });
    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin?saved=1");
  }

  const db = supabase as any;
  await db.from("homepage_content").upsert({
    id: "home",
    memories_video_url: videoUrl,
    memories_items: items
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}
