import Image from "next/image";
import { notFound } from "next/navigation";
import { joinActivityAction } from "@/app/actions";
import { getMessages, t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getActivityDetail, getCurrentUser } from "@/lib/queries";
import { formatActivityDate } from "@/lib/utils";

type ActivityDetailPageProps = {
  params: Promise<{ id: string }>;
};

type ActivityParticipant = {
  id: string;
  name: string;
  avatarUrl: string;
  alreadyKnow: boolean;
  sharedActivities: string[];
};

export default async function ActivityDetailPage({ params }: ActivityDetailPageProps) {
  const { id } = await params;
  const [user, locale, messages] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);
  const detail = await getActivityDetail(id, user?.id ?? null);
  const detailUi = {
    ca: {
      hostedGroup: "Grup reduit amb amfitrio",
      easyArrival: "Arribada facil",
      socialMood: "Ambient social cuidat",
      available: "places disponibles",
      whatToExpectTitle: "Que t'hi trobaras",
      whatToExpect: [
        "Benvinguda senzilla i sense moments incomodes a l'arribada.",
        "Converses naturals al voltant d'una activitat compartida.",
        "Grup petit per facilitar que tothom es conegui."
      ]
    },
    es: {
      hostedGroup: "Grupo reducido con anfitrion",
      easyArrival: "Llegada facil",
      socialMood: "Ambiente social cuidado",
      available: "plazas disponibles",
      whatToExpectTitle: "Que te encontraras",
      whatToExpect: [
        "Bienvenida sencilla y sin momentos incomodos al llegar.",
        "Conversaciones naturales alrededor de una actividad compartida.",
        "Grupo pequeno para que todo el mundo pueda conocerse."
      ]
    },
    en: {
      hostedGroup: "Small hosted group",
      easyArrival: "Easy arrival",
      socialMood: "Carefully hosted social vibe",
      available: "spots available",
      whatToExpectTitle: "What to expect",
      whatToExpect: [
        "A simple welcome without awkward arrival moments.",
        "Natural conversation around a shared activity.",
        "A small group so people can actually get to know each other."
      ]
    }
  }[locale];

  if (!detail) {
    notFound();
  }

  return (
    <div className="page-stack">
      <section className="detail-hero">
        <div className="detail-cover">
          <Image
            src={detail.heroImageUrl}
            alt={detail.title}
            fill
            className="activity-image"
          />
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{messages.cityLabel}: {detail.city}</p>
          <h1>{detail.title}</h1>
          <p className="lede">{detail.summary}</p>
          <div className="detail-chip-row">
            <span className="signal-tag">{detailUi.hostedGroup}</span>
            <span className="signal-tag signal-tag-muted">{detailUi.easyArrival}</span>
            <span className="signal-tag signal-tag-warm">{detailUi.socialMood}</span>
          </div>
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
          <div className="detail-cta-row">
            {detail.viewerHasJoined ? (
              <span className="pill">{messages.alreadyJoinedThisActivity}</span>
            ) : user ? (
              <form action={joinActivityAction}>
                <input type="hidden" name="activity_id" value={detail.id} />
                <input type="hidden" name="redirect_to" value={`/activities/${detail.id}`} />
                <button type="submit" className="button button-primary">
                  {messages.joinThisActivity}
                </button>
              </form>
            ) : (
              <a href="/login" className="button button-primary">
                {messages.logInToJoin}
              </a>
            )}
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
                <Image
                  src={participant.avatarUrl}
                  alt={participant.name}
                  width={52}
                  height={52}
                  className="avatar"
                  unoptimized
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
