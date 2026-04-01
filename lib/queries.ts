import { cache } from "react";
import { getStoredDemoProfile } from "./demo-profile";
import {
  getDemoAdminDashboard,
  getDemoActivityDetail,
  getDemoDashboard,
  getDemoHomepageContent,
  getDemoHomepageActivities,
  getDemoPendingApprovals
} from "./demo-data";
import { createSupabaseAdminClient } from "./supabase/admin";
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
  price?: string | null;
  starts_at: string;
  city: string;
  age_range?: "18-25" | "25-35" | "35-50" | "50+" | null;
  hero_image_url: string;
  image_focus_x?: number | null;
  image_focus_y?: number | null;
  image_zoom?: number | null;
  host_user_id?: string | null;
  host_name?: string | null;
  host_avatar_url?: string | null;
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
  role?: "member" | "host" | "admin";
  phone_number?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  birth_date?: string | null;
  created_at?: string;
};

type QueryActivityLite = {
  id: string;
  title: string;
  starts_at?: string;
  host_user_id?: string | null;
};

type QueryParticipantRow = {
  user_id: string;
  status?: "pending" | "confirmed" | "cancelled";
  activity_id?: string;
  request_message?: string | null;
  phone_number?: string | null;
  whatsapp_opt_in?: boolean;
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
    .select("id,title,summary,price,starts_at,city,age_range,hero_image_url,image_focus_x,image_focus_y,image_zoom,host_user_id,host_name,host_avatar_url,requires_approval,participant_count,max_participants")
    .order("starts_at", { ascending: true })
    .limit(4);

  if (error || !data) {
    return getDemoHomepageActivities();
  }

  const hostIds = Array.from(
    new Set(
      data
        .map((activity: QueryActivityCard) => activity.host_user_id)
        .filter(Boolean)
    )
  ) as string[];

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

  const [hostProfilesResult] = await Promise.all([
    hostIds.length > 0
      ? db.from("profiles").select("id,full_name,avatar_url").in("id", hostIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  const bookingStatusByActivity = new Map(
    joinedRows
      .filter((row: QueryBookingRow) => row.status === "confirmed" || row.status === "pending")
      .map((row: QueryBookingRow) => [row.activity_id, row.status as "pending" | "confirmed"])
  );
  const hostProfileMap = new Map<string, QueryProfileLite>(
    (hostProfilesResult.data || []).map((profile: QueryProfileLite) => [profile.id, profile])
  );

  return data.map((activity: QueryActivityCard) => ({
    id: activity.id,
    title: activity.title,
    summary: activity.summary,
    price: activity.price || "",
    startsAt: activity.starts_at,
    city: "Girona",
    ageRange: activity.age_range || fallbackAgeRanges[activity.id] || "25-35",
    heroImageUrl: activity.hero_image_url,
    imageFocusX: activity.image_focus_x ?? 50,
    imageFocusY: activity.image_focus_y ?? 50,
    imageZoom: activity.image_zoom ?? 1,
    participantCount: activity.participant_count,
    maxParticipants: activity.max_participants,
    familiarityLabel: "Shared connections available after login",
    joined: bookingStatusByActivity.get(activity.id) === "confirmed",
    bookingStatus: bookingStatusByActivity.get(activity.id) || null,
    host: activity.host_user_id
      ? {
          name: hostProfileMap.get(activity.host_user_id)?.full_name || "Host",
          avatarUrl:
            hostProfileMap.get(activity.host_user_id)?.avatar_url ||
            `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(activity.host_user_id)}`
        }
      : activity.host_name
        ? {
            name: activity.host_name,
            avatarUrl:
              activity.host_avatar_url ||
              `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(activity.host_name)}`
          }
      : undefined
  }));
});

export const getHomepageContent = cache(async () => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getDemoHomepageContent();
  }
  const db = supabase as any;

  const { data } = await db
    .from("homepage_content")
    .select("hero_carousel_images,hosts,memories_video_url,memories_items")
    .eq("id", "home")
    .maybeSingle();

  if (!data) {
    return getDemoHomepageContent();
  }

  return {
    heroCarouselImages:
      Array.isArray(data.hero_carousel_images) && data.hero_carousel_images.length > 0
        ? data.hero_carousel_images
        : getDemoHomepageContent().heroCarouselImages,
    hosts:
      Array.isArray(data.hosts) && data.hosts.length > 0
        ? data.hosts
        : getDemoHomepageContent().hosts,
    memoriesVideoUrl:
      data.memories_video_url || getDemoHomepageContent().memoriesVideoUrl,
    memoriesItems:
      Array.isArray(data.memories_items) && data.memories_items.length > 0
        ? data.memories_items
        : getDemoHomepageContent().memoriesItems
  };
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
      .select("id,first_name,last_name,full_name,birth_date,phone_number,role,avatar_url")
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
            .select("id,title,summary,price,starts_at,city,hero_image_url,image_focus_x,image_focus_y,image_zoom,host_user_id,host_name,host_avatar_url,requires_approval,participant_count,max_participants")
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
    price?: string | null;
    starts_at: string;
    city: string;
    hero_image_url: string;
    image_focus_x?: number | null;
    image_focus_y?: number | null;
    image_zoom?: number | null;
    participant_count: number;
    max_participants: number;
  }) => ({
    id: activity.id,
    title: activity.title,
    summary: activity.summary,
    price: activity.price || "",
    startsAt: activity.starts_at,
    city: activity.city,
    heroImageUrl: activity.hero_image_url,
    imageFocusX: activity.image_focus_x ?? 50,
    imageFocusY: activity.image_focus_y ?? 50,
    imageZoom: activity.image_zoom ?? 1,
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
      phoneNumber: profileResult.data.phone_number || "",
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
    (activity: QueryActivityLite) => role === "admin"
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

export const getAdminDashboard = cache(async (userId: string) => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getDemoAdminDashboard(userId);
  }
  const db = supabase as any;

  const [profileResult, activitiesResult, participantsResult, profilesResult, homepageContentResult] = await Promise.all([
    db.from("profiles").select("id,role").eq("id", userId).single(),
    db
      .from("activity_cards")
      .select("id,title,summary,price,starts_at,city,age_range,hero_image_url,image_focus_x,image_focus_y,image_zoom,host_user_id,host_name,host_avatar_url,requires_approval,participant_count,max_participants")
      .order("starts_at", { ascending: true }),
    db
      .from("activity_participants")
      .select("activity_id,user_id,status,request_message,phone_number,whatsapp_opt_in"),
    db.from("profiles").select("id,first_name,last_name,full_name,birth_date,avatar_url,role,phone_number,created_at"),
    db
      .from("homepage_content")
      .select("hero_carousel_images,hosts,memories_video_url,memories_items")
      .eq("id", "home")
      .maybeSingle()
  ]);

  if (profileResult.data?.role !== "admin") {
    return null;
  }

  const hostProfiles = (profilesResult.data || []) as QueryProfileLite[];
  const hostMap = new Map(hostProfiles.map((profile) => [profile.id, profile]));
  const pendingRows = (participantsResult.data || []) as Array<
    QueryParticipantRow & {
      activity_id: string;
      request_message?: string | null;
      phone_number?: string | null;
      whatsapp_opt_in?: boolean;
    }
  >;
  const activityMap = new Map(
    ((activitiesResult.data || []) as QueryActivityCard[]).map((activity) => [activity.id, activity])
  );

  const admin = process.env.SUPABASE_SERVICE_ROLE_KEY ? createSupabaseAdminClient() : null;
  const authUsers =
    admin
      ? await admin.auth.admin.listUsers()
      : null;
  const emailMap = new Map(
    (authUsers?.data?.users || []).map((entry) => [entry.id, entry.email || ""])
  );

  const participantCountsByActivity = new Map<
    string,
    { pendingCount: number; confirmedCount: number }
  >();
  const attendeesByActivity = new Map<
    string,
    Array<{
      id: string;
      name: string;
      email: string;
      phoneNumber: string;
      avatarUrl: string;
      status: "pending" | "confirmed" | "cancelled";
      whatsappOptIn: boolean;
      requestMessage: string;
    }>
  >();
  for (const row of pendingRows) {
    const current = participantCountsByActivity.get(row.activity_id) || {
      pendingCount: 0,
      confirmedCount: 0
    };
    if (row.status === "pending") {
      current.pendingCount += 1;
    }
    if (row.status === "confirmed") {
      current.confirmedCount += 1;
    }
    participantCountsByActivity.set(row.activity_id, current);

    const attendeeProfile = hostMap.get(row.user_id);
    const attendeeList = attendeesByActivity.get(row.activity_id) || [];
    attendeeList.push({
      id: row.user_id,
      name: attendeeProfile?.full_name || "User",
      email: emailMap.get(row.user_id) || "",
      phoneNumber: row.phone_number || attendeeProfile?.phone_number || "",
      avatarUrl:
        attendeeProfile?.avatar_url || "https://api.dicebear.com/9.x/lorelei/svg?seed=Unknown",
      status: row.status || "pending",
      whatsappOptIn: Boolean(row.whatsapp_opt_in),
      requestMessage: row.request_message || ""
    });
    attendeesByActivity.set(row.activity_id, attendeeList);
  }

  return {
    profile: profileResult.data,
    users: hostProfiles
      .map((profile) => ({
        id: profile.id,
        name: profile.full_name,
        avatarUrl: profile.avatar_url,
        role: profile.role || "member",
        phoneNumber: profile.phone_number || "",
        email: emailMap.get(profile.id) || "",
        createdAt: profile.created_at || ""
      }))
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    hosts: hostProfiles
      .filter((profile) => profile.role === "host" || profile.role === "admin")
      .map((profile) => ({
        id: profile.id,
        name: profile.full_name,
        role: profile.role || "member",
        avatarUrl: profile.avatar_url
      })),
    activities: ((activitiesResult.data || []) as QueryActivityCard[]).map((activity) => {
      const counts = participantCountsByActivity.get(activity.id) || {
        pendingCount: 0,
        confirmedCount: 0
      };
      return {
        id: activity.id,
        title: activity.title,
        summary: activity.summary,
        price: activity.price || "",
        startsAt: activity.starts_at,
        city: activity.city,
        ageRange: activity.age_range || fallbackAgeRanges[activity.id] || "25-35",
        heroImageUrl: activity.hero_image_url,
        imageFocusX: activity.image_focus_x ?? 50,
        imageFocusY: activity.image_focus_y ?? 50,
        imageZoom: activity.image_zoom ?? 1,
        hostUserId: activity.host_user_id || "",
        hostName:
          activity.host_name ||
          (activity.host_user_id ? hostMap.get(activity.host_user_id)?.full_name || "Host" : "Sense host"),
        hostAvatarUrl:
          activity.host_avatar_url ||
          (activity.host_user_id ? hostMap.get(activity.host_user_id)?.avatar_url || "" : ""),
        requiresApproval: Boolean(activity.requires_approval),
        participantCount: activity.participant_count,
        maxParticipants: activity.max_participants,
        pendingCount: counts.pendingCount,
        confirmedCount: counts.confirmedCount,
        attendees: attendeesByActivity.get(activity.id) || []
      };
    }),
    pendingApprovals: pendingRows
      .filter((row) => row.status === "pending")
      .map((row) => ({
        activityId: row.activity_id,
        activityTitle: activityMap.get(row.activity_id)?.title || "Activity",
        activityDate: activityMap.get(row.activity_id)?.starts_at || "",
        attendeeId: row.user_id,
        attendeeName: hostMap.get(row.user_id)?.full_name || "User",
        attendeeAvatarUrl:
          hostMap.get(row.user_id)?.avatar_url ||
          "https://api.dicebear.com/9.x/lorelei/svg?seed=Unknown",
        attendeeEmail: emailMap.get(row.user_id) || "",
        attendeePhoneNumber: row.phone_number || hostMap.get(row.user_id)?.phone_number || "",
        requestMessage: row.request_message || "",
        whatsappOptIn: Boolean(row.whatsapp_opt_in)
      })),
    homepageContent: homepageContentResult.data
      ? {
          heroCarouselImages:
            Array.isArray(homepageContentResult.data.hero_carousel_images) &&
            homepageContentResult.data.hero_carousel_images.length > 0
              ? homepageContentResult.data.hero_carousel_images
              : getDemoHomepageContent().heroCarouselImages,
          hosts:
            Array.isArray(homepageContentResult.data.hosts) &&
            homepageContentResult.data.hosts.length > 0
              ? homepageContentResult.data.hosts
              : getDemoHomepageContent().hosts,
          memoriesVideoUrl:
            homepageContentResult.data.memories_video_url ||
            getDemoHomepageContent().memoriesVideoUrl,
          memoriesItems:
            Array.isArray(homepageContentResult.data.memories_items) &&
            homepageContentResult.data.memories_items.length > 0
              ? homepageContentResult.data.memories_items
              : getDemoHomepageContent().memoriesItems
        }
      : getDemoHomepageContent()
  };
});

export const getAdminUserProfile = cache(async (adminUserId: string, targetUserId: string) => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const adminProfile = await getStoredDemoProfile(adminUserId);
    if (adminProfile.role !== "admin") {
      return null;
    }

    const dashboard = getDemoDashboard(targetUserId);
    return {
      profile: dashboard.profile,
      upcomingActivities: dashboard.upcomingActivities,
      pendingActivities: dashboard.pendingActivities,
      pastActivities: dashboard.pastActivities,
      sharedConnections: dashboard.sharedConnections
    };
  }

  const db = supabase as any;
  const [adminProfileResult, targetProfileResult, bookingResult, connectionsResult, sharedActivitiesResult] =
    await Promise.all([
      db.from("profiles").select("id,role").eq("id", adminUserId).single(),
      db
        .from("profiles")
        .select("id,first_name,last_name,full_name,birth_date,phone_number,role,avatar_url,created_at")
        .eq("id", targetUserId)
        .single(),
      db.from("activity_participants").select("activity_id,status").eq("user_id", targetUserId),
      db
        .from("user_connections")
        .select("connected_user_id,shared_activities_count")
        .eq("user_id", targetUserId)
        .order("shared_activities_count", { ascending: false }),
      db
        .from("connection_activities")
        .select("connected_user_id,activity_id")
        .eq("user_id", targetUserId)
    ]);

  if (adminProfileResult.data?.role !== "admin" || targetProfileResult.error || !targetProfileResult.data) {
    return null;
  }

  const activityIds = (bookingResult.data || []).map((row: QueryBookingRow) => row.activity_id);
  const connectedIds = (connectionsResult.data || []).map((row: QueryConnectionRow) => row.connected_user_id);
  const sharedActivityIds = (sharedActivitiesResult.data || []).map((row: QueryConnectionActivityRow) => row.activity_id);

  const [activityCardsResult, connectionProfilesResult, sharedActivitiesCatalogResult] =
    await Promise.all([
      activityIds.length > 0
        ? db
            .from("activity_cards")
            .select("id,title,summary,price,starts_at,city,hero_image_url,image_focus_x,image_focus_y,image_zoom,host_user_id,requires_approval,participant_count,max_participants")
            .in("id", activityIds)
        : Promise.resolve({ data: [], error: null }),
      connectedIds.length > 0
        ? db.from("profiles").select("id,full_name,avatar_url").in("id", connectedIds)
        : Promise.resolve({ data: [], error: null }),
      sharedActivityIds.length > 0
        ? db.from("activities").select("id,title").in("id", sharedActivityIds)
        : Promise.resolve({ data: [], error: null })
    ]);

  const admin = process.env.SUPABASE_SERVICE_ROLE_KEY ? createSupabaseAdminClient() : null;
  const authUsers = admin ? await admin.auth.admin.listUsers() : null;
  const emailMap = new Map(
    (authUsers?.data?.users || []).map((entry) => [entry.id, entry.email || ""])
  );

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

  const now = new Date().toISOString();
  const mapActivity = (activity: {
    id: string;
    title: string;
    summary: string;
    price?: string | null;
    starts_at: string;
    city: string;
    hero_image_url: string;
    image_focus_x?: number | null;
    image_focus_y?: number | null;
    image_zoom?: number | null;
    participant_count: number;
    max_participants: number;
  }) => ({
    id: activity.id,
    title: activity.title,
    summary: activity.summary,
    price: activity.price || "",
    startsAt: activity.starts_at,
    city: activity.city,
    heroImageUrl: activity.hero_image_url,
    imageFocusX: activity.image_focus_x ?? 50,
    imageFocusY: activity.image_focus_y ?? 50,
    imageZoom: activity.image_zoom ?? 1,
    participantCount: activity.participant_count,
    maxParticipants: activity.max_participants
  });

  const upcomingActivities = activityCards
    .filter((activity) => activity.starts_at > now && bookingStatusByActivity.get(activity.id) === "confirmed")
    .sort((left, right) => left.starts_at.localeCompare(right.starts_at))
    .map(mapActivity);

  const pendingActivities = activityCards
    .filter((activity) => activity.starts_at > now && bookingStatusByActivity.get(activity.id) === "pending")
    .sort((left, right) => left.starts_at.localeCompare(right.starts_at))
    .map(mapActivity);

  const pastActivities = activityCards
    .filter((activity) => activity.starts_at <= now && bookingStatusByActivity.get(activity.id) === "confirmed")
    .sort((left, right) => right.starts_at.localeCompare(left.starts_at))
    .map(mapActivity);

  return {
    profile: {
      id: targetProfileResult.data.id,
      firstName:
        targetProfileResult.data.first_name ||
        targetProfileResult.data.full_name.split(" ")[0] ||
        "",
      lastName:
        targetProfileResult.data.last_name ||
        targetProfileResult.data.full_name.split(" ").slice(1).join(" "),
      name: targetProfileResult.data.full_name,
      email: emailMap.get(targetProfileResult.data.id) || "",
      birthDate: targetProfileResult.data.birth_date || "",
      phoneNumber: targetProfileResult.data.phone_number || "",
      role: targetProfileResult.data.role || "member",
      avatarUrl: targetProfileResult.data.avatar_url,
      createdAt: targetProfileResult.data.created_at || ""
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

export const getActivityDetail = cache(async (activityId: string, viewerId: string | null) => {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getDemoActivityDetail(activityId, viewerId || "user-alex");
  }
  const db = supabase as any;

  const [activityResult, participantsResult, sharedActivitiesResult] = await Promise.all([
    db
      .from("activity_cards")
      .select("id,title,summary,price,starts_at,city,hero_image_url,image_focus_x,image_focus_y,image_zoom,host_user_id,host_name,host_avatar_url,participant_count,max_participants")
      .eq("id", activityId)
      .single(),
    db
      .from("activity_participants")
      .select("user_id,status")
      .eq("activity_id", activityId)
      .neq("status", "cancelled"),
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
  const viewerBooking = viewerId
    ? (participantsResult.data || []).find(
        (row: QueryParticipantRow) => row.user_id === viewerId
      )
    : null;
  const sharedActivityIds = (sharedActivitiesResult.data || []).map((row: QueryConnectionActivityRow) => row.activity_id);

  const hostUserId = activityResult.data.host_user_id as string | null | undefined;
  const profileIdsToLoad = hostUserId
    ? Array.from(new Set([...participantIds, hostUserId]))
    : participantIds;

  const [profileResult, activitiesCatalogResult] = await Promise.all([
    profileIdsToLoad.length > 0
      ? db.from("profiles").select("id,full_name,avatar_url").in("id", profileIdsToLoad)
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
    price: activityResult.data.price || "",
    startsAt: activityResult.data.starts_at,
    city: activityResult.data.city,
    heroImageUrl: activityResult.data.hero_image_url,
    imageFocusX: activityResult.data.image_focus_x ?? 50,
    imageFocusY: activityResult.data.image_focus_y ?? 50,
    imageZoom: activityResult.data.image_zoom ?? 1,
    host: hostUserId
      ? {
          name: profileCatalog.get(hostUserId)?.full_name || "Host",
          avatarUrl:
            profileCatalog.get(hostUserId)?.avatar_url ||
            `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(hostUserId)}`
        }
      : activityResult.data.host_name
        ? {
            name: activityResult.data.host_name,
            avatarUrl:
              activityResult.data.host_avatar_url ||
              `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(activityResult.data.host_name)}`
          }
      : null,
    participantCount: activityResult.data.participant_count,
    maxParticipants: activityResult.data.max_participants,
    participants,
    knownParticipantsCount: participants.filter((participant: DetailParticipant) => participant.alreadyKnow).length,
    viewerHasJoined: Boolean(viewerBooking),
    viewerBookingStatus: viewerBooking?.status || null
  };
});
