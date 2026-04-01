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
      energy: ["Ambient tranquil", "Ambient social", "Ambient actiu"],
      instantJoin: "Reserva immediata",
      hostApproval: "Amb aprovacio",
      spotsLeft: "places lliures",
      ageEyebrow: "Rang d'edat",
      ageTitle: "Troba plans pensats per al teu moment vital",
      ageAll: "Totes les edats",
      ageLabels: {
        "18-25": "18-25 anys",
        "25-35": "25-35 anys",
        "35-50": "35-50 anys",
        "50+": "Mes de 50 anys"
      },
      plansAnchorHint: "Plans seleccionats per aquesta setmana"
    },
    es: {
      heroStats: ["Reserva en menos de 1 minuto", "Ambientes cuidados y naturales"],
      trustStrip: ["Gente nueva y repetidora", "Grupos pequenos con host", "Experiencias pensadas para conectar"],
      energy: ["Ambiente tranquilo", "Ambiente social", "Ambiente activo"],
      instantJoin: "Reserva inmediata",
      hostApproval: "Con aprobacion",
      spotsLeft: "plazas libres",
      ageEyebrow: "Rango de edad",
      ageTitle: "Encuentra planes pensados para tu momento vital",
      ageAll: "Todas las edades",
      ageLabels: {
        "18-25": "18-25 anos",
        "25-35": "25-35 anos",
        "35-50": "35-50 anos",
        "50+": "Mas de 50 anos"
      },
      plansAnchorHint: "Planes seleccionados para esta semana"
    },
    en: {
      heroStats: ["Reserve in under 1 minute", "Curated, natural atmospheres"],
      trustStrip: ["New and returning people", "Small hosted groups", "Experiences designed to connect"],
      energy: ["Calm mood", "Social mood", "Active mood"],
      instantJoin: "Instant booking",
      hostApproval: "Approval needed",
      spotsLeft: "spots left",
      ageEyebrow: "Age range",
      ageTitle: "Find plans that fit your life stage",
      ageAll: "All ages",
      ageLabels: {
        "18-25": "18-25 years",
        "25-35": "25-35 years",
        "35-50": "35-50 years",
        "50+": "Over 50"
      },
      plansAnchorHint: "Plans selected for this week"
    }
  }[locale];
  const selectedAgeValue =
    selectedAge === "18-25" || selectedAge === "25-35" || selectedAge === "35-50" || selectedAge === "50+"
      ? selectedAge
      : "all";
  const heroCarouselImages = homepageContent.heroCarouselImages as string[];

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
    </div>
  );
}
