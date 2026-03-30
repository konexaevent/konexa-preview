import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  deleteActivityAction,
  reviewPendingAction,
  saveActivityAction
} from "@/app/actions";
import { getLocale } from "@/lib/i18n-server";
import { getAdminDashboard, getCurrentUser } from "@/lib/queries";
import { formatActivityDate } from "@/lib/utils";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  const resolvedSearchParams = searchParams ? await searchParams : {};

  if (!user) {
    redirect("/login?next=/admin");
  }

  const dashboard = await getAdminDashboard(user.id);
  if (!dashboard) {
    redirect("/profile");
  }
  const pendingApprovals = dashboard.pendingApprovals.filter(Boolean) as Array<{
    activityId: string;
    activityTitle: string;
    activityDate: string;
    attendeeId: string;
    attendeeName: string;
    attendeeAvatarUrl: string;
    attendeeEmail?: string;
    attendeePhoneNumber?: string;
    requestMessage?: string;
    whatsappOptIn?: boolean;
  }>;

  const editId =
    typeof resolvedSearchParams.edit === "string" ? resolvedSearchParams.edit : "";
  const editingActivity =
    dashboard.activities.find((activity) => activity.id === editId) || null;

  const copy = {
    ca: {
      eyebrow: "Administracio Konexa",
      title: "Control total de les activitats i les sol·licituds",
      text: "Aquest espai només és per a tu. Pots crear activitats, editar-les, canviar imatges i revisar totes les peticions d'accés abans d'acceptar-les.",
      createTitle: editingActivity ? "Editar activitat" : "Crear nova activitat",
      createText: "Actualitza les dades clau de cada activitat i deixa preparada la imatge principal que veurà la gent.",
      existingImage: "Imatge actual",
      titleLabel: "Titol",
      summaryLabel: "Descripcio",
      dateLabel: "Data i hora",
      cityLabel: "Ciutat",
      ageLabel: "Franja d'edat",
      hostLabel: "Host assignat",
      seatsLabel: "Places maximes",
      approvalLabel: "Requereix aprovacio abans d'entrar",
      imageLabel: "Nova imatge",
      imageHelp: "Si puges una imatge nova, substituirà la imatge principal actual.",
      save: editingActivity ? "Desar canvis" : "Crear activitat",
      cancelEdit: "Cancelar edicio",
      activityList: "Activitats actives",
      activityListText: "Des d'aquí pots revisar quines estan obertes, editar-les o eliminar-les.",
      pendingTitle: "Sol·licituds pendents",
      pendingText: "Revisa qui s'ha volgut apuntar, el seu motiu i si ha acceptat entrar al grup temporal de WhatsApp.",
      edit: "Editar",
      delete: "Eliminar",
      noActivities: "Encara no hi ha activitats creades.",
      noPending: "No tens cap sol·licitud pendent ara mateix.",
      applicantEmail: "Correu",
      applicantPhone: "Telefon",
      applicantReason: "Motiu",
      applicantWhatsapp: "Permis WhatsApp",
      yes: "Si",
      no: "No",
      approve: "Acceptar",
      reject: "Rebutjar",
      pendingBadge: "pendents",
      confirmedBadge: "confirmades",
      saved: "Canvis desats correctament.",
      deleted: "Activitat eliminada correctament.",
      reviewed: "Sol·licitud revisada correctament."
    },
    es: {
      eyebrow: "Administracion Konexa",
      title: "Control total de actividades y solicitudes",
      text: "Este espacio es solo para ti. Puedes crear actividades, editarlas, cambiar imagenes y revisar todas las peticiones antes de aceptarlas.",
      createTitle: editingActivity ? "Editar actividad" : "Crear nueva actividad",
      createText: "Actualiza los datos clave de cada actividad y deja preparada la imagen principal que verá la gente.",
      existingImage: "Imagen actual",
      titleLabel: "Titulo",
      summaryLabel: "Descripcion",
      dateLabel: "Fecha y hora",
      cityLabel: "Ciudad",
      ageLabel: "Franja de edad",
      hostLabel: "Host asignado",
      seatsLabel: "Plazas maximas",
      approvalLabel: "Requiere aprobacion antes de entrar",
      imageLabel: "Nueva imagen",
      imageHelp: "Si subes una imagen nueva, sustituira la imagen principal actual.",
      save: editingActivity ? "Guardar cambios" : "Crear actividad",
      cancelEdit: "Cancelar edicion",
      activityList: "Actividades activas",
      activityListText: "Desde aqui puedes revisar cuales estan abiertas, editarlas o eliminarlas.",
      pendingTitle: "Solicitudes pendientes",
      pendingText: "Revisa quien ha querido apuntarse, su motivo y si ha aceptado entrar en el grupo temporal de WhatsApp.",
      edit: "Editar",
      delete: "Eliminar",
      noActivities: "Todavia no hay actividades creadas.",
      noPending: "No tienes solicitudes pendientes ahora mismo.",
      applicantEmail: "Correo",
      applicantPhone: "Telefono",
      applicantReason: "Motivo",
      applicantWhatsapp: "Permiso WhatsApp",
      yes: "Si",
      no: "No",
      approve: "Aceptar",
      reject: "Rechazar",
      pendingBadge: "pendientes",
      confirmedBadge: "confirmadas",
      saved: "Cambios guardados correctamente.",
      deleted: "Actividad eliminada correctamente.",
      reviewed: "Solicitud revisada correctamente."
    },
    en: {
      eyebrow: "Konexa admin",
      title: "Full control over activities and requests",
      text: "This space is only for you. You can create activities, edit them, swap images, and review every request before it gets accepted.",
      createTitle: editingActivity ? "Edit activity" : "Create new activity",
      createText: "Update the key details for each activity and prepare the main image people will see.",
      existingImage: "Current image",
      titleLabel: "Title",
      summaryLabel: "Description",
      dateLabel: "Date and time",
      cityLabel: "City",
      ageLabel: "Age range",
      hostLabel: "Assigned host",
      seatsLabel: "Max seats",
      approvalLabel: "Requires approval before joining",
      imageLabel: "New image",
      imageHelp: "If you upload a new image, it will replace the current hero image.",
      save: editingActivity ? "Save changes" : "Create activity",
      cancelEdit: "Cancel editing",
      activityList: "Active activities",
      activityListText: "From here you can review which ones are open, edit them, or remove them.",
      pendingTitle: "Pending requests",
      pendingText: "Review who asked to join, why they want to come, and whether they agreed to join the temporary WhatsApp group.",
      edit: "Edit",
      delete: "Delete",
      noActivities: "There are no activities yet.",
      noPending: "You have no pending requests right now.",
      applicantEmail: "Email",
      applicantPhone: "Phone",
      applicantReason: "Reason",
      applicantWhatsapp: "WhatsApp consent",
      yes: "Yes",
      no: "No",
      approve: "Approve",
      reject: "Reject",
      pendingBadge: "pending",
      confirmedBadge: "confirmed",
      saved: "Changes saved successfully.",
      deleted: "Activity deleted successfully.",
      reviewed: "Request reviewed successfully."
    }
  }[locale];

  return (
    <div className="page-stack">
      <section className="dashboard-panel admin-hero-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
          </div>
          <p className="section-note">{copy.text}</p>
        </div>
        <div className="admin-summary-grid">
          <article className="profile-highlight-card">
            <p className="label">{copy.activityList}</p>
            <strong>{dashboard.activities.length}</strong>
          </article>
          <article className="profile-highlight-card">
            <p className="label">{copy.pendingTitle}</p>
            <strong>{pendingApprovals.length}</strong>
          </article>
          <article className="profile-highlight-card">
            <p className="label">{copy.hostLabel}</p>
            <strong>{dashboard.hosts.length}</strong>
          </article>
        </div>
      </section>

      <section className="dashboard-grid admin-grid">
        <article className="dashboard-panel admin-form-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{copy.createTitle}</p>
              <h2>{copy.createTitle}</h2>
            </div>
            <p className="section-note">{copy.createText}</p>
          </div>
          {"saved" in resolvedSearchParams ? (
            <p className="status status-success">{copy.saved}</p>
          ) : null}
          {"deleted" in resolvedSearchParams ? (
            <p className="status status-success">{copy.deleted}</p>
          ) : null}
          {"review" in resolvedSearchParams ? (
            <p className="status status-success">{copy.reviewed}</p>
          ) : null}
          <form action={saveActivityAction} className="admin-activity-form">
            <input type="hidden" name="activity_id" value={editingActivity?.id || ""} />
            <input
              type="hidden"
              name="existing_image_url"
              value={editingActivity?.heroImageUrl || ""}
            />
            <div className="admin-form-grid">
              <label>
                {copy.titleLabel}
                <input
                  type="text"
                  name="title"
                  defaultValue={editingActivity?.title || ""}
                  required
                />
              </label>
              <label>
                {copy.dateLabel}
                <input
                  type="datetime-local"
                  name="starts_at"
                  defaultValue={
                    editingActivity ? toDateTimeLocal(editingActivity.startsAt) : ""
                  }
                  required
                />
              </label>
              <label className="admin-form-span-2">
                {copy.summaryLabel}
                <textarea
                  name="summary"
                  rows={4}
                  defaultValue={editingActivity?.summary || ""}
                  required
                />
              </label>
              <label>
                {copy.cityLabel}
                <input
                  type="text"
                  name="city"
                  defaultValue={editingActivity?.city || "Girona"}
                  required
                />
              </label>
              <label>
                {copy.ageLabel}
                <select name="age_range" defaultValue={editingActivity?.ageRange || "25-35"}>
                  <option value="18-25">18-25</option>
                  <option value="25-35">25-35</option>
                  <option value="35-50">35-50</option>
                  <option value="50+">50+</option>
                </select>
              </label>
              <label>
                {copy.hostLabel}
                <select name="host_user_id" defaultValue={editingActivity?.hostUserId || ""}>
                  <option value="">Sense host</option>
                  {dashboard.hosts.map((host) => (
                    <option key={host.id} value={host.id}>
                      {host.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {copy.seatsLabel}
                <input
                  type="number"
                  min="2"
                  max="20"
                  name="max_participants"
                  defaultValue={editingActivity?.maxParticipants || 8}
                  required
                />
              </label>
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="requires_approval"
                  defaultChecked={editingActivity?.requiresApproval || false}
                />
                <span>{copy.approvalLabel}</span>
              </label>
              <label className="admin-form-span-2">
                {copy.imageLabel}
                <input
                  type="file"
                  name="hero_image_file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                />
                <small>{copy.imageHelp}</small>
              </label>
            </div>
            {editingActivity?.heroImageUrl ? (
              <div className="admin-existing-image">
                <span>{copy.existingImage}</span>
                <Image
                  src={editingActivity.heroImageUrl}
                  alt={editingActivity.title}
                  width={240}
                  height={140}
                  className="admin-existing-image-frame"
                  unoptimized
                />
              </div>
            ) : null}
            <div className="admin-form-actions">
              <button className="button button-primary" type="submit">
                {copy.save}
              </button>
              {editingActivity ? (
                <Link href="/admin" className="button button-secondary">
                  {copy.cancelEdit}
                </Link>
              ) : null}
            </div>
          </form>
        </article>

        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{copy.activityList}</p>
              <h2>{copy.activityList}</h2>
            </div>
            <p className="section-note">{copy.activityListText}</p>
          </div>
          <div className="stack-list">
            {dashboard.activities.map((activity) => (
              <article className="admin-activity-card" key={activity.id}>
                <Image
                  src={activity.heroImageUrl}
                  alt={activity.title}
                  width={132}
                  height={92}
                  className="admin-activity-thumb"
                  unoptimized
                />
                <div className="admin-activity-copy">
                  <h3>{activity.title}</h3>
                  <p>{formatActivityDate(activity.startsAt, locale)}</p>
                  <small>
                    {activity.city} · {activity.ageRange} · {activity.hostName}
                  </small>
                  <div className="admin-badge-row">
                    <span className="signal-tag">
                      {activity.pendingCount} {copy.pendingBadge}
                    </span>
                    <span className="signal-tag">
                      {activity.confirmedCount} {copy.confirmedBadge}
                    </span>
                  </div>
                </div>
                <div className="approval-actions">
                  <Link href={`/admin?edit=${activity.id}`} className="button button-secondary button-small">
                    {copy.edit}
                  </Link>
                  <form action={deleteActivityAction}>
                    <input type="hidden" name="activity_id" value={activity.id} />
                    <button className="button button-ghost button-small" type="submit">
                      {copy.delete}
                    </button>
                  </form>
                </div>
              </article>
            ))}
            {dashboard.activities.length === 0 ? (
              <p className="empty-state">{copy.noActivities}</p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="dashboard-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{copy.pendingTitle}</p>
            <h2>{copy.pendingTitle}</h2>
          </div>
          <p className="section-note">{copy.pendingText}</p>
        </div>
        <div className="stack-list">
          {pendingApprovals.map((approval) => (
            <article className="approval-card admin-approval-card" key={`${approval.activityId}-${approval.attendeeId}`}>
              <div className="connection-head">
                <Image
                  src={approval.attendeeAvatarUrl}
                  alt={approval.attendeeName}
                  width={56}
                  height={56}
                  className="avatar"
                  unoptimized
                />
                <div>
                  <h3>{approval.attendeeName}</h3>
                  <p>{approval.activityTitle}</p>
                  <small>{formatActivityDate(approval.activityDate, locale)}</small>
                </div>
              </div>
              <div className="admin-request-meta">
                <p>
                  <strong>{copy.applicantEmail}:</strong> {approval.attendeeEmail || "-"}
                </p>
                <p>
                  <strong>{copy.applicantPhone}:</strong> {approval.attendeePhoneNumber || "-"}
                </p>
                <p>
                  <strong>{copy.applicantWhatsapp}:</strong>{" "}
                  {approval.whatsappOptIn ? copy.yes : copy.no}
                </p>
                <p>
                  <strong>{copy.applicantReason}:</strong> {approval.requestMessage || "-"}
                </p>
              </div>
              <div className="approval-actions">
                <form action={reviewPendingAction}>
                  <input type="hidden" name="activity_id" value={approval.activityId} />
                  <input type="hidden" name="attendee_id" value={approval.attendeeId} />
                  <input type="hidden" name="decision" value="confirmed" />
                  <button className="button button-primary button-small" type="submit">
                    {copy.approve}
                  </button>
                </form>
                <form action={reviewPendingAction}>
                  <input type="hidden" name="activity_id" value={approval.activityId} />
                  <input type="hidden" name="attendee_id" value={approval.attendeeId} />
                  <input type="hidden" name="decision" value="cancelled" />
                  <button className="button button-secondary button-small" type="submit">
                    {copy.reject}
                  </button>
                </form>
              </div>
            </article>
          ))}
          {pendingApprovals.length === 0 ? (
            <p className="empty-state">{copy.noPending}</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
