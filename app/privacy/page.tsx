import { getLocale } from "@/lib/i18n-server";

export default async function PrivacyPage() {
  const locale = await getLocale();

  const copy = {
    ca: {
      eyebrow: "Legal",
      title: "Política de privacitat",
      intro:
        "Aquesta política explica com Konexa tracta les dades personals de les persones que visiten el lloc web, creen un compte, editen el seu perfil, sol·liciten plaça a una activitat o interaccionen amb els serveis disponibles a la plataforma.",
      updateLabel: "Última actualització",
      updateValue: "3 d’abril de 2026",
      sections: [
        {
          title: "1. Responsable del tractament",
          paragraphs: [
            "Responsable: Konexa, projecte operat des d’Espanya.",
            "Correu de contacte: konexaevents@gmail.com.",
            "De conformitat amb el Reglament (UE) 2016/679 (RGPD) i la normativa espanyola aplicable, Konexa tracta les dades personals per gestionar l’accés a la plataforma, l’organització d’activitats i la relació amb les persones usuàries."
          ]
        },
        {
          title: "2. Dades que recollim",
          paragraphs: [
            "Podem recollir dades identificatives i de contacte com ara nom, cognoms, correu electrònic, telèfon, data de naixement i foto de perfil.",
            "També podem tractar dades relacionades amb el compte i l’ús del servei: idioma, sessions, reserves, sol·licituds d’assistència, estat de confirmació, activitats compartides i missatges enviats als formularis.",
            "Quan una persona sol·licita una activitat, també es poden tractar dades necessàries per gestionar la plaça, la comunicació prèvia i, si escau, la coordinació per WhatsApp."
          ]
        },
        {
          title: "3. Finalitats del tractament",
          paragraphs: [
            "Fem servir les dades per crear i administrar comptes d’usuari, permetre l’inici de sessió, mantenir el perfil i guardar preferències bàsiques com l’idioma.",
            "També les fem servir per gestionar activitats: rebre sol·licituds, revisar aforament, confirmar o rebutjar reserves, mostrar activitat futura o passada, coordinar l’assistència i facilitar l’operativa interna de Konexa.",
            "Això inclou respondre consultes, atendre incidències, enviar comunicacions estrictament vinculades al compte o a l’activitat reservada i, si la persona usuària ho autoritza, facilitar la coordinació mitjançant grups temporals de WhatsApp.",
            "Konexa no utilitza actualment les dades personals per enviar comunicacions comercials o publicitàries."
          ]
        },
        {
          title: "4. Base jurídica",
          paragraphs: [
            "La base principal del tractament és l’execució de la relació precontractual o contractual quan una persona crea un compte, inicia sessió, edita el seu perfil o demana participar en una activitat.",
            "Determinats tractaments es basen en l’interès legítim de Konexa per garantir la seguretat del servei, moderar l’accés a activitats, gestionar incidències i protegir la comunitat.",
            "Quan calgui consentiment, com en la coordinació per canals concrets o en eventuals cookies no essencials, aquest consentiment es pot retirar en qualsevol moment sense afectar la licitud del tractament anterior."
          ]
        },
        {
          title: "5. Conservació de les dades",
          paragraphs: [
            "Les dades es conserven mentre el compte estigui actiu o mentre siguin necessàries per prestar el servei i gestionar activitats o incidències associades.",
            "Posteriorment es poden conservar bloquejades durant el temps necessari per complir obligacions legals, resoldre reclamacions o defensar possibles responsabilitats derivades de la relació amb la persona usuària."
          ]
        },
        {
          title: "6. Destinataris i encarregats de tractament",
          paragraphs: [
            "Konexa no ven dades personals a tercers.",
            "Per prestar el servei utilitza proveïdors tecnològics que poden accedir a dades en qualitat d’encarregats del tractament, com ara serveis d’allotjament, base de dades, autenticació, emmagatzematge d’imatges, enviament de correus i desplegament web.",
            "Actualment la plataforma pot recolzar-se en serveis com Supabase, Vercel, Google i WhatsApp, exclusivament per a la gestió tècnica de la plataforma, les comunicacions necessàries i la coordinació de determinades activitats quan correspongui."
          ]
        },
        {
          title: "7. Drets de les persones usuàries",
          paragraphs: [
            "Pots sol·licitar l’accés, la rectificació, la supressió, la limitació del tractament, l’oposició i, quan sigui aplicable, la portabilitat de les teves dades.",
            "També pots retirar el consentiment per als tractaments basats en consentiment sense que això afecti la licitud del tractament anterior.",
            "Per exercir aquests drets pots escriure a konexaevents@gmail.com.",
            "Si consideres que els teus drets no han estat atesos adequadament, pots presentar una reclamació davant l’Agència Espanyola de Protecció de Dades (AEPD)."
          ]
        },
        {
          title: "8. Menors d’edat",
          paragraphs: [
            "Konexa està orientada exclusivament a persones majors de 18 anys o amb capacitat legal suficient per utilitzar el servei i apuntar-se a activitats.",
            "Si detectem que s’han facilitat dades d’una persona que no compleix aquests requisits, podrem eliminar-les o limitar l’accés al servei."
          ]
        },
        {
          title: "9. Seguretat",
          paragraphs: [
            "Konexa adopta mesures tècniques i organitzatives raonables per protegir les dades personals davant accessos no autoritzats, pèrdues, alteracions o divulgacions indegudes.",
            "Tot i això, cap sistema és completament invulnerable i per això es recomana fer servir contrasenyes robustes i no compartir les credencials d’accés."
          ]
        },
        {
          title: "10. Contacte",
          paragraphs: [
            "Si tens dubtes sobre aquesta política o sobre com es tracten les teves dades, pots escriure a konexaevents@gmail.com."
          ]
        }
      ]
    },
    es: {
      eyebrow: "Legal",
      title: "Política de privacidad",
      intro:
        "Esta política explica cómo Konexa trata los datos personales de las personas que visitan la web, crean una cuenta, editan su perfil, solicitan plaza en una actividad o interactúan con los servicios disponibles en la plataforma.",
      updateLabel: "Última actualización",
      updateValue: "3 de abril de 2026",
      sections: [
        {
          title: "1. Responsable del tratamiento",
          paragraphs: [
            "Responsable: Konexa, proyecto operado desde España.",
            "Correo de contacto: konexaevents@gmail.com.",
            "De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la normativa española aplicable, Konexa trata datos personales para gestionar el acceso a la plataforma, la organización de actividades y la relación con las personas usuarias."
          ]
        },
        {
          title: "2. Datos que recopilamos",
          paragraphs: [
            "Podemos recopilar datos identificativos y de contacto como nombre, apellidos, correo electrónico, teléfono, fecha de nacimiento y foto de perfil.",
            "También podemos tratar datos relacionados con la cuenta y con el uso del servicio: idioma, sesiones, reservas, solicitudes de asistencia, estado de confirmación, actividades compartidas y mensajes enviados en formularios.",
            "Cuando una persona solicita una actividad, también pueden tratarse datos necesarios para gestionar la plaza, la comunicación previa y, en su caso, la coordinación por WhatsApp."
          ]
        },
        {
          title: "3. Finalidades del tratamiento",
          paragraphs: [
            "Usamos los datos para crear y administrar cuentas de usuario, permitir el inicio de sesión, mantener el perfil y guardar preferencias básicas como el idioma.",
            "También los utilizamos para gestionar actividades: recibir solicitudes, revisar aforo, confirmar o rechazar reservas, mostrar actividad futura o pasada, coordinar la asistencia y facilitar la operativa interna de Konexa.",
            "Esto incluye responder consultas, atender incidencias, enviar comunicaciones estrictamente vinculadas a la cuenta o a la actividad reservada y, si la persona usuaria lo autoriza, facilitar la coordinación mediante grupos temporales de WhatsApp.",
            "Konexa no utiliza actualmente los datos personales para enviar comunicaciones comerciales o publicitarias."
          ]
        },
        {
          title: "4. Base jurídica",
          paragraphs: [
            "La base principal del tratamiento es la ejecución de la relación precontractual o contractual cuando una persona crea una cuenta, inicia sesión, edita su perfil o solicita participar en una actividad.",
            "Determinados tratamientos se basan en el interés legítimo de Konexa para garantizar la seguridad del servicio, moderar el acceso a actividades, gestionar incidencias y proteger la comunidad.",
            "Cuando sea necesario consentimiento, como en coordinaciones por canales concretos o en eventuales cookies no esenciales, este podrá retirarse en cualquier momento sin afectar a la licitud del tratamiento previo."
          ]
        },
        {
          title: "5. Conservación de los datos",
          paragraphs: [
            "Los datos se conservan mientras la cuenta permanezca activa o mientras sean necesarios para prestar el servicio y gestionar actividades o incidencias asociadas.",
            "Posteriormente pueden conservarse bloqueados durante el tiempo necesario para cumplir obligaciones legales, resolver reclamaciones o defender posibles responsabilidades derivadas de la relación con la persona usuaria."
          ]
        },
        {
          title: "6. Destinatarios y encargados del tratamiento",
          paragraphs: [
            "Konexa no vende datos personales a terceros.",
            "Para prestar el servicio utiliza proveedores tecnológicos que pueden acceder a datos en calidad de encargados del tratamiento, como servicios de alojamiento, base de datos, autenticación, almacenamiento de imágenes, envío de correos y despliegue web.",
            "Actualmente la plataforma puede apoyarse en servicios como Supabase, Vercel, Google y WhatsApp, exclusivamente para la gestión técnica de la plataforma, las comunicaciones necesarias y la coordinación de determinadas actividades cuando corresponda."
          ]
        },
        {
          title: "7. Derechos de las personas usuarias",
          paragraphs: [
            "Puedes solicitar acceso, rectificación, supresión, limitación del tratamiento, oposición y, cuando sea aplicable, portabilidad de tus datos.",
            "También puedes retirar el consentimiento para los tratamientos basados en consentimiento sin que ello afecte a la licitud del tratamiento previo.",
            "Para ejercer estos derechos puedes escribir a konexaevents@gmail.com.",
            "Si consideras que tus derechos no han sido atendidos adecuadamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD)."
          ]
        },
        {
          title: "8. Menores de edad",
          paragraphs: [
            "Konexa está orientada exclusivamente a personas mayores de 18 años o con capacidad legal suficiente para usar el servicio y apuntarse a actividades.",
            "Si detectamos que se han facilitado datos de una persona que no cumple estos requisitos, podremos eliminarlos o limitar el acceso al servicio."
          ]
        },
        {
          title: "9. Seguridad",
          paragraphs: [
            "Konexa adopta medidas técnicas y organizativas razonables para proteger los datos personales frente a accesos no autorizados, pérdidas, alteraciones o divulgaciones indebidas.",
            "Aun así, ningún sistema es completamente invulnerable y por ello se recomienda utilizar contraseñas robustas y no compartir las credenciales de acceso."
          ]
        },
        {
          title: "10. Contacto",
          paragraphs: [
            "Si tienes dudas sobre esta política o sobre cómo se tratan tus datos, puedes escribir a konexaevents@gmail.com."
          ]
        }
      ]
    },
    en: {
      eyebrow: "Legal",
      title: "Privacy policy",
      intro:
        "This policy explains how Konexa processes personal data when people visit the website, create an account, edit their profile, request a place in an activity, or interact with services available through the platform.",
      updateLabel: "Last updated",
      updateValue: "April 3, 2026",
      sections: [
        {
          title: "1. Data controller",
          paragraphs: [
            "Controller: Konexa, a project operated from Spain.",
            "Contact email: konexaevents@gmail.com.",
            "In accordance with Regulation (EU) 2016/679 (GDPR) and applicable Spanish data protection rules, Konexa processes personal data in order to manage access to the platform, organize activities, and maintain its relationship with users."
          ]
        },
        {
          title: "2. Data we collect",
          paragraphs: [
            "We may collect identification and contact data such as first name, last name, email address, phone number, birth date, and profile photo.",
            "We may also process account and service-use data such as language, sessions, bookings, attendance requests, confirmation status, shared activities, and messages submitted through forms.",
            "When someone requests access to an activity, we may also process information necessary to manage the place, prior communication, and, where applicable, WhatsApp coordination."
          ]
        },
        {
          title: "3. Purposes of processing",
          paragraphs: [
            "We use data to create and manage user accounts, allow sign-in, maintain user profiles, and store basic preferences such as language.",
            "We also use it to manage activities: receive requests, review capacity, confirm or reject reservations, show upcoming and past activity, coordinate attendance, and support Konexa's internal operations.",
            "This includes answering questions, handling incidents, sending communications strictly related to the account or booked activity and, where authorized by the user, helping coordinate temporary WhatsApp groups.",
            "Konexa does not currently use personal data to send marketing or advertising communications."
          ]
        },
        {
          title: "4. Legal basis",
          paragraphs: [
            "The main legal basis is the performance of a pre-contractual or contractual relationship when a person creates an account, signs in, edits their profile, or requests to join an activity.",
            "Certain processing may also rely on Konexa's legitimate interest in ensuring service security, moderating access to activities, handling incidents, and protecting the community.",
            "Where consent is required, such as for specific communication channels or possible future non-essential cookies, that consent may be withdrawn at any time without affecting the lawfulness of prior processing."
          ]
        },
        {
          title: "5. Retention period",
          paragraphs: [
            "Data is kept while the account remains active or for as long as necessary to provide the service and manage related activities or incidents.",
            "After that, it may be retained in a restricted form for as long as required to comply with legal obligations, resolve claims, or defend against potential liabilities arising from the relationship with the user."
          ]
        },
        {
          title: "6. Recipients and processors",
          paragraphs: [
            "Konexa does not sell personal data to third parties.",
            "To operate the service, Konexa uses technology providers acting as processors, such as hosting, database, authentication, image storage, email, and deployment providers.",
            "The platform currently relies on services such as Supabase, Vercel, Google, and WhatsApp exclusively for the technical operation of the platform, necessary communications, and the coordination of certain activities where applicable."
          ]
        },
        {
          title: "7. User rights",
          paragraphs: [
            "You may request access, rectification, deletion, restriction of processing, objection, and, where applicable, portability of your data.",
            "You may also withdraw consent for any processing based on consent, without affecting the lawfulness of prior processing.",
            "To exercise these rights, contact konexaevents@gmail.com.",
            "If you believe your rights have not been properly addressed, you may lodge a complaint with the Spanish Data Protection Agency (AEPD)."
          ]
        },
        {
          title: "8. Minors",
          paragraphs: [
            "Konexa is intended exclusively for people aged 18 or over, or at minimum for people with sufficient legal capacity to use the service and join activities.",
            "If we detect that data has been provided by someone who does not meet these requirements, we may delete that information or restrict access to the service."
          ]
        },
        {
          title: "9. Security",
          paragraphs: [
            "Konexa applies reasonable technical and organizational measures to protect personal data against unauthorized access, loss, alteration, or improper disclosure.",
            "However, no system is completely invulnerable, so users are encouraged to use strong passwords and avoid sharing login credentials."
          ]
        },
        {
          title: "10. Contact",
          paragraphs: [
            "If you have questions about this policy or how your data is processed, you can write to konexaevents@gmail.com."
          ]
        }
      ]
    }
  }[locale];

  return (
    <div className="page-stack">
      <section className="legal-page">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <p className="lede">{copy.intro}</p>
        <p className="status">
          {copy.updateLabel}: {copy.updateValue}
        </p>
        <div className="legal-sections">
          {copy.sections.map((section) => (
            <article className="legal-card" key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
