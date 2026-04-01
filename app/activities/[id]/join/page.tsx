import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JoinRequestForm } from "@/components/join-request-form";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getActivityDetail, getCurrentUser, getProfileDashboard } from "@/lib/queries";
import { formatActivityDate } from "@/lib/utils";

type JoinActivityPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JoinActivityPage({
  params,
  searchParams
}: JoinActivityPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const [user, locale, messages] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);
  const [detail, dashboard] = await Promise.all([
    getActivityDetail(id, user?.id ?? null),
    user ? getProfileDashboard(user.id) : Promise.resolve(null)
  ]);

  if (!detail) {
    notFound();
  }

  const joinUi = {
    ca: {
      eyebrow: "Sol.licitud d'assistencia",
      title: "Explica'ns una mica abans d'apuntar-te",
      text:
        "Això ens ajuda a cuidar l'ambient del grup i gestionar millor l'aforament abans de confirmar la teva plaça.",
      aboutYou: "Les teves dades",
      phoneHint: "Necessitem el teu telefon per poder contactar-te si hi ha algun canvi o detall logistic.",
      motivation: "Per que vols venir a aquesta activitat?",
      motivationPlaceholder:
        "Explica breument que t'agradaria trobar-hi o per que et ve de gust venir.",
      whatsappConsent:
        "En enviar la sol.licitud, acceptes que et puguem afegir a un grup de WhatsApp temporal per facilitar la gestio d'aquesta activitat.",
      submit: "Enviar sol.licitud",
      success:
        "Ja estas apuntat/da. Aquesta sol.licitud no garanteix l'assistencia: l'organitzacio ha d'acceptar la peticio segons l'aforament.",
      loggedInHint:
        "Com que ja tens sessio iniciada, la teva peticio quedara pendent de confirmar.",
      noAccountHint:
        "Si encara no tens compte, el crearem amb aquest correu i aquesta contrasenya quan enviis la sol.licitud.",
      passwordLabel: "Contrasenya",
      passwordHint:
        "La necessitaras despres per iniciar sessio i consultar el teu perfil o les teves activitats.",
      passwordError: "La contrasenya ha de tenir com a minim 8 caracters.",
      credentialsError:
        "Aquest correu ja existeix i la contrasenya no coincideix. Inicia sessio amb la correcta o recupera el compte.",
      genericError: "No hem pogut tramitar la sol.licitud. Revisa les dades i torna-ho a provar.",
      chooseAccountState: "Ja tens compte a Konexa?",
      registeredChoice: "Si, ja estic registrat/da",
      newChoice: "No, vull crear el compte ara",
      existingAccountHint:
        "Introdueix el teu correu i la teva contrasenya per validar el compte abans d'enviar la sol.licitud.",
      back: "Tornar a l'activitat"
    },
    es: {
      eyebrow: "Solicitud de asistencia",
      title: "Cuéntanos un poco antes de apuntarte",
      text:
        "Esto nos ayuda a cuidar el ambiente del grupo y gestionar mejor el aforo antes de confirmar tu plaza.",
      aboutYou: "Tus datos",
      phoneHint:
        "Necesitamos tu telefono para poder contactarte si hay algun cambio o detalle logistico.",
      motivation: "¿Por qué quieres venir a esta actividad?",
      motivationPlaceholder:
        "Explica brevemente qué te gustaría encontrar o por qué te apetece venir.",
      whatsappConsent:
        "Al enviar la solicitud, aceptas que podamos anadirte a un grupo temporal de WhatsApp para facilitar la gestion de esta actividad.",
      submit: "Enviar solicitud",
      success:
        "Ya estás apuntado/a. Esta solicitud no garantiza la asistencia: la organización debe aceptar la petición según el aforo.",
      loggedInHint:
        "Como ya tienes la sesión iniciada, tu petición quedará pendiente de confirmar.",
      noAccountHint:
        "Si todavía no tienes cuenta, la crearemos con este correo y esta contrasena al enviar la solicitud.",
      passwordLabel: "Contrasena",
      passwordHint:
        "La necesitarás después para iniciar sesión y consultar tu perfil o tus actividades.",
      passwordError: "La contrasena debe tener al menos 8 caracteres.",
      credentialsError:
        "Este correo ya existe y la contrasena no coincide. Inicia sesión con la correcta o recupera la cuenta.",
      genericError: "No hemos podido tramitar la solicitud. Revisa los datos y vuelve a intentarlo.",
      chooseAccountState: "¿Ya tienes cuenta en Konexa?",
      registeredChoice: "Sí, ya estoy registrado/a",
      newChoice: "No, quiero crear la cuenta ahora",
      existingAccountHint:
        "Introduce tu correo y tu contrasena para validar la cuenta antes de enviar la solicitud.",
      back: "Volver a la actividad"
    },
    en: {
      eyebrow: "Attendance request",
      title: "Tell us a bit before you join",
      text:
        "This helps us protect the group atmosphere and manage capacity before confirming your spot.",
      aboutYou: "Your details",
      phoneHint:
        "We need your phone number so we can contact you if there is any change or logistics update.",
      motivation: "Why would you like to join this activity?",
      motivationPlaceholder:
        "Briefly share what you would love to find there or why you feel like joining.",
      whatsappConsent:
        "By sending this request, you agree that we may add you to a temporary WhatsApp group to help coordinate this activity.",
      submit: "Send request",
      success:
        "You are now signed up. This request does not guarantee attendance: the organizers must accept it depending on capacity.",
      loggedInHint:
        "Because you are already signed in, your request will stay pending until it is reviewed.",
      noAccountHint:
        "If you do not have an account yet, we will create it with this email and password when you submit the request.",
      passwordLabel: "Password",
      passwordHint:
        "You will need it later to sign in and check your profile or your activities.",
      passwordError: "Your password must be at least 8 characters long.",
      credentialsError:
        "This email already exists and the password does not match. Sign in with the correct one or recover the account.",
      genericError: "We could not submit your request. Please review your details and try again.",
      chooseAccountState: "Do you already have a Konexa account?",
      registeredChoice: "Yes, I am already registered",
      newChoice: "No, I want to create it now",
      existingAccountHint:
        "Enter your email and password so we can validate your account before sending the request.",
      back: "Back to activity"
    }
  }[locale];

  const requested = typeof resolvedSearchParams.requested === "string";
  const errorCode = typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : null;
  const profile = dashboard?.profile;
  const userMetadata = (user?.user_metadata || {}) as Record<string, string | undefined>;
  const fullName =
    profile?.name ||
    userMetadata.full_name ||
    "";
  const [firstName = "", ...lastNameParts] = fullName.split(" ");
  const lastName = profile?.lastName || lastNameParts.join(" ");
  const email = profile?.email || user?.email || "";
  const birthDate = profile?.birthDate || userMetadata.birth_date || "";
  const phoneNumber = profile?.phoneNumber || userMetadata.phone_number || "";

  return (
    <div className="page-stack">
      <section className="join-request-layout">
        <article className="join-request-activity-card">
          <div className="join-request-cover">
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
          <div className="join-request-copy">
            <p className="eyebrow">{joinUi.eyebrow}</p>
            <h1>{detail.title}</h1>
            <p className="lede">{detail.summary}</p>
            <div className="detail-meta-grid">
              <article>
                <strong>{messages.date}</strong>
                <p>{formatActivityDate(detail.startsAt, locale)}</p>
              </article>
              <article>
                <strong>{messages.cityLabel}</strong>
                <p>{detail.city}</p>
              </article>
              <article>
                <strong>{messages.priceLabel}</strong>
                <p>{detail.price}</p>
              </article>
              <article>
                <strong>{messages.participants}</strong>
                <p>{detail.participantCount}/{detail.maxParticipants}</p>
              </article>
            </div>
            <Link href={`/activities/${detail.id}`} className="text-link join-request-back-link">
              {joinUi.back}
            </Link>
          </div>
        </article>

        <article className="join-request-form-card">
          <JoinRequestForm
            activityId={detail.id}
            redirectTo={`/activities/${detail.id}/join`}
            isLoggedIn={Boolean(user)}
            requested={requested}
            errorCode={errorCode}
            joinUi={joinUi}
            messages={{
              firstName: messages.firstName,
              lastName: messages.lastName,
              email: messages.email,
              birthDate: messages.birthDate,
              phone: messages.phone
            }}
            defaults={{
              firstName,
              lastName,
              email,
              birthDate,
              phoneNumber
            }}
          />
        </article>
      </section>
    </div>
  );
}
