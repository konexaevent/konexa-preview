import Link from "next/link";
import { redirect } from "next/navigation";
import { updateProfileAction } from "@/app/actions";
import { ProfileForm } from "@/components/profile-form";
import { getMessages, t } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getCurrentUser, getProfileDashboard } from "@/lib/queries";
import { formatActivityDate } from "@/lib/utils";

type ProfilePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type DashboardActivity = {
  id: string;
  title: string;
  startsAt: string;
  participantCount: number;
};

type SharedConnection = {
  userId: string;
  name: string;
  avatarUrl: string;
  sharedActivitiesCount: number;
  sharedActivities: string[];
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const [user, locale, messages] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const saved = resolvedSearchParams.saved;
  const error =
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : undefined;

  if (!user) {
    redirect("/login");
  }

  const dashboard = await getProfileDashboard(user.id);
  const profileUi = {
    ca: {
      nextPlan: "Proper pla",
      nextPlanEmpty: "Encara no tens cap proper pla confirmat",
      communityLevel: "Connexions",
      memberSince: "Compte actiu",
      profileStatus: "Perfil preparat per tornar a quedar",
      pendingShort: "pendents",
      sinceText: "comunitat activa",
      rhythmTitle: "El teu ritme a Konexa",
      rhythmText:
        "Una mirada rapida al que tens en marxa ara mateix, al que ja has viscut i a la xarxa de familiaritat que vas construint.",
      confirmedShort: "confirmades",
      historyShort: "ja viscudes",
      profileCompassTitle: "On ets ara dins de Konexa",
      profileCompassText:
        "Un resum clar del teu moment actual: el que tens en marxa, el que esta pendent de confirmar i la familiaritat que ja has construit.",
      avatarError: "No hem pogut desar la foto de perfil. Torna-ho a provar amb una altra imatge.",
      profileError: "No hem pogut desar els canvis del perfil. Torna-ho a provar en un moment.",
      emailError: "Hem desat el perfil, pero no hem pogut actualitzar el correu del compte.",
      unexpectedError: "S'ha produit un error inesperat en desar el perfil."
    },
    es: {
      nextPlan: "Proximo plan",
      nextPlanEmpty: "Todavia no tienes ningun plan confirmado",
      communityLevel: "Conexiones",
      memberSince: "Cuenta activa",
      profileStatus: "Perfil listo para volver a quedar",
      pendingShort: "pendientes",
      sinceText: "comunidad activa",
      rhythmTitle: "Tu ritmo en Konexa",
      rhythmText:
        "Una mirada rapida a lo que tienes en marcha ahora mismo, lo que ya has vivido y la red de familiaridad que vas creando.",
      confirmedShort: "confirmadas",
      historyShort: "ya vividas",
      profileCompassTitle: "Donde estas ahora dentro de Konexa",
      profileCompassText:
        "Un resumen claro de tu momento actual: lo que tienes en marcha, lo que sigue pendiente y la familiaridad que ya has construido.",
      avatarError: "No hemos podido guardar la foto de perfil. Prueba otra vez con otra imagen.",
      profileError: "No hemos podido guardar los cambios del perfil. Vuelve a intentarlo en un momento.",
      emailError: "Hemos guardado el perfil, pero no hemos podido actualizar el correo de la cuenta.",
      unexpectedError: "Se ha producido un error inesperado al guardar el perfil."
    },
    en: {
      nextPlan: "Next plan",
      nextPlanEmpty: "You do not have a confirmed upcoming plan yet",
      communityLevel: "Connections",
      memberSince: "Active account",
      profileStatus: "Profile ready for your next group plan",
      pendingShort: "pending",
      sinceText: "active community",
      rhythmTitle: "Your Konexa rhythm",
      rhythmText:
        "A quick view of what is happening now, what you have already lived, and the familiarity you are building over time.",
      confirmedShort: "confirmed",
      historyShort: "already lived",
      profileCompassTitle: "Where you are right now in Konexa",
      profileCompassText:
        "A clear snapshot of where things stand: what is moving, what is still pending, and the familiarity you have already built.",
      avatarError: "We could not save your profile photo. Please try again with a different image.",
      profileError: "We could not save your profile changes. Please try again in a moment.",
      emailError: "Your profile was saved, but we could not update your account email.",
      unexpectedError: "An unexpected error happened while saving your profile."
    }
  }[locale];
  const errorMessage =
    error === "avatar"
      ? profileUi.avatarError
      : error === "profile"
        ? profileUi.profileError
        : error === "email"
          ? profileUi.emailError
          : error === "unexpected"
            ? profileUi.unexpectedError
            : null;
  const nextActivity = dashboard.upcomingActivities[0];

  return (
    <div className="page-stack">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="eyebrow">{messages.myProfile}</p>
          <h1>{dashboard.profile.name}</h1>
          <p className="lede">{messages.profileText}</p>
          <div className="profile-highlights">
            <article className="profile-highlight-card">
              <p className="label">{profileUi.nextPlan}</p>
              <strong>{nextActivity ? nextActivity.title : profileUi.nextPlanEmpty}</strong>
              {nextActivity ? <p>{formatActivityDate(nextActivity.startsAt, locale)}</p> : null}
            </article>
            <article className="profile-highlight-card">
              <p className="label">{profileUi.communityLevel}</p>
              <strong>{dashboard.sharedConnections.length} {messages.sharedConnections.toLowerCase()}</strong>
              <p>{dashboard.pendingActivities.length} {profileUi.pendingShort}</p>
            </article>
          </div>
        </div>
        <div className="profile-card">
          <img
            src={dashboard.profile.avatarUrl}
            alt={dashboard.profile.name}
            width={88}
            height={88}
            className="avatar avatar-large"
          />
          <div className="profile-card-copy">
            <span className="pill">{profileUi.profileStatus}</span>
            <strong>{dashboard.upcomingActivities.length} {messages.upcoming}</strong>
            <p>{dashboard.pendingActivities.length} {messages.pendingActivities.toLowerCase()}</p>
            <small>{profileUi.memberSince}: {profileUi.sinceText}</small>
          </div>
        </div>
      </section>

      <section className="dashboard-panel profile-compass-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{profileUi.profileCompassTitle}</p>
            <h2>{profileUi.profileCompassTitle}</h2>
          </div>
          <p className="section-note">{profileUi.profileCompassText}</p>
        </div>
        <div className="profile-compass-grid">
          <article className="profile-compass-card">
            <span className="label">{profileUi.nextPlan}</span>
            <strong>{nextActivity ? nextActivity.title : profileUi.nextPlanEmpty}</strong>
            <p>
              {nextActivity
                ? formatActivityDate(nextActivity.startsAt, locale)
                : messages.noUpcoming}
            </p>
          </article>
          <article className="profile-compass-card">
            <span className="label">{messages.pendingActivities}</span>
            <strong>{dashboard.pendingActivities.length}</strong>
            <p>{messages.pendingPlans}</p>
          </article>
          <article className="profile-compass-card">
            <span className="label">{messages.sharedConnections}</span>
            <strong>{dashboard.sharedConnections.length}</strong>
            <p>{messages.sharedConnections.toLowerCase()}</p>
          </article>
        </div>
      </section>

      <section className="dashboard-panel profile-rhythm-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{profileUi.rhythmTitle}</p>
            <h2>{profileUi.rhythmTitle}</h2>
          </div>
          <p className="section-note">{profileUi.rhythmText}</p>
        </div>
        <div className="profile-rhythm-grid">
          <article className="profile-rhythm-card">
            <strong>{dashboard.upcomingActivities.length}</strong>
            <p>{profileUi.confirmedShort}</p>
          </article>
          <article className="profile-rhythm-card">
            <strong>{dashboard.pendingActivities.length}</strong>
            <p>{profileUi.pendingShort}</p>
          </article>
          <article className="profile-rhythm-card">
            <strong>{dashboard.pastActivities.length}</strong>
            <p>{profileUi.historyShort}</p>
          </article>
          <article className="profile-rhythm-card">
            <strong>{dashboard.sharedConnections.length}</strong>
            <p>{messages.sharedConnections.toLowerCase()}</p>
          </article>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{messages.scheduledActivities}</p>
              <h2>{messages.scheduledPlans}</h2>
            </div>
          </div>
          <div className="stack-list">
            {dashboard.upcomingActivities.map((activity: DashboardActivity) => (
              <div className="list-card" key={activity.id}>
                <div>
                  <h3>{activity.title}</h3>
                  <p>{formatActivityDate(activity.startsAt, locale)}</p>
                  <small>{activity.participantCount} {messages.participantsJoined}</small>
                </div>
                <Link href={`/activities/${activity.id}`} className="text-link">
                  {messages.viewActivity}
                </Link>
              </div>
            ))}
            {dashboard.upcomingActivities.length === 0 ? (
              <p className="empty-state">{messages.noUpcoming}</p>
            ) : null}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{messages.pendingActivities}</p>
              <h2>{messages.pendingPlans}</h2>
            </div>
          </div>
          <div className="stack-list">
            {dashboard.pendingActivities.map((activity: DashboardActivity) => (
              <div className="list-card" key={activity.id}>
                <div>
                  <h3>{activity.title}</h3>
                  <p>{formatActivityDate(activity.startsAt, locale)}</p>
                  <small>{activity.participantCount} {messages.participantsJoined}</small>
                </div>
                <Link href={`/activities/${activity.id}`} className="text-link">
                  {messages.viewActivity}
                </Link>
              </div>
            ))}
            {dashboard.pendingActivities.length === 0 ? (
              <p className="empty-state">{messages.noPending}</p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{messages.personalInfo}</p>
              <h2>{messages.personalInfoTitle}</h2>
            </div>
          </div>
          {typeof saved === "string" ? (
            <p className="status status-success">{messages.profileSaved}</p>
          ) : null}
          {errorMessage ? <p className="status status-error">{errorMessage}</p> : null}
          <div className="info-grid">
            <div className="info-item">
              <p className="label">{messages.firstName}</p>
              <p className="value">{dashboard.profile.firstName || "-"}</p>
            </div>
            <div className="info-item">
              <p className="label">{messages.lastName}</p>
              <p className="value">{dashboard.profile.lastName || "-"}</p>
            </div>
            <div className="info-item">
              <p className="label">{messages.email}</p>
              <p className="value">{dashboard.profile.email || "-"}</p>
            </div>
            <div className="info-item">
              <p className="label">{messages.phone}</p>
              <p className="value">{dashboard.profile.phoneNumber || "-"}</p>
            </div>
            <div className="info-item">
              <p className="label">{messages.birthDate}</p>
              <p className="value">{dashboard.profile.birthDate || "-"}</p>
            </div>
          </div>
          <div className="panel-head panel-head-form">
            <div>
              <p className="eyebrow">{messages.editProfile}</p>
              <h2>{messages.editProfile}</h2>
            </div>
          </div>
          <ProfileForm
            action={updateProfileAction}
            messages={{
              firstName: messages.firstName,
              lastName: messages.lastName,
              email: messages.email,
              phone: messages.phone,
              birthDate: messages.birthDate,
              avatarFile: messages.avatarFile,
              avatarFileHelp: messages.avatarFileHelp,
              saveProfile: messages.saveProfile
            }}
            values={{
              firstName: dashboard.profile.firstName || "",
              lastName: dashboard.profile.lastName || "",
              email: dashboard.profile.email || "",
              phoneNumber: dashboard.profile.phoneNumber || "",
              birthDate: dashboard.profile.birthDate || "",
              avatarUrl: dashboard.profile.avatarUrl || ""
            }}
          />
        </article>

        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{messages.pastActivities}</p>
              <h2>{messages.happenedPlans}</h2>
            </div>
          </div>
          <div className="stack-list">
            {dashboard.pastActivities.map((activity: DashboardActivity) => (
              <div className="list-card" key={activity.id}>
                <div>
                  <h3>{activity.title}</h3>
                  <p>{formatActivityDate(activity.startsAt, locale)}</p>
                  <small>{activity.participantCount} {messages.participantsJoined}</small>
                </div>
                <Link href={`/activities/${activity.id}`} className="text-link">
                  {messages.viewActivity}
                </Link>
              </div>
            ))}
            {dashboard.pastActivities.length === 0 ? (
              <p className="empty-state">{messages.noPast}</p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="dashboard-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{messages.sharedConnectionsTitle}</p>
            <h2>{messages.sharedConnectionsTitle}</h2>
          </div>
          <p className="section-note">{messages.sharedConnectionsText}</p>
        </div>
        <div className="connection-grid">
          {dashboard.sharedConnections.map((connection: SharedConnection) => (
            <article className="connection-card" key={connection.userId}>
              <div className="connection-head">
                <img
                  src={connection.avatarUrl}
                  alt={connection.name}
                  width={56}
                  height={56}
                  className="avatar"
                />
                <div>
                  <h3>{connection.name}</h3>
                  <p>{t(messages.sharedCount, { count: connection.sharedActivitiesCount })}</p>
                </div>
              </div>
              <div className="shared-tags">
                {connection.sharedActivities.map((activity: string) => (
                  <span className="pill pill-soft" key={activity}>
                    {activity}
                  </span>
                ))}
              </div>
              <p className="preview-copy">
                {t(messages.youMetIn, {
                  activities: connection.sharedActivities.slice(0, 2).join(" + ")
                })}
              </p>
            </article>
          ))}
          {dashboard.sharedConnections.length === 0 ? (
            <p className="empty-state">{messages.noSharedYet}</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
