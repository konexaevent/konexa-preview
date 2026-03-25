import Image from "next/image";
import Link from "next/link";
import { joinActivityAction } from "./actions";
import { HomeActivityFeed } from "@/components/home-activity-feed";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getCurrentUser, getHomepageActivities } from "@/lib/queries";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const [user, activities, locale, messages] = await Promise.all([
    getCurrentUser(),
    getHomepageActivities(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedAge =
    typeof resolvedSearchParams.age === "string" ? resolvedSearchParams.age : "all";
  const homeUi = {
    ca: {
      heroStats: ["6-10 persones per grup", "Reserva en menys d'1 minut", "Ambients cuidats i sense pressio"],
      trustStrip: ["Gent nova i repetidora", "Grups petits amb host", "Experiencies pensades per connectar"],
      stepsEyebrow: "Com funciona",
      stepsTitle: "Apuntar-te a un pla hauria de sentir-se facil des del primer moment",
      steps: [
        {
          title: "Escull l'ambient",
          text: "Veus de seguida si el grup es tranquil, social o mes actiu."
        },
        {
          title: "Mira qui hi ha",
          text: "Abans d'apuntar-te, tens context del grup i de les cares conegudes."
        },
        {
          title: "Reserva i ves-hi",
          text: "Sense passos innecessaris, sense haver de pensar massa."
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
      plansAnchorHint: "Plans seleccionats per aquesta setmana"
    },
    es: {
      heroStats: ["6-10 personas por grupo", "Reserva en menos de 1 minuto", "Ambientes cuidados y sin presion"],
      trustStrip: ["Gente nueva y repetidora", "Grupos pequenos con host", "Experiencias pensadas para conectar"],
      stepsEyebrow: "Como funciona",
      stepsTitle: "Apuntarte a un plan deberia sentirse facil desde el primer momento",
      steps: [
        {
          title: "Elige el ambiente",
          text: "Ves enseguida si el grupo es tranquilo, social o mas activo."
        },
        {
          title: "Mira quien va",
          text: "Antes de apuntarte, tienes contexto del grupo y de las caras conocidas."
        },
        {
          title: "Reserva y ve",
          text: "Sin pasos innecesarios y sin tener que pensartelo demasiado."
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
      plansAnchorHint: "Planes seleccionados para esta semana"
    },
    en: {
      heroStats: ["6-10 people per group", "Reserve in under 1 minute", "Curated low-pressure atmospheres"],
      trustStrip: ["New and returning people", "Small hosted groups", "Experiences designed to connect"],
      stepsEyebrow: "How it works",
      stepsTitle: "Joining a plan should feel easy from the very first moment",
      steps: [
        {
          title: "Pick the mood",
          text: "See at a glance whether the group feels calm, social, or more active."
        },
        {
          title: "See who is going",
          text: "Before you join, you get enough context about the group and familiar faces."
        },
        {
          title: "Reserve and show up",
          text: "No extra friction and no overthinking."
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
      plansAnchorHint: "Plans selected for this week"
    }
  }[locale];
  const selectedAgeValue =
    selectedAge === "18-25" || selectedAge === "25-35" || selectedAge === "35-50" || selectedAge === "50+"
      ? selectedAge
      : "all";
  const currentHomeHref =
    selectedAgeValue === "all" ? "/#plans" : `/?age=${selectedAgeValue}#plans`;

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">{messages.heroEyebrow}</p>
          <h1>{messages.heroTitle}</h1>
          <p className="lede">{messages.heroText}</p>
          <div className="hero-actions">
            <Link href="#plans" className="button button-primary">
              {messages.heroCtaPlans}
            </Link>
            <Link href={user ? "/profile" : "/login"} className="button button-secondary">
              {user ? messages.heroCtaProfile : messages.heroCtaCreate}
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

        <div className="hero-image-wrap">
          <Image
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80"
            alt={messages.heroTitle}
            fill
            className="hero-image"
            priority
          />
          <div className="hero-floating-card hero-floating-primary">
            <span className="pill pill-soft">{messages.sharedConnectionsTitle}</span>
            <strong>{messages.heroTitle}</strong>
            <p>{messages.sharedAvailable}</p>
          </div>
          <div className="hero-floating-card hero-floating-secondary">
            <span className="pill">{messages.smallHostedGroup}</span>
            <strong>{homeUi.heroStats[0]}</strong>
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

      <section className="section-header" id="plans">
        <div>
          <p className="eyebrow">{messages.feedEyebrow}</p>
          <h2>{messages.feedTitle}</h2>
          <p className="section-anchor-copy">{homeUi.plansAnchorHint}</p>
        </div>
        <p className="section-note">{messages.feedNote}</p>
      </section>

      <HomeActivityFeed
        activities={activities}
        initialSelectedAge={selectedAgeValue}
        messages={{
          viewActivity: messages.viewActivity,
          joined: messages.joined,
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
        joinAction={joinActivityAction}
      />

      <section className="memory-section">
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
                src="https://www.youtube.com/embed/Scxs7L0vhZ4?si=Vv8H7MLegQmCj0xy"
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
            {[
              {
                src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80",
                alt: homeUi.memories[0]
              },
              {
                src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
                alt: homeUi.memories[1]
              },
              {
                src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
                alt: homeUi.memories[2]
              }
            ].map((item) => (
              <article className="memory-photo-card" key={item.alt}>
                <div className="memory-photo-frame">
                  <Image src={item.src} alt={item.alt} fill className="activity-image" />
                </div>
                <div className="memory-card-copy">
                  <strong>{item.alt}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
