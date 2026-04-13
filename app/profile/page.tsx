import Link from "next/link";
import { redirect } from "next/navigation";
import { updateProfileAction } from "@/app/actions";
import { ProfileForm } from "@/components/profile-form";
import { ProfileSectionCard } from "@/components/profile-section-card";
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

type ProfileSectionId = "upcoming" | "pending" | "past" | "shared" | "edit";
type ProfileCardItem = {
  key: string;
  sectionId?: ProfileSectionId;
  href?: string;
  accent: string;
  eyebrow: string;
  title: string;
  description: string;
  meta: string;
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
  const requestedSection =
    typeof resolvedSearchParams.section === "string"
      ? (resolvedSearchParams.section as ProfileSectionId)
      : null;

  if (!user) {
    redirect("/login");
  }

  const dashboard = await getProfileDashboard(user.id);
  const nextActivity = dashboard.upcomingActivities[0];
  const activeSection = ["upcoming", "pending", "past", "shared", "edit"].includes(
    requestedSection || ""
  )
    ? requestedSection
    : null;

  const profileUi = {
    ca: {
      nextPlan: "Proper pla",
      nextPlanEmpty: "Encara no tens cap proper pla confirmat",
      communityLevel: "Connexions",
      memberSince: "Compte actiu",
      profileStatus: "Perfil preparat per tornar a quedar",
      pendingShort: "pendents",
      sinceText: "comunitat activa",
      avatarFormatError: "La foto ha de ser PNG, JPG, WEBP, HEIC, HEIF o SVG.",
      avatarError: "No hem pogut desar la foto de perfil. Torna-ho a provar amb una altra imatge.",
      profileError: "No hem pogut desar els canvis del perfil. Torna-ho a provar en un moment.",
      emailError: "Hem desat el perfil, pero no hem pogut actualitzar el correu del compte.",
      unexpectedError: "S'ha produit un error inesperat en desar el perfil.",
      essentialsEyebrow: "Resum",
      essentialsTitle: "El teu espai, ordenat i clar",
      essentialsText:
        "Aqui veus nomes l'essencial. La resta d'apartats s'obren un a un.",
      quickStatus: "Estat actual",
      accountSummary: "Compte i dades basiques",
      openSection: "Obre el teu espai",
      openSectionText:
        "Tria l'apartat que vols revisar ara.",
      openSectionCta: "Obrir apartat",
      activeSectionCta: "Obert ara",
      upcomingDesc: "Els plans confirmats que tens a prop i que ja formen part del teu calendari.",
      pendingDesc: "Les sol.licituds que encara estan esperant validacio per part de Konexa.",
      pastDesc: "L'historial dels plans que ja has viscut i que formen part del teu recorregut.",
      sharedDesc: "Les persones amb qui ja has coincidit i la familiaritat que has anat construint.",
      editDesc: "Actualitza foto, correu, telefon i la resta de dades del teu perfil.",
      communityDesc: "Accedeix a la part de comunitat de Konexa des del teu perfil.",
      emptyTitle: "Tot el teu perfil continua aqui, pero sense saturar.",
      emptyText:
        "Escull un bloc per entrar directament a l'apartat que vols veure.",
      backToOverview: "Tornar al resum",
      sectionLabel: "Apartat obert",
      upcomingMeta: "{count} confirmades",
      pendingMeta: "{count} pendents",
      pastMeta: "{count} ja viscudes",
      sharedMeta: "{count} connexions",
      editMeta: "Dades i foto",
      profileMainInfo: "Informacio principal",
      activeSectionTitle: "Estas mirant aquest apartat ara"
    },
    es: {
      nextPlan: "Proximo plan",
      nextPlanEmpty: "Todavia no tienes ningun plan confirmado",
      communityLevel: "Conexiones",
      memberSince: "Cuenta activa",
      profileStatus: "Perfil listo para volver a quedar",
      pendingShort: "pendientes",
      sinceText: "comunidad activa",
      avatarFormatError: "La foto debe ser PNG, JPG, WEBP, HEIC, HEIF o SVG.",
      avatarError: "No hemos podido guardar la foto de perfil. Prueba otra vez con otra imagen.",
      profileError: "No hemos podido guardar los cambios del perfil. Vuelve a intentarlo en un momento.",
      emailError: "Hemos guardado el perfil, pero no hemos podido actualizar el correo de la cuenta.",
      unexpectedError: "Se ha producido un error inesperado al guardar el perfil.",
      essentialsEyebrow: "Resumen",
      essentialsTitle: "Tu espacio, ordenado y claro",
      essentialsText:
        "Aqui solo ves lo esencial. El resto de apartados se abre uno a uno.",
      quickStatus: "Estado actual",
      accountSummary: "Cuenta y datos basicos",
      openSection: "Abre tu espacio",
      openSectionText:
        "Elige el apartado que quieres revisar ahora.",
      openSectionCta: "Abrir apartado",
      activeSectionCta: "Abierto ahora",
      upcomingDesc: "Los planes confirmados que ya tienes cerca y forman parte de tu calendario.",
      pendingDesc: "Las solicitudes que siguen esperando validacion por parte de Konexa.",
      pastDesc: "El historial de planes que ya has vivido y forman parte de tu recorrido.",
      sharedDesc: "Las personas con las que ya has coincidido y la familiaridad que has construido.",
      editDesc: "Actualiza foto, correo, telefono y el resto de datos de tu perfil.",
      communityDesc: "Accede a la parte de comunidad de Konexa desde tu perfil.",
      emptyTitle: "Todo tu perfil sigue aqui, pero sin saturar.",
      emptyText:
        "Escoge un bloque para entrar directamente en el apartado que quieres ver.",
      backToOverview: "Volver al resumen",
      sectionLabel: "Apartado abierto",
      upcomingMeta: "{count} confirmadas",
      pendingMeta: "{count} pendientes",
      pastMeta: "{count} ya vividas",
      sharedMeta: "{count} conexiones",
      editMeta: "Datos y foto",
      profileMainInfo: "Informacion principal",
      activeSectionTitle: "Ahora estas viendo este apartado"
    },
    en: {
      nextPlan: "Next plan",
      nextPlanEmpty: "You do not have a confirmed upcoming plan yet",
      communityLevel: "Connections",
      memberSince: "Active account",
      profileStatus: "Profile ready for your next group plan",
      pendingShort: "pending",
      sinceText: "active community",
      avatarFormatError: "The photo must be PNG, JPG, WEBP, HEIC, HEIF, or SVG.",
      avatarError: "We could not save your profile photo. Please try again with a different image.",
      profileError: "We could not save your profile changes. Please try again in a moment.",
      emailError: "Your profile was saved, but we could not update your account email.",
      unexpectedError: "An unexpected error happened while saving your profile.",
      essentialsEyebrow: "Overview",
      essentialsTitle: "Your space, ordered and clear",
      essentialsText:
        "Here you only see the essentials first. The rest opens one section at a time.",
      quickStatus: "Current status",
      accountSummary: "Account and basic details",
      openSection: "Open your space",
      openSectionText:
        "Choose the area you want to review now.",
      openSectionCta: "Open section",
      activeSectionCta: "Open now",
      upcomingDesc: "The confirmed plans already in your calendar and coming up next.",
      pendingDesc: "Requests that are still waiting for validation from Konexa.",
      pastDesc: "The history of plans you already lived and can revisit whenever you want.",
      sharedDesc: "The people you already know here and the familiarity you have built over time.",
      editDesc: "Update your photo, email, phone number, and the rest of your profile details.",
      communityDesc: "Open the Konexa community area directly from your profile.",
      emptyTitle: "Everything is still here, just without the clutter.",
      emptyText:
        "Pick a block to open the area you want to see.",
      backToOverview: "Back to overview",
      sectionLabel: "Open section",
      upcomingMeta: "{count} confirmed",
      pendingMeta: "{count} pending",
      pastMeta: "{count} completed",
      sharedMeta: "{count} connections",
      editMeta: "Details and photo",
      profileMainInfo: "Main information",
      activeSectionTitle: "You are currently looking at this section"
    }
  }[locale];

  const errorMessage =
    error === "avatar_format"
      ? profileUi.avatarFormatError
      : error === "avatar"
        ? profileUi.avatarError
        : error === "profile"
          ? profileUi.profileError
          : error === "email"
            ? profileUi.emailError
            : error === "unexpected"
              ? profileUi.unexpectedError
              : null;

  const sectionCards: ProfileCardItem[] = [
    {
      key: "upcoming",
      sectionId: "upcoming",
      accent: "01",
      eyebrow: messages.upcomingActivities,
      title: messages.scheduledPlans,
      description: profileUi.upcomingDesc,
      meta: t(profileUi.upcomingMeta, { count: dashboard.upcomingActivities.length })
    },
    {
      key: "pending",
      sectionId: "pending",
      accent: "02",
      eyebrow: messages.pendingActivities,
      title: messages.pendingPlans,
      description: profileUi.pendingDesc,
      meta: t(profileUi.pendingMeta, { count: dashboard.pendingActivities.length })
    },
    {
      key: "past",
      sectionId: "past",
      accent: "03",
      eyebrow: messages.pastActivities,
      title: messages.happenedPlans,
      description: profileUi.pastDesc,
      meta: t(profileUi.pastMeta, { count: dashboard.pastActivities.length })
    },
    {
      key: "shared",
      sectionId: "shared",
      accent: "04",
      eyebrow: messages.sharedConnectionsTitle,
      title: messages.sharedConnectionsTitle,
      description: profileUi.sharedDesc,
      meta: t(profileUi.sharedMeta, { count: dashboard.sharedConnections.length })
    },
    {
      key: "edit",
      sectionId: "edit",
      accent: "05",
      eyebrow: messages.editProfile,
      title: messages.editProfile,
      description: profileUi.editDesc,
      meta: profileUi.editMeta
    },
    {
      key: "community",
      accent: "06",
      eyebrow: messages.menuCommunity,
      title: messages.menuCommunity,
      description: profileUi.communityDesc,
      meta: profileUi.openSectionCta,
      href: "/comunitat"
    }
  ];

  const renderActivityList = (activities: DashboardActivity[], emptyMessage: string) => (
    <div className="stack-list">
      {activities.map((activity) => (
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
      {activities.length === 0 ? <p className="empty-state">{emptyMessage}</p> : null}
    </div>
  );

  const renderSectionBody = () => {
    switch (activeSection) {
      case "upcoming":
        return renderActivityList(dashboard.upcomingActivities, messages.noUpcoming);
      case "pending":
        return renderActivityList(dashboard.pendingActivities, messages.noPending);
      case "past":
        return renderActivityList(dashboard.pastActivities, messages.noPast);
      case "shared":
        return (
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
        );
      case "edit":
        return (
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
        );
      default:
        return null;
    }
  };

  const activeCard = sectionCards.find((section) => section.sectionId === activeSection) || null;

  return (
    <div className="page-stack profile-dashboard-shell">
      <section className="dashboard-panel profile-overview-panel">
        <div className="profile-overview-head">
          <div className="profile-overview-identity">
            <img
              src={dashboard.profile.avatarUrl}
              alt={dashboard.profile.name}
              width={112}
              height={112}
              className="avatar avatar-xl"
            />
            <div className="profile-overview-copy">
              <p className="eyebrow">{messages.myProfile}</p>
              <h1>{dashboard.profile.name}</h1>
              <p className="lede">{profileUi.essentialsText}</p>
              <div className="profile-overview-pills">
                <span className="pill">{profileUi.profileStatus}</span>
                <span className="pill pill-soft">
                  {nextActivity ? formatActivityDate(nextActivity.startsAt, locale) : profileUi.nextPlanEmpty}
                </span>
              </div>
            </div>
          </div>
          <Link href="/profile?section=edit" className="button button-secondary">
            {messages.editProfile}
          </Link>
        </div>

        {typeof saved === "string" ? (
          <p className="status status-success">{messages.profileSaved}</p>
        ) : null}
        {errorMessage ? <p className="status status-error">{errorMessage}</p> : null}

        <div className="profile-overview-summary">
          <article className="profile-overview-kpi">
            <span className="label">{profileUi.nextPlan}</span>
            <strong>{nextActivity ? nextActivity.title : profileUi.nextPlanEmpty}</strong>
            <p>{nextActivity ? formatActivityDate(nextActivity.startsAt, locale) : messages.noUpcoming}</p>
          </article>
          <article className="profile-overview-kpi">
            <span className="label">{messages.pendingActivities}</span>
            <strong>{dashboard.pendingActivities.length}</strong>
            <p>{messages.pendingPlans}</p>
          </article>
          <article className="profile-overview-kpi">
            <span className="label">{messages.sharedConnections}</span>
            <strong>{dashboard.sharedConnections.length}</strong>
            <p>{profileUi.communityLevel}</p>
          </article>
        </div>

        <div className="panel-head profile-basics-head">
          <div>
            <p className="eyebrow">{messages.personalInfo}</p>
            <h2>{messages.personalInfoTitle}</h2>
          </div>
          <p className="section-note">{profileUi.accountSummary}</p>
        </div>
        <div className="info-grid profile-basics-grid">
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
      </section>

      <section className="dashboard-panel profile-section-launcher-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{profileUi.openSection}</p>
            <h2>{profileUi.openSection}</h2>
          </div>
          <p className="section-note">{profileUi.openSectionText}</p>
        </div>
        <div className="profile-section-grid">
          {sectionCards.map((section) => (
            <ProfileSectionCard
              key={section.key}
              href={section.href || `/profile?section=${section.sectionId}`}
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
              meta={section.meta}
              accent={section.accent}
              openLabel={profileUi.openSectionCta}
              activeLabel={profileUi.activeSectionCta}
              active={section.sectionId === activeSection}
            />
          ))}
        </div>
      </section>

      {activeSection && activeCard ? (
        <section className="dashboard-panel profile-section-detail-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{profileUi.sectionLabel}</p>
              <h2>{activeCard.title}</h2>
            </div>
            <div className="profile-section-detail-actions">
              <p className="section-note">{profileUi.activeSectionTitle}</p>
              <Link href="/profile" className="text-link">
                {profileUi.backToOverview}
              </Link>
            </div>
          </div>
          {renderSectionBody()}
        </section>
      ) : null}
    </div>
  );
}
