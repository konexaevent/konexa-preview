import Image from "next/image";
import Link from "next/link";
import { HomeActivityFeed } from "@/components/home-activity-feed";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getHomepageActivities } from "@/lib/queries";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const [activities, locale, messages] = await Promise.all([
    getHomepageActivities(),
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
      hostCards: [
        {
          age: "18-25 anys",
          name: "Ariadna Puig",
          role: "Host del grup 18-25",
          bio: "Fa de pont perquè la gent nova se senti integrada des del primer moment.",
          avatarUrl: "/ariadnapuig.jpg"
        },
        {
          age: "25-35 anys",
          name: "Sara Renart",
          role: "Host del grup 25-35",
          bio: "Cuida l'ambient i ajuda que les converses surtin de manera natural.",
          avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Sara"
        },
        {
          age: "35-50 anys",
          name: "Lucas Moreno",
          role: "Host del grup 35-50",
          bio: "Acompanya el grup perquè tothom se senti comode i benvingut.",
          avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas"
        },
        {
          age: "Mes de 50 anys",
          name: "Elena Vega",
          role: "Host del grup +50",
          bio: "Transmet calma i dona suport si algu necessita un primer punt de referencia.",
          avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Elena"
        }
      ]
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
      hostCards: [
        {
          age: "18-25 anos",
          name: "Ariadna Puig",
          role: "Host del grupo 18-25",
          bio: "Hace de puente para que la gente nueva se sienta integrada desde el primer momento.",
          avatarUrl: "/ariadnapuig.jpg"
        },
        {
          age: "25-35 anos",
          name: "Sara Renart",
          role: "Host del grupo 25-35",
          bio: "Cuida el ambiente y ayuda a que las conversaciones aparezcan de forma natural.",
          avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Sara"
        },
        {
          age: "35-50 anos",
          name: "Lucas Moreno",
          role: "Host del grupo 35-50",
          bio: "Acompana al grupo para que todo el mundo se sienta comodo y bienvenido.",
          avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas"
        },
        {
          age: "Mas de 50 anos",
          name: "Elena Vega",
          role: "Host del grupo +50",
          bio: "Transmite calma y da apoyo si alguien necesita un primer punto de referencia.",
          avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Elena"
        }
      ]
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
      hostCards: [
        {
          age: "18-25 years",
          name: "Ariadna Puig",
          role: "Host for ages 18-25",
          bio: "She helps new people feel included from the very first moment.",
          avatarUrl: "/ariadnapuig.jpg"
        },
        {
          age: "25-35 years",
          name: "Sara Renart",
          role: "Host for ages 25-35",
          bio: "He protects the atmosphere and helps conversation happen naturally.",
          avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Sara"
        },
        {
          age: "35-50 years",
          name: "Lucas Moreno",
          role: "Host for ages 35-50",
          bio: "He guides the group so everyone can feel comfortable and welcome.",
          avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Lucas"
        },
        {
          age: "Over 50",
          name: "Elena Vega",
          role: "Host for 50+",
          bio: "She brings calm energy and offers support whenever someone needs an easy first contact point.",
          avatarUrl: "https://api.dicebear.com/9.x/lorelei/svg?seed=Elena"
        }
      ]
    }
  }[locale];
  const selectedAgeValue =
    selectedAge === "18-25" || selectedAge === "25-35" || selectedAge === "35-50" || selectedAge === "50+"
      ? selectedAge
      : "all";
  const hostToneClasses = ["age-tone-18-25", "age-tone-25-35", "age-tone-35-50", "age-tone-50-plus"];
  const hostAnchorIds = ["host-18-25", "host-25-35", "host-35-50", "host-50-plus"];

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="hero-carousel" aria-hidden="true">
          {[
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80",
            "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1600&q=80"
          ].map((src, index) => (
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

      <section className="hosts-panel" id="hosts">
        <div className="section-header">
          <div>
            <p className="eyebrow">{homeUi.hostsEyebrow}</p>
            <h2>{homeUi.hostsTitle}</h2>
          </div>
          <p className="section-note">{homeUi.hostsText}</p>
        </div>
        <div className="hosts-grid">
          {homeUi.hostCards.map((host, index) => (
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
                  src="https://www.youtube.com/embed/Scxs7L0vhZ4?rel=0"
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
