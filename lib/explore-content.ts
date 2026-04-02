import type { Locale } from "@/lib/i18n";

type SharedMessages = {
  trustEyebrow: string;
  trustTitle: string;
  trustUpcomingTitle: string;
  trustUpcomingText: string;
  trustPastTitle: string;
  trustPastText: string;
  trustSharedTitle: string;
  trustSharedText: string;
};

export function getExploreContent(
  locale: Locale,
  messages: SharedMessages,
  homepageContent: {
    hosts: Array<{
      age: "18-25" | "25-35" | "35-50" | "50+";
      name: string;
      role: string;
      bio: string;
      avatarUrl: string;
      videoUrl: string;
    }>;
    memoriesItems: Array<{
      title: string;
      imageUrl: string;
    }>;
    memoriesVideoUrl: string;
  }
) {
  const ui = {
    ca: {
      stepsEyebrow: "Com funciona",
      stepsTitle: "Activitats reals per coneixer gent d'una manera facil i acompanyada",
      stepsIntro:
        "Una manera clara d'entendre com funciona Konexa abans d'apuntar-te a una activitat.",
      steps: [
        {
          title: "Vine sola, acompanyat/ada o amb parella",
          text: "Et pots apuntar si vens pel teu compte, amb amistats, amb parella o amb algu amb qui et vingui de gust compartir el pla."
        },
        {
          title: "Fes activitats amb gent",
          text: "Cada pla esta pensat per compartir una experiencia real i ajudar que la conversa surti naturalment."
        },
        {
          title: "Deixa't guiar pel teu amfitrio",
          text: "Cada grup d'edat te un amfitrio que us acompanya i us ajuda el dia de l'activitat si ho necessiteu."
        }
      ],
      communityIntro:
        "Aquesta part explica per què l'experiència se sent més propera quan ja tens rastre del que has viscut dins de Konexa.",
      galleryEyebrow: "Moments reals",
      galleryTitle: "Mira com se senten els plans quan la gent repeteix",
      galleryText:
        "Un petit recull visual d'activitats passades per entendre l'energia de Konexa abans d'apuntar-t'hi.",
      videoTitle: "Ambient real d'una activitat Konexa",
      hostsEyebrow: "Hosts",
      hostsTitle: "Coneix qui acompanya cada grup d'edat",
      hostsText:
        "Cada franja te un host de referencia perquè la gent arribi amb més confiança, sàpiga qui trobarà i pugui veure una petita presentació abans de venir.",
      hostVideoLabel: "Video de presentacio",
      pageLabel: "Més Konexa"
    },
    es: {
      stepsEyebrow: "Como funciona",
      stepsTitle: "Actividades reales para conocer gente de forma facil y acompanada",
      stepsIntro:
        "Una forma clara de entender cómo funciona Konexa antes de apuntarte a una actividad.",
      steps: [
        {
          title: "Ven sola, acompanada o en pareja",
          text: "Puedes apuntarte si vienes por tu cuenta, con amistades, en pareja o con alguien con quien te apetezca compartir el plan."
        },
        {
          title: "Haz actividades con gente",
          text: "Cada plan esta pensado para compartir una experiencia real y hacer que la conversacion aparezca de forma natural."
        },
        {
          title: "Dejate guiar por tu anfitrion",
          text: "Cada grupo de edad tiene un anfitrion que os acompana y os ayuda el dia de la actividad si lo necesitais."
        }
      ],
      communityIntro:
        "Esta parte explica por qué la experiencia se siente más cercana cuando ya tienes rastro de lo vivido dentro de Konexa.",
      galleryEyebrow: "Momentos reales",
      galleryTitle: "Mira como se sienten los planes cuando la gente repite",
      galleryText:
        "Una pequena seleccion visual de actividades pasadas para entender la energia de Konexa antes de apuntarte.",
      videoTitle: "Ambiente real de una actividad Konexa",
      hostsEyebrow: "Hosts",
      hostsTitle: "Conoce a quien acompana cada grupo de edad",
      hostsText:
        "Cada franja tiene un host de referencia para que la gente llegue con más confianza, sepa a quién encontrará y pueda ver una pequeña presentación antes de venir.",
      hostVideoLabel: "Video de presentacion",
      pageLabel: "Más Konexa"
    },
    en: {
      stepsEyebrow: "How it works",
      stepsTitle: "Real activities designed to help people connect with ease",
      stepsIntro:
        "A clear way to understand how Konexa works before joining any activity.",
      steps: [
        {
          title: "Come alone, with friends, or with a partner",
          text: "You can join on your own, with friends, with a partner, or with anyone you would like to share the plan with."
        },
        {
          title: "Join activities with people",
          text: "Every plan is built around a real shared experience so conversation can happen naturally."
        },
        {
          title: "Be guided by your host",
          text: "Each age group has a host who guides the group and helps out on the day if anyone needs support."
        }
      ],
      communityIntro:
        "This section explains why the experience feels more familiar when you already have a real track record inside Konexa.",
      galleryEyebrow: "Real moments",
      galleryTitle: "See what plans feel like when people come back",
      galleryText:
        "A small visual selection from past activities so people can understand the Konexa atmosphere before joining.",
      videoTitle: "Real atmosphere from a Konexa-style activity",
      hostsEyebrow: "Hosts",
      hostsTitle: "Meet the host for each age group",
      hostsText:
        "Each age range has a dedicated host so people arrive with more trust, know who will welcome them, and can watch a short introduction first.",
      hostVideoLabel: "Intro video",
      pageLabel: "More Konexa"
    }
  }[locale];

  const ageLabelMap = {
    ca: {
      "18-25": "18-25 anys",
      "25-35": "25-35 anys",
      "35-50": "35-50 anys",
      "50+": "Mes de 50 anys"
    },
    es: {
      "18-25": "18-25 anos",
      "25-35": "25-35 anos",
      "35-50": "35-50 anos",
      "50+": "Mas de 50 anos"
    },
    en: {
      "18-25": "18-25 years",
      "25-35": "25-35 years",
      "35-50": "35-50 years",
      "50+": "Over 50"
    }
  }[locale];

  return {
    ...ui,
    trust: {
      eyebrow: messages.trustEyebrow,
      title: messages.trustTitle,
      note: "",
      items: [
        {
          title: messages.trustUpcomingTitle,
          text: messages.trustUpcomingText
        },
        {
          title: messages.trustPastTitle,
          text: messages.trustPastText
        },
        {
          title: messages.trustSharedTitle,
          text: messages.trustSharedText
        }
      ]
    },
    memoriesVideoUrl: homepageContent.memoriesVideoUrl,
    memoriesItems: homepageContent.memoriesItems,
    hosts: homepageContent.hosts.map((host) => ({
      ...host,
      ageLabel: ageLabelMap[host.age]
    }))
  };
}
