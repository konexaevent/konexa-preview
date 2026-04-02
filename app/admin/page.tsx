import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminActivityForm } from "@/components/admin-activity-form";
import { AdminActivityRoster } from "@/components/admin-activity-roster";
import {
  deleteActivityAction,
  reviewPendingAction,
  saveHeroCarouselAction,
  saveHostsContentAction,
  saveMemoriesContentAction
} from "@/app/actions";
import { getLocale } from "@/lib/i18n-server";
import { getAdminDashboard, getCurrentUser } from "@/lib/queries";
import { formatActivityDate } from "@/lib/utils";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

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
  const heroCarouselImages = dashboard.homepageContent.heroCarouselImages as string[];
  const homepageHosts = dashboard.homepageContent.hosts as Array<{
    age: string;
    name: string;
    role: string;
    bio: string;
    avatarUrl: string;
    videoUrl: string;
  }>;
  const hostOptions = homepageHosts.map((host) => {
    const linkedProfile = dashboard.hosts.find((entry) => entry.name === host.name);
    return {
      name: host.name,
      avatarUrl: host.avatarUrl,
      userId: linkedProfile?.id
    };
  });
  const memoriesItems = dashboard.homepageContent.memoriesItems as Array<{
    title: string;
    imageUrl: string;
  }>;

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
      priceLabel: "Preu",
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
      usersTitle: "Usuaris registrats",
      usersText: "Consulta qui s'ha registrat i obre la seva fitxa completa amb totes les dades.",
      usersEmpty: "Encara no hi ha usuaris registrats.",
      viewProfile: "Veure perfil",
      pendingText: "Revisa qui s'ha volgut apuntar, el seu motiu i si ha acceptat entrar al grup temporal de WhatsApp.",
      attendeesTitle: "Persones inscrites",
      attendeesEmpty: "Encara no hi ha cap persona inscrita en aquesta activitat.",
      whatsappTitle: "Grup de WhatsApp",
      whatsappText: "Copia els telèfons amb consentiment i crea el grup fàcilment des de WhatsApp.",
      copyPhones: "Copiar telèfons",
      copiedPhones: "Telèfons copiats",
      openWhatsapp: "Obrir WhatsApp",
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
      ,
      carouselTitle: "Carrusel del titular",
      carouselText: "Canvia les tres imatges grans que apareixen darrere del missatge principal de la portada.",
      hostsContentTitle: "Editar hosts",
      hostsContentText: "Actualitza nom, rol, foto, descripcio i video de presentacio de cada host.",
      memoriesTitle: "Moments reals",
      memoriesText: "Edita el video principal i les tres peces visuals de la zona multimedia.",
      currentImageLabel: "Imatge actual",
      imageFileLabel: "Nova imatge",
      videoUrlLabel: "URL del video",
      roleLabel: "Rol visible",
      imagePreviewTitle: "Previsualitzacio de la portada",
      imagePreviewText: "Ajusta l'enquadrament abans de desar per veure millor com quedara la imatge.",
      imageZoomLabel: "Zoom",
      imageHorizontalLabel: "Moure horitzontalment",
      imageVerticalLabel: "Moure verticalment",
      noImagePreview: "Puja una imatge per veure la previsualitzacio.",
      saveCarousel: "Desar carrusel",
      saveHosts: "Desar hosts",
      saveMemories: "Desar multimedia",
      hostsSaved: "Els hosts s'han actualitzat correctament.",
      hostsError: "No hem pogut desar els hosts. Revisa les dades o la configuracio de Supabase."
      ,
      operationsTitle: "Operativa del dia",
      operationsText:
        "Des d'aqui tens una lectura rapida del que requereix atencio avui: altes noves, activitats obertes i gestio de participants."
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
      priceLabel: "Precio",
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
      usersTitle: "Usuarios registrados",
      usersText: "Consulta quién se ha registrado y abre su ficha completa con todos los datos.",
      usersEmpty: "Todavía no hay usuarios registrados.",
      viewProfile: "Ver perfil",
      pendingText: "Revisa quien ha querido apuntarse, su motivo y si ha aceptado entrar en el grupo temporal de WhatsApp.",
      attendeesTitle: "Personas inscritas",
      attendeesEmpty: "Todavía no hay personas inscritas en esta actividad.",
      whatsappTitle: "Grupo de WhatsApp",
      whatsappText: "Copia los teléfonos con consentimiento y crea el grupo fácilmente desde WhatsApp.",
      copyPhones: "Copiar teléfonos",
      copiedPhones: "Teléfonos copiados",
      openWhatsapp: "Abrir WhatsApp",
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
      ,
      carouselTitle: "Carrusel del titular",
      carouselText: "Cambia las tres imagenes grandes que aparecen detras del mensaje principal de la portada.",
      hostsContentTitle: "Editar hosts",
      hostsContentText: "Actualiza nombre, rol, foto, descripcion y video de presentacion de cada host.",
      memoriesTitle: "Momentos reales",
      memoriesText: "Edita el video principal y las tres piezas visuales de la zona multimedia.",
      currentImageLabel: "Imagen actual",
      imageFileLabel: "Nueva imagen",
      videoUrlLabel: "URL del video",
      roleLabel: "Rol visible",
      imagePreviewTitle: "Previsualizacion de la portada",
      imagePreviewText: "Ajusta el encuadre antes de guardar para ver mejor como quedara la imagen.",
      imageZoomLabel: "Zoom",
      imageHorizontalLabel: "Mover horizontalmente",
      imageVerticalLabel: "Mover verticalmente",
      noImagePreview: "Sube una imagen para ver la previsualizacion.",
      saveCarousel: "Guardar carrusel",
      saveHosts: "Guardar hosts",
      saveMemories: "Guardar multimedia",
      hostsSaved: "Los hosts se han actualizado correctamente.",
      hostsError: "No hemos podido guardar los hosts. Revisa los datos o la configuracion de Supabase."
      ,
      operationsTitle: "Operativa del dia",
      operationsText:
        "Desde aqui tienes una lectura rapida de lo que requiere atencion hoy: altas nuevas, actividades abiertas y gestion de participantes."
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
      priceLabel: "Price",
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
      usersTitle: "Registered users",
      usersText: "See who has signed up and open their full profile with all details.",
      usersEmpty: "There are no registered users yet.",
      viewProfile: "View profile",
      pendingText: "Review who asked to join, why they want to come, and whether they agreed to join the temporary WhatsApp group.",
      attendeesTitle: "Registered people",
      attendeesEmpty: "There is no one registered for this activity yet.",
      whatsappTitle: "WhatsApp group",
      whatsappText: "Copy the consented phone numbers and create the group quickly from WhatsApp.",
      copyPhones: "Copy phones",
      copiedPhones: "Phones copied",
      openWhatsapp: "Open WhatsApp",
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
      ,
      carouselTitle: "Hero carousel",
      carouselText: "Change the three large images shown behind the main message on the homepage.",
      hostsContentTitle: "Edit hosts",
      hostsContentText: "Update each host's name, visible role, photo, bio, and intro video.",
      memoriesTitle: "Real moments",
      memoriesText: "Edit the main video and the three visual pieces in the multimedia section.",
      currentImageLabel: "Current image",
      imageFileLabel: "New image",
      videoUrlLabel: "Video URL",
      roleLabel: "Visible role",
      imagePreviewTitle: "Hero preview",
      imagePreviewText: "Adjust the framing before saving so you can see how the image will look.",
      imageZoomLabel: "Zoom",
      imageHorizontalLabel: "Move horizontally",
      imageVerticalLabel: "Move vertically",
      noImagePreview: "Upload an image to preview it here.",
      saveCarousel: "Save carousel",
      saveHosts: "Save hosts",
      saveMemories: "Save media",
      hostsSaved: "Hosts updated successfully.",
      hostsError: "We could not save the hosts. Please review the data or your Supabase setup."
      ,
      operationsTitle: "Day-to-day operations",
      operationsText:
        "This gives you a quick read on what needs attention today: new users, open activities, and participant coordination."
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
          <article className="profile-highlight-card">
            <p className="label">{copy.usersTitle}</p>
            <strong>{dashboard.users.length}</strong>
          </article>
        </div>
      </section>

      <section className="dashboard-panel admin-operations-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{copy.operationsTitle}</p>
            <h2>{copy.operationsTitle}</h2>
          </div>
          <p className="section-note">{copy.operationsText}</p>
        </div>
        <div className="admin-operations-grid">
          <article className="admin-operation-card">
            <strong>{dashboard.users.length}</strong>
            <p>{copy.usersTitle}</p>
            <small>{copy.usersText}</small>
          </article>
          <article className="admin-operation-card">
            <strong>{pendingApprovals.length}</strong>
            <p>{copy.pendingTitle}</p>
            <small>{copy.pendingText}</small>
          </article>
          <article className="admin-operation-card">
            <strong>{dashboard.activities.reduce((total, activity) => total + activity.attendees.length, 0)}</strong>
            <p>{copy.attendeesTitle}</p>
            <small>{copy.whatsappText}</small>
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
          <AdminActivityForm
            editingActivity={editingActivity}
            hosts={hostOptions}
            copy={{
              titleLabel: copy.titleLabel,
              dateLabel: copy.dateLabel,
              priceLabel: copy.priceLabel,
              summaryLabel: copy.summaryLabel,
              cityLabel: copy.cityLabel,
              ageLabel: copy.ageLabel,
              hostLabel: copy.hostLabel,
              seatsLabel: copy.seatsLabel,
              approvalLabel: copy.approvalLabel,
              imageLabel: copy.imageLabel,
              imageHelp: copy.imageHelp,
              existingImage: copy.existingImage,
              save: copy.save,
              cancelEdit: copy.cancelEdit,
              imagePreviewTitle: copy.imagePreviewTitle,
              imagePreviewText: copy.imagePreviewText,
              imageZoomLabel: copy.imageZoomLabel,
              imageHorizontalLabel: copy.imageHorizontalLabel,
              imageVerticalLabel: copy.imageVerticalLabel,
              noImagePreview: copy.noImagePreview
            }}
          />
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
                  style={{
                    objectPosition: `${activity.imageFocusX ?? 50}% ${activity.imageFocusY ?? 50}%`,
                    transform: `scale(${activity.imageZoom ?? 1})`
                  }}
                  unoptimized
                />
                <div className="admin-activity-copy">
                  <h3>{activity.title}</h3>
                  <p>{formatActivityDate(activity.startsAt, locale)}</p>
                  <small>
                    {activity.city} · {activity.ageRange} · {activity.hostName}
                  </small>
                  <p className="admin-activity-price">{activity.price}</p>
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
                <div className="admin-activity-roster-wrap">
                  <AdminActivityRoster
                    activityTitle={activity.title}
                    attendees={activity.attendees}
                    copy={{
                      attendeesTitle: copy.attendeesTitle,
                      attendeesEmpty: copy.attendeesEmpty,
                      whatsappTitle: copy.whatsappTitle,
                      whatsappText: copy.whatsappText,
                      copyPhones: copy.copyPhones,
                      copiedPhones: copy.copiedPhones,
                      openWhatsapp: copy.openWhatsapp,
                      pendingBadge: copy.pendingBadge,
                      confirmedBadge: copy.confirmedBadge,
                      emailLabel: copy.applicantEmail,
                      phoneLabel: copy.applicantPhone,
                      whatsappLabel: copy.applicantWhatsapp,
                      reasonLabel: copy.applicantReason,
                      yes: copy.yes,
                      no: copy.no
                    }}
                  />
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
            <p className="eyebrow">{copy.usersTitle}</p>
            <h2>{copy.usersTitle}</h2>
          </div>
          <p className="section-note">{copy.usersText}</p>
        </div>
        <div className="stack-list">
          {dashboard.users.map((entry) => (
            <article className="admin-user-card" key={entry.id}>
              <div className="admin-user-main">
                <img
                  src={entry.avatarUrl}
                  alt={entry.name}
                  width={56}
                  height={56}
                  className="avatar"
                />
                <div className="admin-user-copy">
                  <h3>{entry.name}</h3>
                  <p>{entry.email || "-"}</p>
                  <small>{entry.phoneNumber || "-"}</small>
                </div>
              </div>
              <div className="admin-user-actions">
                <span className="pill pill-soft">{entry.role}</span>
                <Link href={`/admin/users/${entry.id}`} className="button button-secondary button-small">
                  {copy.viewProfile}
                </Link>
              </div>
            </article>
          ))}
          {dashboard.users.length === 0 ? (
            <p className="empty-state">{copy.usersEmpty}</p>
          ) : null}
        </div>
      </section>

      <section className="dashboard-grid admin-grid">
        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{copy.carouselTitle}</p>
              <h2>{copy.carouselTitle}</h2>
            </div>
            <p className="section-note">{copy.carouselText}</p>
          </div>
          <form action={saveHeroCarouselAction} className="admin-activity-form">
            <div className="admin-form-grid">
              {heroCarouselImages.map((imageUrl: string, index: number) => (
                <div className="admin-form-span-2 admin-media-block" key={`hero-${index + 1}`}>
                  <label>
                    {copy.currentImageLabel} {index + 1}
                    <input type="hidden" name={`image_${index + 1}_current`} value={imageUrl} />
                    <div className="admin-inline-image-preview">
                      <Image src={imageUrl} alt={`Carousel ${index + 1}`} fill className="activity-image" unoptimized />
                    </div>
                  </label>
                  <label>
                    {copy.imageFileLabel} {index + 1}
                    <input
                      type="file"
                      name={`image_${index + 1}_file`}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    />
                  </label>
                </div>
              ))}
            </div>
            <div className="admin-form-actions">
              <button className="button button-primary" type="submit">
                {copy.saveCarousel}
              </button>
            </div>
          </form>
        </article>

        <article className="dashboard-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">{copy.memoriesTitle}</p>
              <h2>{copy.memoriesTitle}</h2>
            </div>
            <p className="section-note">{copy.memoriesText}</p>
          </div>
          <form action={saveMemoriesContentAction} className="admin-activity-form">
            <div className="admin-form-grid">
              <label className="admin-form-span-2">
                {copy.videoUrlLabel}
                <input
                  type="text"
                  name="memories_video_url"
                  defaultValue={dashboard.homepageContent.memoriesVideoUrl}
                />
              </label>
              {memoriesItems.map((item, index: number) => (
                <div className="admin-form-span-2 admin-media-block" key={`memory-${index + 1}`}>
                  <label>
                    {copy.titleLabel} {index + 1}
                    <input
                      type="text"
                      name={`memory_${index + 1}_title`}
                      defaultValue={item.title}
                    />
                  </label>
                  <label>
                    {copy.currentImageLabel} {index + 1}
                    <input type="hidden" name={`memory_${index + 1}_image_current`} value={item.imageUrl} />
                    <div className="admin-inline-image-preview">
                      <Image src={item.imageUrl} alt={item.title} fill className="activity-image" unoptimized />
                    </div>
                  </label>
                  <label>
                    {copy.imageFileLabel} {index + 1}
                    <input
                      type="file"
                      name={`memory_${index + 1}_image_file`}
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    />
                  </label>
                </div>
              ))}
            </div>
            <div className="admin-form-actions">
              <button className="button button-primary" type="submit">
                {copy.saveMemories}
              </button>
            </div>
          </form>
        </article>
      </section>

      <section className="dashboard-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">{copy.hostsContentTitle}</p>
            <h2>{copy.hostsContentTitle}</h2>
          </div>
          <p className="section-note">{copy.hostsContentText}</p>
        </div>
        {"hosts_saved" in resolvedSearchParams ? (
          <p className="status status-success">{copy.hostsSaved}</p>
        ) : null}
        {"hosts_error" in resolvedSearchParams ? (
          <p className="status status-error">{copy.hostsError}</p>
        ) : null}
        <form action={saveHostsContentAction} className="admin-activity-form">
          <div className="admin-host-grid">
            {homepageHosts.map((host, index: number) => (
              <article className="admin-host-card" key={host.age}>
                <span className="signal-tag">{host.age}</span>
                <label>
                  {copy.titleLabel}
                  <input type="text" name={`host_${index + 1}_name`} defaultValue={host.name} />
                </label>
                <label>
                  {copy.roleLabel}
                  <input type="text" name={`host_${index + 1}_role`} defaultValue={host.role} />
                </label>
                <label>
                  {copy.summaryLabel}
                  <textarea name={`host_${index + 1}_bio`} rows={4} defaultValue={host.bio} />
                </label>
                <label>
                  {copy.currentImageLabel}
                  <input type="hidden" name={`host_${index + 1}_avatar_current`} defaultValue={host.avatarUrl} />
                  <div className="admin-inline-image-preview admin-inline-avatar-preview">
                    <Image src={host.avatarUrl} alt={host.name} fill className="activity-image" unoptimized />
                  </div>
                </label>
                <label>
                  {copy.imageFileLabel}
                  <input
                    type="file"
                    name={`host_${index + 1}_avatar_file`}
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  />
                </label>
                <label>
                  {copy.videoUrlLabel}
                  <input
                    type="text"
                    name={`host_${index + 1}_video_url`}
                    defaultValue={host.videoUrl}
                  />
                </label>
              </article>
            ))}
          </div>
          <div className="admin-form-actions">
            <button className="button button-primary" type="submit">
              {copy.saveHosts}
            </button>
          </div>
        </form>
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
                <img
                  src={approval.attendeeAvatarUrl}
                  alt={approval.attendeeName}
                  width={56}
                  height={56}
                  className="avatar"
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
