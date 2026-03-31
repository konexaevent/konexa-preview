import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getAdminUserProfile, getCurrentUser } from "@/lib/queries";
import { formatActivityDate } from "@/lib/utils";

type AdminUserProfilePageProps = {
  params: Promise<{ id: string }>;
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

export default async function AdminUserProfilePage({ params }: AdminUserProfilePageProps) {
  const { id } = await params;
  const [user, locale, messages] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);

  if (!user) {
    redirect("/login?next=/admin");
  }

  const dashboard = await getAdminUserProfile(user.id, id);
  if (!dashboard) {
    redirect("/admin");
  }

  const adminUi = {
    ca: {
      eyebrow: "Fitxa d'usuari",
      back: "Tornar a administracio",
      infoTitle: "Dades completes",
      accountState: "Rol del compte",
      memberSince: "Compte creat",
      upcomingTitle: "Properes activitats",
      pendingTitle: "Pendents de confirmar",
      pastTitle: "Activitats passades",
      connectionsTitle: "Connexions compartides",
      noUpcoming: "No te activitats futures.",
      noPending: "No te activitats pendents.",
      noPast: "No te activitats passades.",
      noConnections: "Encara no te connexions compartides."
    },
    es: {
      eyebrow: "Ficha de usuario",
      back: "Volver a administracion",
      infoTitle: "Datos completos",
      accountState: "Rol de la cuenta",
      memberSince: "Cuenta creada",
      upcomingTitle: "Proximas actividades",
      pendingTitle: "Pendientes de confirmar",
      pastTitle: "Actividades pasadas",
      connectionsTitle: "Conexiones compartidas",
      noUpcoming: "No tiene actividades futuras.",
      noPending: "No tiene actividades pendientes.",
      noPast: "No tiene actividades pasadas.",
      noConnections: "Todavia no tiene conexiones compartidas."
    },
    en: {
      eyebrow: "User profile",
      back: "Back to admin",
      infoTitle: "Full details",
      accountState: "Account role",
      memberSince: "Account created",
      upcomingTitle: "Upcoming activities",
      pendingTitle: "Pending confirmation",
      pastTitle: "Past activities",
      connectionsTitle: "Shared connections",
      noUpcoming: "This user has no upcoming activities.",
      noPending: "This user has no pending activities.",
      noPast: "This user has no past activities.",
      noConnections: "This user has no shared connections yet."
    }
  }[locale];
  const profileCreatedAt =
    "createdAt" in dashboard.profile && typeof dashboard.profile.createdAt === "string"
      ? dashboard.profile.createdAt
      : "";

  return (
    <div className="page-stack">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <p className="eyebrow">{adminUi.eyebrow}</p>
          <h1>{dashboard.profile.name}</h1>
          <p className="lede">{messages.profileText}</p>
          <div className="profile-highlights">
            <article className="profile-highlight-card">
              <p className="label">{adminUi.accountState}</p>
              <strong>{dashboard.profile.role}</strong>
            </article>
            <article className="profile-highlight-card">
              <p className="label">{adminUi.memberSince}</p>
              <strong>{profileCreatedAt ? formatActivityDate(profileCreatedAt, locale) : "-"}</strong>
            </article>
          </div>
        </div>
        <div className="profile-card">
          <Image
            src={dashboard.profile.avatarUrl}
            alt={dashboard.profile.name}
            width={88}
            height={88}
            className="avatar avatar-large"
            unoptimized
          />
          <div className="profile-card-copy">
            <span className="pill">{dashboard.profile.role}</span>
            <strong>{dashboard.upcomingActivities.length} {messages.upcoming}</strong>
            <p>{dashboard.pendingActivities.length} {messages.pendingActivities.toLowerCase()}</p>
            <Link href="/admin" className="text-link">
              {adminUi.back}
            </Link>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{messages.personalInfo}</p>
              <h2>{adminUi.infoTitle}</h2>
            </div>
          </div>
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
        </article>

        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{adminUi.upcomingTitle}</p>
              <h2>{adminUi.upcomingTitle}</h2>
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
              <p className="empty-state">{adminUi.noUpcoming}</p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{adminUi.pendingTitle}</p>
              <h2>{adminUi.pendingTitle}</h2>
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
              <p className="empty-state">{adminUi.noPending}</p>
            ) : null}
          </div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{adminUi.pastTitle}</p>
              <h2>{adminUi.pastTitle}</h2>
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
              <p className="empty-state">{adminUi.noPast}</p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="dashboard-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{adminUi.connectionsTitle}</p>
            <h2>{adminUi.connectionsTitle}</h2>
          </div>
          <p className="section-note">{messages.sharedConnectionsText}</p>
        </div>
        <div className="connection-grid">
          {dashboard.sharedConnections.map((connection: SharedConnection) => (
            <article className="connection-card" key={connection.userId}>
              <Image
                src={connection.avatarUrl}
                alt={connection.name}
                width={52}
                height={52}
                className="avatar"
                unoptimized
              />
              <div>
                <h3>{connection.name}</h3>
                <p>{messages.sharedCount.replace("{count}", String(connection.sharedActivitiesCount))}</p>
                <small>{messages.youMetIn.replace("{activities}", connection.sharedActivities.join(", "))}</small>
              </div>
            </article>
          ))}
          {dashboard.sharedConnections.length === 0 ? (
            <p className="empty-state">{adminUi.noConnections}</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
