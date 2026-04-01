import Image from "next/image";
import Link from "next/link";
import { HomeActivityFeed } from "@/components/home-activity-feed";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getHomepageActivities, getHomepageContent } from "@/lib/queries";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const [activities, homepageContent, locale, messages] = await Promise.all([
    getHomepageActivities(),
    getHomepageContent(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedAge =
    typeof resolvedSearchParams.age === "string" ? resolvedSearchParams.age : "all";
  const homeUi = {
    ca: {
      heroStats: ["Reserva en menys d'1 minut", "Ambients cuidats i naturals"],
      trustStrip: ["Gent nova i repetidora", "Grups petits amb host", "Experiencies pensades per connectar"],
      stepsEyebrow: "Com funciona",
      stepsTitle: "Activitats reals per coneixer gent d'una manera facil i acompanyada",
      steps: [
        {
          title: "Vine sola o acompanyada",
          text: "Et pots apuntar tant si vens pel teu compte com si prefereixes venir amb algu."
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
      energy: ["Ambient tranquil", "Ambient social", "Ambient actiu"],
      instantJoin: "Reserva immediata",
      hostApproval: "Amb aprovacio",
      spotsLeft: "places lliures",
      galleryEyebrow: "Moments reals",
      galleryTitle: "Mira com se senten els plans quan la gent repeteix",
      galleryText:
        "Un petit recull visual d'activitats passades per entendre l'energia de Konexa abans d'apuntar-t'hi.",
      videoTitle: "Ambient real d'una activitat Konexa",
      ageEyebrow: "Rang d'edat",
      ageTitle: "Troba plans pensats per al teu moment vital",
      ageAll: "Totes les edats",
      ageLabels: {
        "18-25": "18-25 anys",
        "25-35": "25-35 anys",
        "35-50": "35-50 anys",
        "50+": "Mes de 50 anys"
      },
      memories: [
        "Sopars amb conversa facil",
        "Passejos tranquils amb cafe",
        "Tallers creatius en grup petit"
      ],
      plansAnchorHint: "Plans seleccionats per aquesta setmana",
      hostsEyebrow: "Hosts",
      hostsTitle: "Coneix qui acompanya cada grup d'edat",
      hostsText:
        "Cada franja te un host de referencia perquè la gent arribi amb més confiança, sàpiga qui trobarà i pugui veure una petita presentació abans de venir.",
      hostVideoLabel: "Video de presentacio",
      hostCards: []
    },
    es: {
      heroStats: ["Reserva en menos de 1 minuto", "Ambientes cuidados y naturales"],
      trustStrip: ["Gente nueva y repetidora", "Grupos pequenos con host", "Experiencias pensadas para conectar"],
      stepsEyebrow: "Como funciona",
      stepsTitle: "Actividades reales para conocer gente de forma facil y acompanada",
      steps: [
        {
          title: "Ven sola o acompanada",
          text: "Puedes apuntarte tanto si vienes por tu cuenta como si prefieres venir con alguien."
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
      energy: ["Ambiente tranquilo", "Ambiente social", "Ambiente activo"],
      instantJoin: "Reserva inmediata",
      hostApproval: "Con aprobacion",
      spotsLeft: "plazas libres",
      galleryEyebrow: "Momentos reales",
      galleryTitle: "Mira como se sienten los planes cuando la gente repite",
      galleryText:
        "Una pequena seleccion visual de actividades pasadas para entender la energia de Konexa antes de apuntarte.",
      videoTitle: "Ambiente real de una actividad Konexa",
      ageEyebrow: "Rango de edad",
      ageTitle: "Encuentra planes pensados para tu momento vital",
      ageAll: "Todas las edades",
      ageLabels: {
        "18-25": "18-25 anos",
        "25-35": "25-35 anos",
        "35-50": "35-50 anos",
        "50+": "Mas de 50 anos"
      },
      memories: [
        "Cenas con conversacion facil",
        "Paseos tranquilos con cafe",
        "Talleres creativos en grupos pequenos"
      ],
      plansAnchorHint: "Planes seleccionados para esta semana",
      hostsEyebrow: "Hosts",
      hostsTitle: "Conoce a quien acompana cada grupo de edad",
      hostsText:
        "Cada franja tiene un host de referencia para que la gente llegue con más confianza, sepa a quién encontrará y pueda ver una pequeña presentación antes de venir.",
      hostVideoLabel: "Video de presentacion",
      hostCards: []
    },
    en: {
      heroStats: ["Reserve in under 1 minute", "Curated, natural atmospheres"],
      trustStrip: ["New and returning people", "Small hosted groups", "Experiences designed to connect"],
      stepsEyebrow: "How it works",
      stepsTitle: "Real activities designed to help people connect with ease",
      steps: [
        {
          title: "Come alone or with someone",
          text: "You can join on your own or come accompanied if that feels better for you."
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
      energy: ["Calm mood", "Social mood", "Active mood"],
      instantJoin: "Instant booking",
      hostApproval: "Approval needed",
      spotsLeft: "spots left",
      galleryEyebrow: "Real moments",
      galleryTitle: "See what plans feel like when people come back",
      galleryText:
        "A small visual selection from past activities so people can understand the Konexa atmosphere before joining.",
      videoTitle: "Real atmosphere from a Konexa-style activity",
      ageEyebrow: "Age range",
      ageTitle: "Find plans that fit your life stage",
      ageAll: "All ages",
      ageLabels: {
        "18-25": "18-25 years",
        "25-35": "25-35 years",
        "35-50": "35-50 years",
        "50+": "Over 50"
      },
      memories: [
        "Dinners with easy conversation",
        "Calm coffee walks",
        "Creative workshops in small groups"
      ],
      plansAnchorHint: "Plans selected for this week",
      hostsEyebrow: "Hosts",
      hostsTitle: "Meet the host for each age group",
      hostsText:
        "Each age range has a dedicated host so people arrive with more trust, know who will welcome them, and can watch a short introduction first.",
      hostVideoLabel: "Intro video",
      hostCards: []
    }
  }[locale];
  const selectedAgeValue =
    selectedAge === "18-25" || selectedAge === "25-35" || selectedAge === "35-50" || selectedAge === "50+"
      ? selectedAge
      : "all";
  const hostToneClasses = ["age-tone-18-25", "age-tone-25-35", "age-tone-35-50", "age-tone-50-plus"];
  const hostAnchorIds = ["host-18-25", "host-25-35", "host-35-50", "host-50-plus"];
  const homepageHosts = homepageContent.hosts as Array<{
    age: "18-25" | "25-35" | "35-50" | "50+";
    name: string;
    role: string;
    bio: string;
    avatarUrl: string;
    videoUrl: string;
  }>;
  const heroCarouselImages = homepageContent.heroCarouselImages as string[];
  const memoriesItems = homepageContent.memoriesItems as Array<{
    title: string;
    imageUrl: string;
  }>;
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
  const localizedHostCards = homepageHosts.map((host) => ({
    ...host,
    age: ageLabelMap[host.age]
  }));

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="hero-carousel" aria-hidden="true">
          {heroCarouselImages.map((src: string, index: number) => (
            <div className={`hero-carousel-slide hero-carousel-slide-${index + 1}`} key={src}>
              <Image src={src} alt="" fill className="hero-image" priority={index === 0} />
            </div>
          ))}
        </div>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-copy">
          <h1>{messages.heroTitle}</h1>
          <p className="lede">{messages.heroText}</p>
          <div className="hero-actions">
            <Link href="#plans" className="button button-primary">
              {messages.heroCtaPlans}
            </Link>
          </div>
          <ul className="hero-benefits">
            <li>{messages.heroBenefit1}</li>
            <li>{messages.heroBenefit2}</li>
            <li>{messages.heroBenefit3}</li>
          </ul>
          <div className="hero-stats">
            {homeUi.heroStats.map((stat) => (
              <div className="hero-stat" key={stat}>
                <strong>{stat}</strong>
              </div>
            ))}
          </div>
          <div className="hero-trust-strip" aria-label={homeUi.plansAnchorHint}>
            {homeUi.trustStrip.map((item) => (
              <span className="hero-trust-pill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="steps-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">{homeUi.stepsEyebrow}</p>
            <h2>{homeUi.stepsTitle}</h2>
          </div>
        </div>
        <div className="steps-grid">
          {homeUi.steps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="activity-section" id="plans">
        <div className="section-header">
          <div>
            {messages.feedEyebrow ? <p className="eyebrow">{messages.feedEyebrow}</p> : null}
            <h2>{messages.feedTitle}</h2>
          </div>
        </div>

        <HomeActivityFeed
          activities={activities}
          initialSelectedAge={selectedAgeValue}
          messages={{
            viewActivity: messages.viewActivity,
            host: "Host",
            joined: messages.joined,
            pending: messages.reservationPending,
            joinActivity: messages.joinActivity,
            smallHostedGroup: messages.smallHostedGroup
          }}
          homeUi={{
            ageEyebrow: homeUi.ageEyebrow,
            ageTitle: homeUi.ageTitle,
            ageAll: homeUi.ageAll,
            ageLabels: homeUi.ageLabels,
            energy: homeUi.energy,
            hostApproval: homeUi.hostApproval,
            instantJoin: homeUi.instantJoin,
            spotsLeft: homeUi.spotsLeft
          }}
          locale={locale}
        />
      </section>

      <section className="trust-panel">
        <div>
          <p className="eyebrow">{messages.trustEyebrow}</p>
          <h2>{messages.trustTitle}</h2>
          <p className="section-note trust-note">{messages.feedNote}</p>
        </div>
        <div className="trust-grid">
          <article>
            <strong>{messages.trustUpcomingTitle}</strong>
            <p>{messages.trustUpcomingText}</p>
          </article>
          <article>
            <strong>{messages.trustPastTitle}</strong>
            <p>{messages.trustPastText}</p>
          </article>
          <article>
            <strong>{messages.trustSharedTitle}</strong>
            <p>{messages.trustSharedText}</p>
          </article>
        </div>
      </section>

      <section className="memory-section" id="memories">
        <div className="section-header">
          <div>
            <p className="eyebrow">{homeUi.galleryEyebrow}</p>
            <h2>{homeUi.galleryTitle}</h2>
          </div>
          <p className="section-note">{homeUi.galleryText}</p>
        </div>

        <div className="memory-grid">
          <article className="memory-video-card">
            <div className="memory-video-frame">
              <iframe
                src={homepageContent.memoriesVideoUrl}
                title={homeUi.videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="memory-card-copy">
              <strong>{homeUi.videoTitle}</strong>
              <p>{homeUi.galleryText}</p>
            </div>
          </article>

          <div className="memory-photo-grid">
            {memoriesItems.map((item) => (
              <article className="memory-photo-card" key={item.title}>
                <div className="memory-photo-frame">
                  <Image src={item.imageUrl} alt={item.title} fill className="activity-image" />
                </div>
                <div className="memory-card-copy">
                  <strong>{item.title}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hosts-panel" id="hosts">
        <div className="section-header">
          <div>
            <p className="eyebrow">{homeUi.hostsEyebrow}</p>
            <h2>{homeUi.hostsTitle}</h2>
          </div>
          <p className="section-note">{homeUi.hostsText}</p>
        </div>
        <div className="hosts-grid">
          {localizedHostCards.map((host, index) => (
            <article
              className={`host-card ${hostToneClasses[index]}`}
              key={host.age}
              id={hostAnchorIds[index]}
            >
              <div className="host-card-top">
                <Image
                  src={host.avatarUrl}
                  alt={host.name}
                  width={68}
                  height={68}
                  className="avatar avatar-large"
                  unoptimized
                />
                <div>
                  <span className={`signal-tag signal-tag-age ${hostToneClasses[index]}`}>
                    {host.age}
                  </span>
                  <h3>{host.name}</h3>
                  <p className="host-role">{host.role}</p>
                </div>
              </div>
              <p className="host-bio">{host.bio}</p>
              <div className="host-video-frame">
                <iframe
                  src={homepageContent.hosts[index]?.videoUrl || ""}
                  title={`${homeUi.hostVideoLabel} - ${host.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <span className="host-video-label">{homeUi.hostVideoLabel}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
