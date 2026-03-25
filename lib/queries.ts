import { cache } from "react";
import { getStoredDemoProfile } from "./demo-profile";
import {
  getDemoActivityDetail,
  getDemoDashboard,
  getDemoHomepageActivities,
  getDemoPendingApprovals
} from "./demo-data";
import { createSupabaseServerClient } from "./supabase/server";

const fallbackAgeRanges: Record<string, "18-25" | "25-35" | "35-50" | "50+"> = {
  "cena-social": "25-35",
  "coffee-walk": "18-25",
  "cooking-lab": "35-50",
  "creative-club": "50+",
  "vermut-sunday": "35-50"
};

type QueryActivityCard = {
  id: string;
  title: string;
  summary: string;
  starts_at: string;
  city: string;
  age_range?: "18-25" | "25-35" | "35-50" | "50+" | null;
  hero_image_url: string;
  host_user_id?: string | null;
  requires_approval?: boolean;
  participant_count: number;
  max_participants: number;
};

type QueryBookingRow = {
  activity_id: string;
  status: "pending" | "confirmed" | "cancelled";
};

type QueryConnectionRow = {
  connected_user_id: string;
  shared_activities_count: number;
};

type QueryConnectionActivityRow = {
  connected_user_id: string;
  activity_id: string;
};

type QueryProfileLite = {
  id: string;
  full_name: string;
  avatar_url: string;
};

type QueryActivityLite = {
  id: string;
  title: string;
  starts_at?: string;
  host_user_id?: string | null;
};

type QueryParticipantRow = {
  user_id: string;
};

type DetailParticipant = {
  id: string;
  name: string;
  avatarUrl: string;
  alreadyKnow: boolean;
  sharedActivities: string[];
};

export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const profile = await getStoredDemoProfile();
    return {
      id: profile.id,
      email: profile.email,
      user_metadata: {
        full_name: profile.name,
        first_name: profile.firstName,
        last_name: profile.lastName,
        birth_date: profile.birthDate,
        role: profile.role || "admin",
        avatar_url: profile.avatarUrl
      }
    };
  }

  const { data } = await supabase.auth.getUser();
  return data.user;
});

export const getHomepageActivities = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();

  if (!supabase) {
    return getDemoHomepageActivities();
  }
  const db = supabase as any;

  const { data, error } = await db
    .from("activity_cards")
    .select("id,title,summary,starts_at,city,age_range,hero_image_url,host_user_id,requires_approval,participant_count,max_participants")
    .order("starts_at", { ascending: true })
    .limit(4);

  if (error || !data) {
    return getDemoHomepageActivities();
  }

  const joinedRows =
    user && data.length > 0
      ? (
          await db
            .from("activity_participants")
            .select("activity_id,status")
            .eq("user_id", user.id)
            .in(
              "activity_id",
              data.map((activity: QueryActivityCard) => activity.id)
            )
        ).data || []
      : [];

  const joinedSet = new Set(
    joinedRows
      .filter((row: QueryBookingRow) => row.status === "confirmed" || row.status === "pending")
      .map((row: QueryBookingRow) => row.activity_id)
  );

  return data.map((activity: QueryActivityCard) => ({
    id: activity.id,
    title: activity.title,
    summary: activity.summary,
    startsAt: activity.starts_at,
    city: activity.city,
    ageRange: activity.age_range || fallbackAgeRanges[activity.id] || "25-35",
    heroImageUrl: activity.hero_image_url,
    participantCount: activity.participant_count,
    maxParticipants: activity.max_participants,
    familiarityLabel: "Shared connections available after login",
    joined: joinedSet.has(activity.id)
  }));
});

export const getProfileDashboard = cache(async (userId: string) => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const dashboard = getDemoDashboard(userId);
    return {
      ...dashboard,
      profile: await getStoredDemoProfile(userId)
    };
  }
  const db = supabase as any;

  const now = new Date().toISOString();

  const [profileResult, bookingResult, connectionsResult, sharedActivitiesResult] = await Promise.all([
    db
      .from("profiles")
      .select("id,first_name,last_name,full_name,birth_date,role,avatar_url")
      .eq("id", userId)
      .single(),
    db
      .from("activity_participants")
      .select("activity_id,status")
      .eq("user_id", userId),
    db
      .from("user_connections")
      .select("connected_user_id,shared_activities_count")
      .eq("user_id", userId)
      .order("shared_activities_count", { ascending: false }),
    db
      .from("connection_activities")
      .select("connected_user_id,activity_id")
      .eq("user_id", userId)
  ]);

  if (profileResult.error || !profileResult.data) {
    return getDemoDashboard(userId);
  }

  const activityIds = (bookingResult.data || []).map((row: QueryBookingRow) => row.activity_id);
  const connectedIds = (connectionsResult.data || []).map((row: QueryConnectionRow) => row.connected_user_id);
  const sharedActivityIds = (sharedActivitiesResult.data || []).map((row: QueryConnectionActivityRow) => row.activity_id);

  const [activityCardsResult, connectionProfilesResult, sharedActivitiesCatalogResult] =
    await Promise.all([
      activityIds.length > 0
        ? db
            .from("activity_cards")
            .select("id,title,summary,starts_at,city,hero_image_url,host_user_id,requires_approval,participant_count,max_participants")
            .in("id", activityIds)
        : Promise.resolve({ data: [], error: null }),
      connectedIds.length > 0
        ? db.from("profiles").select("id,full_name,avatar_url").in("id", connectedIds)
        : Promise.resolve({ data: [], error: null }),
      sharedActivityIds.length > 0
        ? db.from("activities").select("id,title").in("id", sharedActivityIds)
        : Promise.resolve({ data: [], error: null })
    ]);

  const activityCards = (activityCardsResult.data || []) as QueryActivityCard[];
  const bookingStatusByActivity = new Map(
    (bookingResult.data || []).map((row: QueryBookingRow) => [row.activity_id, row.status])
  );
  const sharedActivitiesCatalog = new Map<string, string>(
    (sharedActivitiesCatalogResult.data || []).map((activity: QueryActivityLite) => [activity.id, activity.title])
  );
  const profileCatalog = new Map<string, QueryProfileLite>(
    (connectionProfilesResult.data || []).map((profile: QueryProfileLite) => [profile.id, profile])
  );

  const sharedTitlesByUser = new Map<string, string[]>();
  for (const row of (sharedActivitiesResult.data || []) as QueryConnectionActivityRow[]) {
    const key = row.connected_user_id;
    const titles = sharedTitlesByUser.get(key) || [];
    const title = sharedActivitiesCatalog.get(row.activity_id) as string | undefined;
    if (title) {
      titles.push(title);
      sharedTitlesByUser.set(key, titles);
    }
  }

  const mapActivity = (activity: {
    id: string;
    title: string;
    summary: string;
    starts_at: string;
    city: string;
    hero_image_url: string;
    participant_count: number;
    max_participants: number;
  }) => ({
    id: activity.id,
    title: activity.title,
    summary: activity.summary,
    startsAt: activity.starts_at,
    city: activity.city,
    heroImageUrl: activity.hero_image_url,
    participantCount: activity.participant_count,
    maxParticipants: activity.max_participants
  });

  const upcomingActivities = activityCards
    .filter(
      (activity: QueryActivityCard) =>
        activity.starts_at > now && bookingStatusByActivity.get(activity.id) === "confirmed"
    )
    .sort((left: QueryActivityCard, right: QueryActivityCard) => left.starts_at.localeCompare(right.starts_at))
    .map(mapActivity);

  const pendingActivities = activityCards
    .filter(
      (activity: QueryActivityCard) =>
        activity.starts_at > now && bookingStatusByActivity.get(activity.id) === "pending"
    )
    .sort((left: QueryActivityCard, right: QueryActivityCard) => left.starts_at.localeCompare(right.starts_at))
    .map(mapActivity);

  const pastActivities = activityCards
    .filter(
      (activity: QueryActivityCard) =>
        activity.starts_at <= now && bookingStatusByActivity.get(activity.id) === "confirmed"
    )
    .sort((left: QueryActivityCard, right: QueryActivityCard) => right.starts_at.localeCompare(left.starts_at))
    .map(mapActivity);

  return {
    profile: {
      id: profileResult.data.id,
      firstName: profileResult.data.first_name || profileResult.data.full_name.split(" ")[0] || "",
      lastName:
        profileResult.data.last_name ||
        profileResult.data.full_name.split(" ").slice(1).join(" "),
      name: profileResult.data.full_name,
      email: (await getCurrentUser())?.email || "",
      birthDate: profileResult.data.birth_date || "",
      role: profileResult.data.role || "member",
      avatarUrl: profileResult.data.avatar_url
    },
    upcomingActivities,
    pendingActivities,
    pastActivities,
    sharedConnections: (connectionsResult.data || []).map((connection: QueryConnectionRow) => ({
      userId: connection.connected_user_id,
      name: profileCatalog.get(connection.connected_user_id)?.full_name || "Unknown user",
      avatarUrl:
        profileCatalog.get(connection.connected_user_id)?.avatar_url ||
        "https://api.dicebear.com/9.x/lorelei/svg?seed=Unknown",
      sharedActivitiesCount: connection.shared_activities_count,
      sharedActivities: sharedTitlesByUser.get(connection.connected_user_id) || []
    }))
  };
});

export const getPendingApprovals = cache(async (userId: string) => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getDemoPendingApprovals(userId);
  }
  const db = supabase as any;

  const [profileResult, pendingResult, profilesResult, activitiesResult] = await Promise.all([
    db.from("profiles").select("role").eq("id", userId).single(),
    db
      .from("activity_participants")
      .select("activity_id,user_id,status")
      .eq("status", "pending"),
    db.from("profiles").select("id,full_name,avatar_url"),
    db.from("activities").select("id,title,starts_at,host_user_id")
  ]);

  const role = profileResult.data?.role || "member";
  const activities = (activitiesResult.data || []).filter(
    (activity: QueryActivityLite) => role === "admin" || activity.host_user_id === userId
  );
  const allowedIds = new Set(activities.map((activity: QueryActivityLite) => activity.id));
  const activityMap = new Map<string, QueryActivityLite>(
    activities.map((activity: QueryActivityLite) => [activity.id, activity])
  );
  const profileMap = new Map<string, QueryProfileLite>(
    (profilesResult.data || []).map((profile: QueryProfileLite) => [profile.id, profile])
  );

  return (pendingResult.data || [])
    .filter((item: QueryParticipantRow & { activity_id: string }) => allowedIds.has(item.activity_id))
    .map((item: QueryParticipantRow & { activity_id: string }) => ({
      activityId: item.activity_id,
      activityTitle: activityMap.get(item.activity_id)?.title || "Activity",
      activityDate: activityMap.get(item.activity_id)?.starts_at || "",
      attendeeId: item.user_id,
      attendeeName: profileMap.get(item.user_id)?.full_name || "User",
      attendeeAvatarUrl:
        profileMap.get(item.user_id)?.avatar_url ||
        "https://api.dicebear.com/9.x/lorelei/svg?seed=Unknown"
    }));
});

export const getActivityDetail = cache(async (activityId: string, viewerId: string | null) => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getDemoActivityDetail(activityId, viewerId || "user-alex");
  }
  const db = supabase as any;

  const [activityResult, participantsResult, sharedActivitiesResult] = await Promise.all([
    db
      .from("activity_cards")
      .select("id,title,summary,starts_at,city,hero_image_url,participant_count,max_participants")
      .eq("id", activityId)
      .single(),
    db.from("activity_participants").select("user_id").eq("activity_id", activityId),
    viewerId
      ? db
          .from("connection_activities")
          .select("connected_user_id,activity_id")
          .eq("user_id", viewerId)
      : Promise.resolve({ data: [], error: null })
  ]);

  if (activityResult.error || !activityResult.data) {
    return null;
  }

  const participantIds = (participantsResult.data || []).map((row: QueryParticipantRow) => row.user_id);
  const sharedActivityIds = (sharedActivitiesResult.data || []).map((row: QueryConnectionActivityRow) => row.activity_id);

  const [profileResult, activitiesCatalogResult] = await Promise.all([
    participantIds.length > 0
      ? db.from("profiles").select("id,full_name,avatar_url").in("id", participantIds)
      : Promise.resolve({ data: [], error: null }),
    sharedActivityIds.length > 0
      ? db.from("activities").select("id,title").in("id", sharedActivityIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  const profileCatalog = new Map<string, QueryProfileLite>(
    (profileResult.data || []).map((profile: QueryProfileLite) => [profile.id, profile])
  );
  const activityCatalog = new Map<string, string>(
    (activitiesCatalogResult.data || []).map((activity: QueryActivityLite) => [activity.id, activity.title])
  );

  const sharedMap = new Map<string, string[]>();
  for (const row of (sharedActivitiesResult.data || []) as QueryConnectionActivityRow[]) {
    const titles = sharedMap.get(row.connected_user_id) || [];
    const title = activityCatalog.get(row.activity_id) as string | undefined;
    if (title) {
      titles.push(title);
      sharedMap.set(row.connected_user_id, titles);
    }
  }

  const participants = (participantsResult.data || []).map((row: QueryParticipantRow): DetailParticipant => {
    const sharedActivities = sharedMap.get(row.user_id) || [];
    const profile = profileCatalog.get(row.user_id);
    return {
      id: row.user_id,
      name: profile?.full_name || "Unknown user",
      avatarUrl:
        profile?.avatar_url || "https://api.dicebear.com/9.x/lorelei/svg?seed=Unknown",
      alreadyKnow: sharedActivities.length > 0,
      sharedActivities: sharedActivities.slice(0, 3)
    };
  });

  return {
    id: activityResult.data.id,
    title: activityResult.data.title,
    summary: activityResult.data.summary,
    startsAt: activityResult.data.starts_at,
    city: activityResult.data.city,
    heroImageUrl: activityResult.data.hero_image_url,
    participantCount: activityResult.data.participant_count,
    maxParticipants: activityResult.data.max_participants,
    participants,
    knownParticipantsCount: participants.filter((participant: DetailParticipant) => participant.alreadyKnow).length,
    viewerHasJoined: viewerId
      ? participants.some((participant: DetailParticipant) => participant.id === viewerId)
      : false
  };
});
