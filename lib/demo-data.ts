export type ActivityCard = {
  id: string;
  title: string;
  summary: string;
  startsAt: string;
  city: string;
  ageRange: "18-25" | "25-35" | "35-50" | "50+";
  heroImageUrl: string;
  hostUserId?: string;
  requiresApproval?: boolean;
  participantCount: number;
  maxParticipants: number;
  familiarityLabel?: string;
  joined?: boolean;
};

export type ProfileSummary = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  birthDate: string;
  role?: "member" | "host" | "admin";
  avatarUrl: string;
};

const profiles: ProfileSummary[] = [
  {
    id: "user-alex",
    firstName: "Alex",
    lastName: "Rivera Soler",
    name: "Alex Rivera",
    email: "alex@example.com",
    birthDate: "1992-04-18",
    role: "admin",
    avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Alex"
  },
  {
    id: "user-marta",
    firstName: "Marta",
    lastName: "Diaz Costa",
    name: "Marta Diaz",
    email: "marta@example.com",
    birthDate: "1990-09-10",
    role: "member",
    avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Marta"
  },
  {
    id: "user-lucas",
    firstName: "Lucas",
    lastName: "Moreno Vidal",
    name: "Lucas Moreno",
    email: "lucas@example.com",
    birthDate: "1988-12-03",
    role: "member",
    avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas"
  },
  {
    id: "user-elena",
    firstName: "Elena",
    lastName: "Vega Serra",
    name: "Elena Vega",
    email: "elena@example.com",
    birthDate: "1994-01-26",
    role: "member",
    avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Elena"
  }
];

const baseActivities: ActivityCard[] = [
  {
    id: "cena-social",
    title: "Sopar entre desconeguts que volen sentir-se com entre coneguts",
    summary:
      "Un sopar guiat, amb ritme tranquil i converses facils, pensat per trencar el gel sense forcar res.",
    startsAt: "2026-03-27T19:30:00.000Z",
    city: "Madrid",
    ageRange: "25-35",
    hostUserId: "user-alex",
    requiresApproval: false,
    heroImageUrl:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    participantCount: 8,
    maxParticipants: 10,
    familiarityLabel: "Potser ja coneixes 2 persones"
  },
  {
    id: "coffee-walk",
    title: "Passeig amb cafe per coneixer gent sense haver d'impressionar ningu",
    summary:
      "Una caminada suau amb parada a una cafeteria bonica, ideal per a primeres vegades a Konexa.",
    startsAt: "2026-03-28T17:45:00.000Z",
    city: "Madrid",
    ageRange: "18-25",
    hostUserId: "user-alex",
    requiresApproval: true,
    heroImageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
    participantCount: 6,
    maxParticipants: 8,
    familiarityLabel: "Pensat per a persones que venen per primer cop"
  },
  {
    id: "cooking-lab",
    title: "Taller de cuina on l'activitat fa facil que la conversa aparegui sola",
    summary:
      "Cuina compartida, equips petits i taula final conjunta per crear complicitat sense pressio.",
    startsAt: "2026-03-29T11:00:00.000Z",
    city: "Madrid",
    ageRange: "35-50",
    hostUserId: "user-alex",
    requiresApproval: false,
    heroImageUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    participantCount: 9,
    maxParticipants: 10,
    familiarityLabel: "Hi ha 3 persones que ja han repetit"
  },
  {
    id: "creative-club",
    title: "Club creatiu per a qui prefereix plans tranquils amb bona conversa",
    summary:
      "Collage, dinamica lleugera i una atmosfera serena per coneixer gent sense soroll ni presses.",
    startsAt: "2026-03-30T16:30:00.000Z",
    city: "Madrid",
    ageRange: "50+",
    hostUserId: "user-alex",
    requiresApproval: false,
    heroImageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    participantCount: 7,
    maxParticipants: 8,
    familiarityLabel: "Ambient suau i arribada acompanyada"
  },
  {
    id: "vermut-sunday",
    title: "Vermut de diumenge per reconnectar amb cares que ja et sonen",
    summary:
      "Una trobada de migdia per repetir amb gent coneguda i deixar que la conversa flueixi sense esforc.",
    startsAt: "2026-03-15T12:30:00.000Z",
    city: "Madrid",
    ageRange: "35-50",
    hostUserId: "user-alex",
    requiresApproval: false,
    heroImageUrl:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=80",
    participantCount: 8,
    maxParticipants: 10,
    familiarityLabel: "Ideal si et venen de gust cares repetides"
  }
];

const bookings = [
  { userId: "user-alex", activityId: "cena-social", status: "confirmed" },
  { userId: "user-alex", activityId: "coffee-walk", status: "pending" },
  { userId: "user-alex", activityId: "vermut-sunday", status: "confirmed" },
  { userId: "user-marta", activityId: "cena-social", status: "confirmed" },
  { userId: "user-marta", activityId: "vermut-sunday", status: "confirmed" },
  { userId: "user-lucas", activityId: "cena-social", status: "confirmed" },
  { userId: "user-lucas", activityId: "cooking-lab", status: "confirmed" },
  { userId: "user-elena", activityId: "creative-club", status: "confirmed" },
  { userId: "user-elena", activityId: "vermut-sunday", status: "confirmed" }
];

export function getDemoHomepageActivities() {
  return baseActivities.slice(0, 4).map((activity) => ({
    ...activity,
    joined: bookings.some(
      (booking) => booking.userId === "user-alex" && booking.activityId === activity.id
    )
  }));
}

export function getDemoProfile(userId = "user-alex") {
  return profiles.find((profile) => profile.id === userId) || profiles[0];
}

export function getDemoDashboard(userId = "user-alex") {
  const upcomingActivities = baseActivities.filter(
    (activity) =>
      bookings.some(
        (booking) =>
          booking.userId === userId &&
          booking.activityId === activity.id &&
          booking.status === "confirmed"
      ) &&
      new Date(activity.startsAt) > new Date("2026-03-25T00:00:00.000Z")
  );

  const pendingActivities = baseActivities.filter(
    (activity) =>
      bookings.some(
        (booking) =>
          booking.userId === userId &&
          booking.activityId === activity.id &&
          booking.status === "pending"
      ) &&
      new Date(activity.startsAt) > new Date("2026-03-25T00:00:00.000Z")
  );

  const pastActivities = baseActivities.filter(
    (activity) =>
      bookings.some(
        (booking) =>
          booking.userId === userId &&
          booking.activityId === activity.id &&
          booking.status === "confirmed"
      ) &&
      new Date(activity.startsAt) <= new Date("2026-03-25T00:00:00.000Z")
  );

  const sharedConnections = profiles
    .filter((profile) => profile.id !== userId)
    .map((profile) => {
      const sharedActivities = baseActivities
        .filter(
          (activity) =>
            bookings.some((booking) => booking.userId === userId && booking.activityId === activity.id) &&
            bookings.some(
              (booking) => booking.userId === profile.id && booking.activityId === activity.id
            )
        )
        .map((activity) => activity.title.split(" ").slice(0, 2).join(" "));

      return {
        userId: profile.id,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        sharedActivitiesCount: sharedActivities.length,
        sharedActivities
      };
    })
    .filter((connection) => connection.sharedActivitiesCount > 0);

  return {
    profile: getDemoProfile(userId),
    upcomingActivities,
    pendingActivities,
    pastActivities,
    sharedConnections
  };
}

export function getDemoActivityDetail(id: string, viewerId = "user-alex") {
  const activity = baseActivities.find((entry) => entry.id === id);

  if (!activity) {
    return null;
  }

  const participants = bookings
    .filter((booking) => booking.activityId === id)
    .map((booking) => getDemoProfile(booking.userId))
    .map((profile) => {
      const sharedActivities = baseActivities
        .filter(
          (entry) =>
            entry.id !== id &&
            bookings.some((booking) => booking.userId === viewerId && booking.activityId === entry.id) &&
            bookings.some((booking) => booking.userId === profile.id && booking.activityId === entry.id)
        )
        .map((entry) => entry.title.split(" ").slice(0, 2).join(" "));

      return {
        id: profile.id,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        alreadyKnow: profile.id !== viewerId && sharedActivities.length > 0,
        sharedActivities
      };
    });

  return {
    ...activity,
    participants,
    knownParticipantsCount: participants.filter((participant) => participant.alreadyKnow).length,
    viewerHasJoined: bookings.some(
      (booking) => booking.userId === viewerId && booking.activityId === activity.id
    )
  };
}

export function getDemoPendingApprovals(userId = "user-alex") {
  const profile = getDemoProfile(userId);
  if (profile.role !== "admin" && profile.role !== "host") {
    return [];
  }

  return bookings
    .filter((booking) => booking.status === "pending")
    .map((booking) => {
      const activity = baseActivities.find((entry) => entry.id === booking.activityId);
      const attendee = getDemoProfile(booking.userId);
      if (!activity) {
        return null;
      }
      return {
        activityId: activity.id,
        activityTitle: activity.title,
        activityDate: activity.startsAt,
        attendeeId: attendee.id,
        attendeeName: attendee.name,
        attendeeAvatarUrl: attendee.avatarUrl
      };
    })
    .filter(Boolean);
}
