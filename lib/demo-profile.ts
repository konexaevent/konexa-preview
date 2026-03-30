import { cookies } from "next/headers";
import { getDemoProfile, type ProfileSummary } from "./demo-data";

const DEMO_PROFILE_COOKIE = "konexa_demo_profile";

type DemoProfileCookie = Partial<
  Pick<
    ProfileSummary,
    "firstName" | "lastName" | "name" | "email" | "birthDate" | "phoneNumber" | "avatarUrl"
  >
>;

function parseDemoProfileCookie(value: string | undefined): DemoProfileCookie {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed ? parsed : {};
  } catch {
    return {};
  }
}

export async function getStoredDemoProfile(userId = "user-alex") {
  const baseProfile = getDemoProfile(userId);
  const cookieStore = await cookies();
  const overrides = parseDemoProfileCookie(cookieStore.get(DEMO_PROFILE_COOKIE)?.value);

  return {
    ...baseProfile,
    ...overrides,
    name:
      overrides.name ||
      [overrides.firstName || baseProfile.firstName, overrides.lastName || baseProfile.lastName]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      baseProfile.name
  };
}

export async function setStoredDemoProfile(
  profile: Pick<
    ProfileSummary,
    "firstName" | "lastName" | "email" | "birthDate" | "phoneNumber" | "avatarUrl"
  >
) {
  const cookieStore = await cookies();
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim();

  const payload: DemoProfileCookie = {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    birthDate: profile.birthDate,
    phoneNumber: profile.phoneNumber,
    avatarUrl: profile.avatarUrl,
    name: fullName || getDemoProfile().name
  };

  cookieStore.set(DEMO_PROFILE_COOKIE, JSON.stringify(payload), {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30
  });
}
