import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cancelActivityReservationAction } from "@/app/actions";
import { getMessages, t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getActivityDetail, getCurrentUser } from "@/lib/queries";
import { formatActivityDate } from "@/lib/utils";

type ActivityDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type ActivityParticipant = {
  id: string;
  name: string;
  avatarUrl: string;
  alreadyKnow: boolean;
  sharedActivities: string[];
};

type BookingStatus = "pending" | "confirmed" | "cancelled" | null;

export default async function ActivityDetailPage({ params, searchParams }: ActivityDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [user, locale, messages] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);
  const detail = await getActivityDetail(id, user?.id ?? null);
  const bookingStatus = (detail?.viewerBookingStatus || null) as BookingStatus;
  const detailUi = {
    ca: {
      hostedGroup: "Grup reduit amb amfitrio",
      hostLabel: "Host",
      hostText: "T'acompanyara durant l'activitat i us ajudara si necessiteu un primer punt de suport.",
      easyArrival: "Arribada facil",
      socialMood: "Ambient social cuidat",
      available: "places disponibles",
      trustTitle: "Per que aquest pla se sent facil d'entrar",
      trustText:
        "Tot esta pensat perquè la gent arribi amb referencies clares, un grup reduit i una sensacio de context abans de venir.",
      rhythmTitle: "Lectura rapida del pla",
      rhythmCards: [
        { label: "Format", value: "Grup reduit", note: "Pensat per entrar-hi amb facilitat" },
        { label: "Host", value: "Acompanyament real", note: "Tindrareu una figura de referencia" },
        { label: "Ambient", value: "Converses naturals", note: "L'activitat ajuda a que el contacte flueixi" }
      ],
      guidanceTitle: "Abans de venir",
      guidance: [
        {
          title: "Pots venir sola o acompanyada",
          text: "L'activitat esta pensada perque et sentis comoda tant si vens pel teu compte com si comparteixes el pla amb algu."
        },
        {
          title: "Compartiras l'activitat amb gent",
          text: "No es tracta nomes d'arribar: el format esta pensat per facilitar que la conversa i la connexio surtin de manera natural."
        },
        {
          title: "Tindras un amfitrio de referencia",
          text: "Cada grup d'edat te un amfitrio que us guia i us ajuda el dia de l'activitat si necessiteu suport."
        }
      ],
      whatToExpectTitle: "Que t'hi trobaras",
      whatToExpect: [
        "Benvinguda senzilla i sense moments incomodes a l'arribada.",
        "Converses naturals al voltant d'una activitat compartida.",
        "Grup petit per facilitar que tothom es conegui."
      ],
      cancelHint: "Pots anul.lar-la des d'aqui si finalment no et va be."
    },
    es: {
      hostedGroup: "Grupo reducido con anfitrion",
      hostLabel: "Host",
      hostText: "Te acompanara durante la actividad y os ayudara si necesitais un primer punto de apoyo.",
      easyArrival: "Llegada facil",
      socialMood: "Ambiente social cuidado",
      available: "plazas disponibles",
      trustTitle: "Por que este plan se siente facil de entrar",
      trustText:
        "Todo esta pensado para que la gente llegue con referencias claras, un grupo reducido y una sensacion de contexto antes de venir.",
      rhythmTitle: "Lectura rapida del plan",
      rhythmCards: [
        { label: "Formato", value: "Grupo reducido", note: "Pensado para entrar con facilidad" },
        { label: "Host", value: "Acompanamiento real", note: "Tendreis una figura de referencia" },
        { label: "Ambiente", value: "Conversaciones naturales", note: "La actividad ayuda a que el contacto fluya" }
      ],
      guidanceTitle: "Antes de venir",
      guidance: [
        {
          title: "Puedes venir sola o acompanada",
          text: "La actividad esta pensada para que te sientas comoda tanto si vienes por tu cuenta como si compartes el plan con alguien."
        },
        {
          title: "Compartiras la actividad con gente",
          text: "No se trata solo de llegar: el formato esta pensado para que la conversacion y la conexion aparezcan de forma natural."
        },
        {
          title: "Tendras un anfitrion de referencia",
          text: "Cada grupo de edad tiene un anfitrion que os guia y os ayuda el dia de la actividad si necesitais apoyo."
        }
      ],
      whatToExpectTitle: "Que te encontraras",
      whatToExpect: [
        "Bienvenida sencilla y sin momentos incomodos al llegar.",
        "Conversaciones naturales alrededor de una actividad compartida.",
        "Grupo pequeno para que todo el mundo pueda conocerse."
      ],
      cancelHint: "Puedes anularla desde aquí si al final no te encaja."
    },
    en: {
      hostedGroup: "Small hosted group",
      hostLabel: "Host",
      hostText: "They will guide the activity and help out if anyone needs an easy first point of support.",
      easyArrival: "Easy arrival",
      socialMood: "Carefully hosted social vibe",
      available: "spots available",
      trustTitle: "Why this plan feels easy to join",
      trustText:
        "Everything is designed so people arrive with clear references, a small group, and enough context before showing up.",
      rhythmTitle: "Quick read of the plan",
      rhythmCards: [
        { label: "Format", value: "Small group", note: "Built to feel easy to step into" },
        { label: "Host", value: "Real guidance", note: "You will have someone to anchor the group" },
        { label: "Atmosphere", value: "Natural conversation", note: "The activity creates momentum for connection" }
      ],
      guidanceTitle: "Before you come",
      guidance: [
        {
          title: "You can come alone or accompanied",
          text: "The activity is designed so you can feel comfortable whether you come on your own or share the plan with someone."
        },
        {
          title: "You will share the activity with people",
          text: "It is not just about showing up: the format is built so conversation and connection can happen naturally."
        },
        {
          title: "You will have a host to guide you",
          text: "Each age group has a host who guides the group and helps out on the day if anyone needs support."
        }
      ],
      whatToExpectTitle: "What to expect",
      whatToExpect: [
        "A simple welcome without awkward arrival moments.",
        "Natural conversation around a shared activity.",
        "A small group so people can actually get to know each other."
      ],
      cancelHint: "You can cancel it here if you can no longer make it."
    }
  }[locale];

  if (!detail) {
    notFound();
  }

  const cancelled = typeof resolvedSearchParams.cancelled === "string";

  return (
    <div className="page-stack">
      <section className="detail-hero">
        <div className="detail-cover">
          <Image
            src={detail.heroImageUrl}
            alt={detail.title}
            fill
            className="activity-image"
            style={{
              objectPosition: `${detail.imageFocusX ?? 50}% ${detail.imageFocusY ?? 50}%`,
              transform: `scale(${detail.imageZoom ?? 1})`
            }}
          />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{messages.cityLabel}: {detail.city}</p>
          <h1>{detail.title}</h1>
          <p className="lede">{detail.summary}</p>
          <p className="detail-price">
            {messages.priceLabel}: {detail.price}
          </p>
          <div className="detail-chip-row">
            <span className="signal-tag">{detailUi.hostedGroup}</span>
            <span className="signal-tag signal-tag-muted">{detailUi.easyArrival}</span>
            <span className="signal-tag signal-tag-warm">{detailUi.socialMood}</span>
          </div>
          {detail.host ? (
            <div className="detail-host-card">
              <img
                src={detail.host.avatarUrl}
                alt={detail.host.name}
                width={52}
                height={52}
                className="avatar"
              />
              <div>
                <p className="label">{detailUi.hostLabel}</p>
                <strong>{detail.host.name}</strong>
                <p>{detailUi.hostText}</p>
              </div>
            </div>
          ) : null}
          <div className="detail-meta-grid">
            <article>
              <strong>{messages.date}</strong>
              <p>{formatActivityDate(detail.startsAt, locale)}</p>
            </article>
            <article>
              <strong>{messages.participants}</strong>
              <p>
                {detail.participantCount}/{detail.maxParticipants} {messages.participantsJoined}
              </p>
              <small>
                {detail.maxParticipants - detail.participantCount} {detailUi.available}
              </small>
            </article>
            <article>
              <strong>{messages.socialSignal}</strong>
              <p>
                {detail.knownParticipantsCount > 0
                  ? t(messages.knowPeopleInActivity, { count: detail.knownParticipantsCount })
                  : messages.everyoneNew}
              </p>
            </article>
          </div>
          <div className="detail-trust-banner">
            <strong>{detailUi.trustTitle}</strong>
            <p>{detailUi.trustText}</p>
          </div>
          <div className="detail-rhythm-strip">
            <strong>{detailUi.rhythmTitle}</strong>
            <div className="detail-rhythm-grid">
              {detailUi.rhythmCards.map((item) => (
                <article key={item.label}>
                  <small>{item.label}</small>
                  <p>{item.value}</p>
                  <span>{item.note}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="detail-cta-row">
            {cancelled ? (
              <div className="detail-booking-state">
                <p className="status status-success">{messages.reservationCancelled}</p>
                <p className="section-note">{messages.cancellationNotice}</p>
                <Link href={`/activities/${detail.id}/join`} className="button button-primary">
                  {messages.joinThisActivity}
                </Link>
              </div>
            ) : detail.viewerHasJoined ? (
              <div className="detail-booking-state">
                <span className="pill">
                  {bookingStatus === "pending"
                    ? messages.reservationPending
                    : messages.reservationConfirmed}
                </span>
                <p className="section-note">
                  {bookingStatus === "pending"
                    ? messages.cancellationNotice
                    : detailUi.cancelHint}
                </p>
                <form action={cancelActivityReservationAction}>
                  <input type="hidden" name="activity_id" value={detail.id} />
                  <input type="hidden" name="redirect_to" value={`/activities/${detail.id}`} />
                  <button type="submit" className="button button-secondary">
                    {messages.cancelReservation}
                  </button>
                </form>
              </div>
            ) : (
              <Link href={`/activities/${detail.id}/join`} className="button button-primary">
                {messages.joinThisActivity}
              </Link>
            )}
          </div>
          <div className="detail-guidance-card">
            <strong>{detailUi.guidanceTitle}</strong>
            <div className="detail-guidance-grid">
              {detailUi.guidance.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="detail-expectation-card">
            <strong>{detailUi.whatToExpectTitle}</strong>
            <ul className="detail-expectation-list">
              {detailUi.whatToExpect.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{messages.participants}</p>
            <h2>{messages.participantsTitle}</h2>
          </div>
          <p className="section-note">{messages.participantsText}</p>
        </div>
        <div className="participant-grid">
          {detail.participants.map((participant: ActivityParticipant) => (
            <article
              className={`participant-card ${participant.alreadyKnow ? "participant-card-known" : ""}`}
              key={participant.id}
            >
              <div className="connection-head">
                <img
                  src={participant.avatarUrl}
                  alt={participant.name}
                  width={52}
                  height={52}
                  className="avatar"
                />
                <div>
                  <h3>{participant.name}</h3>
                  <p>{participant.alreadyKnow ? messages.alreadyFamiliar : messages.newForYou}</p>
                </div>
              </div>
              <div className="participant-badge-row">
                <span className={`signal-tag ${participant.alreadyKnow ? "signal-tag-warm" : "signal-tag-muted"}`}>
                  {participant.alreadyKnow ? messages.alreadyFamiliar : messages.newForYou}
                </span>
              </div>

              {participant.sharedActivities.length > 0 ? (
                <>
                  <p className="preview-copy">
                    {t(messages.youMetIn, { activities: participant.sharedActivities.join(" + ") })}
                  </p>
                  <div className="shared-tags">
                    {participant.sharedActivities.map((activity: string) => (
                      <span className="pill pill-soft" key={activity}>
                        {activity}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <p className="preview-copy">{messages.noSharedActivityYet}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
