export type ActivityCard = {
  id: string;
  title: string;
  summary: string;
  price: string;
  startsAt: string;
  city: string;
  ageRange: "18-25" | "25-35" | "35-50" | "50+";
  heroImageUrl: string;
  imageFocusX?: number;
  imageFocusY?: number;
  imageZoom?: number;
  hostUserId?: string;
  hostName?: string;
  hostAvatarUrl?: string;
  requiresApproval?: boolean;
  participantCount: number;
  maxParticipants: number;
  familiarityLabel?: string;
  joined?: boolean;
  bookingStatus?: "pending" | "confirmed" | null;
  host?: {
    name: string;
    avatarUrl: string;
  };
};

export type HomepageHostCard = {
  age: "18-25" | "25-35" | "35-50" | "50+";
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  videoUrl: string;
};

export type HomepageMemoryItem = {
  title: string;
  imageUrl: string;
};

export type HomepageContent = {
  heroCarouselImages: string[];
  hosts: HomepageHostCard[];
  memoriesVideoUrl: string;
  memoriesItems: HomepageMemoryItem[];
};

type DemoBooking = {
  userId: string;
  activityId: string;
  status: "pending" | "confirmed" | "cancelled";
  requestMessage?: string;
  phoneNumber?: string;
  whatsappOptIn?: boolean;
};

export type ProfileSummary = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  birthDate: string;
  phoneNumber?: string;
  role?: "member" | "host" | "admin";
  avatarUrl: string;
};

const profiles: ProfileSummary[] = [
  {
    id: "user-alex",
    firstName: "Sara",
    lastName: "Renart",
    name: "Sara Renart",
    email: "alex@example.com",
    birthDate: "1992-04-18",
    phoneNumber: "+34 600 111 222",
    role: "admin",
    avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Sara"
  },
  {
    id: "user-marta",
    firstName: "Ariadna",
    lastName: "Puig",
    name: "Ariadna Puig",
    email: "marta@example.com",
    birthDate: "1990-09-10",
    phoneNumber: "+34 600 222 333",
    role: "host",
    avatarUrl: "/ariadnapuig.jpg"
  },
  {
    id: "user-lucas",
    firstName: "Lucas",
    lastName: "Moreno Vidal",
    name: "Lucas Moreno",
    email: "lucas@example.com",
    birthDate: "1988-12-03",
    phoneNumber: "+34 600 333 444",
    role: "host",
    avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas"
  },
  {
    id: "user-elena",
    firstName: "Elena",
    lastName: "Vega Serra",
    name: "Elena Vega",
    email: "elena@example.com",
    birthDate: "1994-01-26",
    phoneNumber: "+34 600 444 555",
    role: "host",
    avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Elena"
  }
];

let baseActivities: ActivityCard[] = [
  {
    id: "cena-social",
    title: "Sopar entre desconeguts que volen sentir-se com entre coneguts",
    summary:
      "Un sopar guiat, amb ritme tranquil i converses facils, pensat per trencar el gel sense forcar res.",
    price: "22 EUR",
    startsAt: "2026-03-27T19:30:00.000Z",
    city: "Girona",
    ageRange: "25-35",
    hostUserId: "user-alex",
    requiresApproval: false,
    heroImageUrl:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    imageFocusX: 50,
    imageFocusY: 50,
    imageZoom: 1,
    participantCount: 8,
    maxParticipants: 10,
    familiarityLabel: "Potser ja coneixes 2 persones",
    hostName: "Sara Renart",
    hostAvatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Sara"
  },
  {
    id: "coffee-walk",
    title: "Passeig amb cafe per coneixer gent d'una manera natural",
    summary:
      "Una caminada suau amb parada a una cafeteria bonica, ideal per a primeres vegades a Konexa.",
    price: "12 EUR",
    startsAt: "2026-03-28T17:45:00.000Z",
    city: "Girona",
    ageRange: "18-25",
    hostUserId: "user-marta",
    requiresApproval: true,
    heroImageUrl:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
    imageFocusX: 50,
    imageFocusY: 50,
    imageZoom: 1,
    participantCount: 6,
    maxParticipants: 8,
    familiarityLabel: "Pensat per a persones que venen per primer cop",
    hostName: "Ariadna Puig",
    hostAvatarUrl: "/ariadnapuig.jpg"
  },
  {
    id: "cooking-lab",
    title: "Taller de cuina on l'activitat fa facil que la conversa aparegui sola",
    summary:
      "Cuina compartida, equips petits i taula final conjunta per crear complicitat de manera natural.",
    price: "28 EUR",
    startsAt: "2026-03-29T11:00:00.000Z",
    city: "Girona",
    ageRange: "35-50",
    hostUserId: "user-lucas",
    requiresApproval: false,
    heroImageUrl:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
    imageFocusX: 50,
    imageFocusY: 50,
    imageZoom: 1,
    participantCount: 9,
    maxParticipants: 10,
    familiarityLabel: "Hi ha 3 persones que ja han repetit",
    hostName: "Lucas Moreno",
    hostAvatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas"
  },
  {
    id: "creative-club",
    title: "Club creatiu per a qui prefereix plans tranquils amb bona conversa",
    summary:
      "Collage, dinamica lleugera i una atmosfera serena per coneixer gent sense soroll ni presses.",
    price: "18 EUR",
    startsAt: "2026-03-30T16:30:00.000Z",
    city: "Girona",
    ageRange: "50+",
    hostUserId: "user-elena",
    requiresApproval: false,
    heroImageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    imageFocusX: 50,
    imageFocusY: 50,
    imageZoom: 1,
    participantCount: 7,
    maxParticipants: 8,
    familiarityLabel: "Ambient suau i arribada acompanyada",
    hostName: "Elena Vega",
    hostAvatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Elena"
  },
  {
    id: "vermut-sunday",
    title: "Vermut de diumenge per reconnectar amb cares que ja et sonen",
    summary:
      "Una trobada de migdia per repetir amb gent coneguda i deixar que la conversa flueixi sense esforc.",
    price: "16 EUR",
    startsAt: "2026-03-15T12:30:00.000Z",
    city: "Girona",
    ageRange: "35-50",
    hostUserId: "user-lucas",
    requiresApproval: false,
    heroImageUrl:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=80",
    imageFocusX: 50,
    imageFocusY: 50,
    imageZoom: 1,
    participantCount: 8,
    maxParticipants: 10,
    familiarityLabel: "Ideal si et venen de gust cares repetides",
    hostName: "Lucas Moreno",
    hostAvatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas"
  }
];

let bookings: DemoBooking[] = [
  { userId: "user-alex", activityId: "cena-social", status: "confirmed" },
  {
    userId: "user-alex",
    activityId: "coffee-walk",
    status: "pending",
    requestMessage: "M'agradaria venir per coneixer gent nova a Girona.",
    phoneNumber: "+34 600 111 222",
    whatsappOptIn: true
  },
  { userId: "user-alex", activityId: "vermut-sunday", status: "confirmed" },
  { userId: "user-marta", activityId: "cena-social", status: "confirmed" },
  { userId: "user-marta", activityId: "vermut-sunday", status: "confirmed" },
  { userId: "user-lucas", activityId: "cena-social", status: "confirmed" },
  { userId: "user-lucas", activityId: "cooking-lab", status: "confirmed" },
  { userId: "user-elena", activityId: "creative-club", status: "confirmed" },
  { userId: "user-elena", activityId: "vermut-sunday", status: "confirmed" }
];

const defaultHomepageContent: HomepageContent = {
  heroCarouselImages: [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80"
  ],
  hosts: [
    {
      age: "18-25",
      name: "Ariadna Puig",
      role: "Host del grup 18-25",
      bio: "Fa de pont perquè la gent nova se senti integrada des del primer moment.",
      avatarUrl: "/ariadnapuig.jpg",
      videoUrl: "https://www.youtube.com/embed/Scxs7L0vhZ4?rel=0"
    },
    {
      age: "25-35",
      name: "Sara Renart",
      role: "Host del grup 25-35",
      bio: "Cuida l'ambient i ajuda que les converses surtin de manera natural.",
      avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Sara",
      videoUrl: "https://www.youtube.com/embed/Scxs7L0vhZ4?rel=0"
    },
    {
      age: "35-50",
      name: "Lucas Moreno",
      role: "Host del grup 35-50",
      bio: "Acompanya el grup perquè tothom se senti comode i benvingut.",
      avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas",
      videoUrl: "https://www.youtube.com/embed/Scxs7L0vhZ4?rel=0"
    },
    {
      age: "50+",
      name: "Elena Vega",
      role: "Host del grup +50",
      bio: "Transmet calma i dona suport si algu necessita un primer punt de referencia.",
      avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Elena",
      videoUrl: "https://www.youtube.com/embed/Scxs7L0vhZ4?rel=0"
    }
  ],
  memoriesVideoUrl: "https://www.youtube.com/embed/Scxs7L0vhZ4?si=Vv8H7MLegQmCj0xy",
  memoriesItems: [
    {
      title: "Sopars amb conversa facil",
      imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Passejos tranquils amb cafe",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Tallers creatius en grup petit",
      imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80"
    }
  ]
};

let homepageContent: HomepageContent = structuredClone(defaultHomepageContent);

function getParticipantCount(activityId: string) {
  return bookings.filter(
    (booking) => booking.activityId === activityId && booking.status !== "cancelled"
  ).length;
}

function withDynamicParticipantCount(activity: ActivityCard): ActivityCard {
  return {
    ...activity,
    participantCount: getParticipantCount(activity.id)
  };
}

export function cancelDemoBooking(userId: string, activityId: string) {
  bookings = bookings.map((booking) =>
    booking.userId === userId && booking.activityId === activityId
      ? { ...booking, status: "cancelled" as const }
      : booking
  );
}

export function requestDemoBooking(input: {
  userId: string;
  activityId: string;
  phoneNumber?: string;
  requestMessage?: string;
  whatsappOptIn?: boolean;
}) {
  const existing = bookings.find(
    (booking) => booking.userId === input.userId && booking.activityId === input.activityId
  );

  if (existing) {
    bookings = bookings.map((booking) =>
      booking.userId === input.userId && booking.activityId === input.activityId
        ? {
            ...booking,
            status: "pending",
            phoneNumber: input.phoneNumber || booking.phoneNumber,
            requestMessage: input.requestMessage || booking.requestMessage,
            whatsappOptIn: input.whatsappOptIn ?? booking.whatsappOptIn
          }
        : booking
    );
    return;
  }

  bookings = [
    ...bookings,
    {
      userId: input.userId,
      activityId: input.activityId,
      status: "pending",
      phoneNumber: input.phoneNumber,
      requestMessage: input.requestMessage,
      whatsappOptIn: input.whatsappOptIn ?? false
    }
  ];
}

export function getDemoHomepageActivities() {
  const bookingStatusByActivity = new Map(
    bookings
      .filter(
        (booking) => booking.userId === "user-alex" && booking.status !== "cancelled"
      )
      .map((booking) => [booking.activityId, booking.status as "pending" | "confirmed"])
  );

  return baseActivities.slice(0, 4).map((activity) => ({
    ...withDynamicParticipantCount(activity),
    joined: bookingStatusByActivity.get(activity.id) === "confirmed",
    bookingStatus: bookingStatusByActivity.get(activity.id) || null,
    host: activity.hostUserId
      ? {
          name: getDemoProfile(activity.hostUserId).name,
          avatarUrl: getDemoProfile(activity.hostUserId).avatarUrl
        }
      : undefined
  }));
}

export function getDemoHomepageContent() {
  return homepageContent;
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
  ).map(withDynamicParticipantCount);

  const pendingActivities = baseActivities.filter(
    (activity) =>
      bookings.some(
        (booking) =>
          booking.userId === userId &&
          booking.activityId === activity.id &&
          booking.status === "pending"
      ) &&
      new Date(activity.startsAt) > new Date("2026-03-25T00:00:00.000Z")
  ).map(withDynamicParticipantCount);

  const pastActivities = baseActivities.filter(
    (activity) =>
      bookings.some(
        (booking) =>
          booking.userId === userId &&
          booking.activityId === activity.id &&
          booking.status === "confirmed"
      ) &&
      new Date(activity.startsAt) <= new Date("2026-03-25T00:00:00.000Z")
  ).map(withDynamicParticipantCount);

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

  const viewerBooking = bookings.find(
    (booking) =>
      booking.userId === viewerId &&
      booking.activityId === id &&
      booking.status !== "cancelled"
  );

  const participants = bookings
    .filter((booking) => booking.activityId === id && booking.status !== "cancelled")
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
    ...withDynamicParticipantCount(activity),
    host: activity.hostUserId
      ? {
          name: getDemoProfile(activity.hostUserId).name,
          avatarUrl: getDemoProfile(activity.hostUserId).avatarUrl
        }
      : null,
    participants,
    knownParticipantsCount: participants.filter((participant) => participant.alreadyKnow).length,
    viewerHasJoined: Boolean(viewerBooking),
    viewerBookingStatus: viewerBooking?.status || null
  };
}

export function getDemoPendingApprovals(userId = "user-alex") {
  const profile = getDemoProfile(userId);
  if (profile.role !== "admin") {
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
        attendeeAvatarUrl: attendee.avatarUrl,
        attendeeEmail: attendee.email,
        attendeePhoneNumber: booking.phoneNumber || attendee.phoneNumber || "",
        requestMessage: booking.requestMessage || "",
        whatsappOptIn: Boolean(booking.whatsappOptIn)
      };
    })
    .filter(Boolean);
}

export function reviewDemoPendingApproval(
  activityId: string,
  attendeeId: string,
  decision: "confirmed" | "cancelled"
) {
  bookings = bookings.map((booking) =>
    booking.activityId === activityId && booking.userId === attendeeId
      ? { ...booking, status: decision }
      : booking
  );
}

export function upsertDemoActivity(input: {
  id?: string;
  title: string;
  summary: string;
  price: string;
  startsAt: string;
  city: string;
  ageRange: "18-25" | "25-35" | "35-50" | "50+";
  heroImageUrl: string;
  imageFocusX?: number;
  imageFocusY?: number;
  imageZoom?: number;
  hostUserId?: string;
  hostName?: string;
  hostAvatarUrl?: string;
  requiresApproval?: boolean;
  maxParticipants: number;
}) {
  const activityId = input.id || crypto.randomUUID();
  const existing = baseActivities.find((activity) => activity.id === activityId);
  const nextActivity: ActivityCard = {
    id: activityId,
    title: input.title,
    summary: input.summary,
    price: input.price,
    startsAt: input.startsAt,
    city: input.city,
    ageRange: input.ageRange,
    heroImageUrl: input.heroImageUrl,
    imageFocusX: input.imageFocusX ?? existing?.imageFocusX ?? 50,
    imageFocusY: input.imageFocusY ?? existing?.imageFocusY ?? 50,
    imageZoom: input.imageZoom ?? existing?.imageZoom ?? 1,
    hostUserId: input.hostUserId,
    hostName: input.hostName ?? existing?.hostName,
    hostAvatarUrl: input.hostAvatarUrl ?? existing?.hostAvatarUrl,
    requiresApproval: input.requiresApproval ?? false,
    participantCount: existing?.participantCount || 0,
    maxParticipants: input.maxParticipants,
    familiarityLabel: existing?.familiarityLabel
  };

  if (existing) {
    baseActivities = baseActivities.map((activity) => (activity.id === activityId ? nextActivity : activity));
  } else {
    baseActivities = [nextActivity, ...baseActivities];
  }

  return activityId;
}

export function deleteDemoActivity(activityId: string) {
  baseActivities = baseActivities.filter((activity) => activity.id !== activityId);
  bookings = bookings.filter((booking) => booking.activityId !== activityId);
}

export function updateDemoHeroCarousel(images: string[]) {
  homepageContent = {
    ...homepageContent,
    heroCarouselImages: images.filter(Boolean).slice(0, 3)
  };
}

export function updateDemoHosts(hosts: HomepageHostCard[]) {
  homepageContent = {
    ...homepageContent,
    hosts
  };
}

export function updateDemoMemories(input: {
  videoUrl: string;
  items: HomepageMemoryItem[];
}) {
  homepageContent = {
    ...homepageContent,
    memoriesVideoUrl: input.videoUrl,
    memoriesItems: input.items
  };
}

export function getDemoAdminDashboard(userId = "user-alex") {
  const profile = getDemoProfile(userId);
  if (profile.role !== "admin") {
    return null;
  }

  return {
    profile,
    users: profiles
      .map((entry) => ({
        id: entry.id,
        name: entry.name,
        avatarUrl: entry.avatarUrl,
        role: entry.role || "member",
        phoneNumber: entry.phoneNumber || "",
        email: entry.email,
        createdAt: "2026-03-01T10:00:00.000Z"
      }))
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    hosts: profiles
      .filter((entry) => entry.role === "host" || entry.role === "admin")
      .map((entry) => ({
        id: entry.id,
        name: entry.name,
        role: entry.role || "member",
        avatarUrl: entry.avatarUrl
      })),
    activities: baseActivities
      .map((activity) => {
        const activityBookings = bookings.filter(
          (booking) => booking.activityId === activity.id && booking.status !== "cancelled"
        );
        return {
          ...withDynamicParticipantCount(activity),
          pendingCount: activityBookings.filter((booking) => booking.status === "pending").length,
          confirmedCount: activityBookings.filter((booking) => booking.status === "confirmed").length,
          hostName: activity.hostUserId ? getDemoProfile(activity.hostUserId).name : "Sense host"
        };
      })
      .sort((left, right) => left.startsAt.localeCompare(right.startsAt)),
    pendingApprovals: getDemoPendingApprovals(userId),
    homepageContent
  };
}
