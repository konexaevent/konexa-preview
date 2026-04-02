import { getLocale } from "@/lib/i18n-server";

export default async function CookiesPage() {
  const locale = await getLocale();

  const copy = {
    ca: {
      eyebrow: "Legal",
      title: "Política de cookies",
      intro:
        "Aquesta política explica quines cookies i tecnologies similars utilitza Konexa, amb quina finalitat i com es poden acceptar, rebutjar o gestionar des del navegador o des del banner de cookies del lloc web.",
      updateLabel: "Última actualització",
      updateValue: "3 d’abril de 2026",
      sections: [
        {
          title: "1. Què són les cookies",
          paragraphs: [
            "Les cookies són petits fitxers que es guarden al dispositiu quan una persona visita un lloc web. Serveixen, entre altres coses, per mantenir la sessió iniciada, recordar preferències o entendre com s’utilitza el servei."
          ]
        },
        {
          title: "2. Quines cookies fem servir a Konexa",
          paragraphs: [
            "Konexa utilitza principalment cookies tècniques i de preferències.",
            "Les cookies tècniques són necessàries perquè la web funcioni correctament: inici de sessió, seguretat, gestió de la sessió, navegació entre pàgines i ús bàsic dels formularis.",
            "Les cookies de preferències permeten recordar opcions com l’idioma seleccionat o determinades decisions de configuració.",
            "Actualment Konexa no utilitza cookies d’analítica, publicitàries ni píxels de seguiment amb finalitats comercials."
          ]
        },
        {
          title: "3. Cookies essencials",
          paragraphs: [
            "Aquestes cookies no es poden desactivar des del banner perquè són imprescindibles per prestar el servei sol·licitat per la persona usuària.",
            "Per exemple, poden servir per mantenir la sessió oberta, protegir el compte, completar l’autenticació o recordar paràmetres necessaris per al funcionament de la plataforma."
          ]
        },
        {
          title: "4. Cookies de preferències",
          paragraphs: [
            "Aquestes cookies permeten recordar configuracions com l’idioma de navegació o preferències bàsiques d’experiència.",
            "Si una persona rebutja aquest tipus de cookies, la web pot continuar funcionant, però pot perdre algunes opcions de comoditat o personalització."
          ]
        },
        {
          title: "5. Serveis de tercers",
          paragraphs: [
            "Konexa pot recolzar-se en serveis tècnics de tercers necessaris per prestar el servei, com ara autenticació, base de dades, allotjament, enviament de correus o emmagatzematge de fitxers.",
            "Aquests serveis poden intervenir en el funcionament tècnic de la plataforma. Actualment Konexa pot recolzar-se en serveis com Supabase, Vercel i Google per al funcionament del lloc web i l’autenticació, i eventualment en WhatsApp per a la coordinació d’activitats quan la persona usuària hi hagi consentit.",
            "Quan aquests serveis incorporin tecnologies pròpies de persistència o seguiment, aquesta política s’ha de revisar periòdicament perquè reflecteixi amb precisió les eines utilitzades."
          ]
        },
        {
          title: "6. Cookies d’anàlisi",
          paragraphs: [
            "Actualment Konexa no utilitza eines d’analítica, publicitat conductual, mapes de calor ni tecnologies de seguiment comercial de tercers.",
            "Si en el futur s’afegeixen eines d’analítica, mesura o mapes de calor, aquesta política i el sistema de consentiment s’actualitzaran per identificar-les amb claredat i explicar com es poden acceptar o rebutjar."
          ]
        },
        {
          title: "7. Com gestionar les cookies",
          paragraphs: [
            "Pots gestionar les cookies des del banner de cookies del lloc web, així com des de les opcions del teu navegador.",
            "La majoria de navegadors permeten bloquejar, eliminar o limitar cookies. Has de tenir en compte, però, que desactivar cookies essencials pot afectar el correcte funcionament de Konexa."
          ]
        },
        {
          title: "8. Actualitzacions d’aquesta política",
          paragraphs: [
            "Aquesta política es pot modificar si canvien les cookies utilitzades, la configuració tècnica del servei o les obligacions legals aplicables.",
            "Es recomana revisar-la periòdicament."
          ]
        },
        {
          title: "9. Contacte",
          paragraphs: [
            "Si tens dubtes sobre l’ús de cookies a Konexa, pots escriure a konexaevents@gmail.com."
          ]
        }
      ]
    },
    es: {
      eyebrow: "Legal",
      title: "Política de cookies",
      intro:
        "Esta política explica qué cookies y tecnologías similares utiliza Konexa, con qué finalidad y cómo pueden aceptarse, rechazarse o gestionarse desde el navegador o desde el banner de cookies del sitio web.",
      updateLabel: "Última actualización",
      updateValue: "3 de abril de 2026",
      sections: [
        {
          title: "1. Qué son las cookies",
          paragraphs: [
            "Las cookies son pequeños archivos que se guardan en el dispositivo cuando una persona visita una web. Sirven, entre otras cosas, para mantener la sesión iniciada, recordar preferencias o entender cómo se utiliza el servicio."
          ]
        },
        {
          title: "2. Qué cookies usamos en Konexa",
          paragraphs: [
            "Konexa utiliza principalmente cookies técnicas y de preferencias.",
            "Las cookies técnicas son necesarias para que la web funcione correctamente: inicio de sesión, seguridad, gestión de sesión, navegación entre páginas y uso básico de formularios.",
            "Las cookies de preferencias permiten recordar opciones como el idioma seleccionado o determinadas decisiones de configuración.",
            "Actualmente Konexa no utiliza cookies de analítica, publicitarias ni píxeles de seguimiento con fines comerciales."
          ]
        },
        {
          title: "3. Cookies esenciales",
          paragraphs: [
            "Estas cookies no pueden desactivarse desde el banner porque son imprescindibles para prestar el servicio solicitado por la persona usuaria.",
            "Por ejemplo, pueden servir para mantener la sesión abierta, proteger la cuenta, completar la autenticación o recordar parámetros necesarios para el funcionamiento de la plataforma."
          ]
        },
        {
          title: "4. Cookies de preferencias",
          paragraphs: [
            "Estas cookies permiten recordar configuraciones como el idioma de navegación o preferencias básicas de experiencia.",
            "Si una persona rechaza este tipo de cookies, la web puede seguir funcionando, pero puede perder algunas opciones de comodidad o personalización."
          ]
        },
        {
          title: "5. Servicios de terceros",
          paragraphs: [
            "Konexa puede apoyarse en servicios técnicos de terceros necesarios para prestar el servicio, como autenticación, base de datos, alojamiento, envío de correos o almacenamiento de archivos.",
            "Estos servicios pueden intervenir en el funcionamiento técnico de la plataforma. Actualmente Konexa puede apoyarse en servicios como Supabase, Vercel y Google para el funcionamiento del sitio web y la autenticación, y eventualmente en WhatsApp para la coordinación de actividades cuando la persona usuaria lo haya consentido.",
            "Cuando estos servicios incorporen tecnologías propias de persistencia o seguimiento, esta política deberá revisarse periódicamente para reflejar con precisión las herramientas utilizadas."
          ]
        },
        {
          title: "6. Cookies de análisis",
          paragraphs: [
            "Actualmente Konexa no utiliza herramientas de analítica, publicidad conductual, mapas de calor ni tecnologías de seguimiento comercial de terceros.",
            "Si en el futuro se añaden herramientas de analítica, medición o mapas de calor, esta política y el sistema de consentimiento se actualizarán para identificarlas con claridad y explicar cómo pueden aceptarse o rechazarse."
          ]
        },
        {
          title: "7. Cómo gestionar las cookies",
          paragraphs: [
            "Puedes gestionar las cookies desde el banner de cookies de la web, así como desde las opciones de tu navegador.",
            "Debes tener en cuenta, no obstante, que desactivar cookies esenciales puede afectar al funcionamiento correcto de Konexa."
          ]
        },
        {
          title: "8. Actualizaciones de esta política",
          paragraphs: [
            "Esta política puede modificarse si cambian las cookies utilizadas, la configuración técnica del servicio o las obligaciones legales aplicables.",
            "Se recomienda revisarla periódicamente."
          ]
        },
        {
          title: "9. Contacto",
          paragraphs: [
            "Si tienes dudas sobre el uso de cookies en Konexa, puedes escribir a konexaevents@gmail.com."
          ]
        }
      ]
    },
    en: {
      eyebrow: "Legal",
      title: "Cookie policy",
      intro:
        "This policy explains which cookies and similar technologies Konexa uses, for what purposes, and how they can be accepted, rejected, or managed through the browser or through the website cookie banner.",
      updateLabel: "Last updated",
      updateValue: "April 3, 2026",
      sections: [
        {
          title: "1. What cookies are",
          paragraphs: [
            "Cookies are small files stored on a device when a person visits a website. They may be used to keep a session active, remember preferences, or understand how the service is used."
          ]
        },
        {
          title: "2. Which cookies Konexa uses",
          paragraphs: [
            "Konexa mainly uses technical and preference cookies.",
            "Technical cookies are necessary for the website to work properly: sign-in, security, session handling, page navigation, and basic form usage.",
            "Preference cookies allow the website to remember choices such as the selected language or certain configuration settings.",
            "At the moment, Konexa does not use analytics cookies, advertising cookies, or tracking pixels for commercial purposes."
          ]
        },
        {
          title: "3. Essential cookies",
          paragraphs: [
            "These cookies cannot be disabled through the banner because they are strictly necessary to provide the service requested by the user.",
            "For example, they may be used to keep a session open, protect an account, complete authentication, or remember settings needed for the platform to function."
          ]
        },
        {
          title: "4. Preference cookies",
          paragraphs: [
            "These cookies allow the website to remember settings such as browsing language or basic experience preferences.",
            "If a user rejects these cookies, the website may still function, but some convenience or personalization features may be lost."
          ]
        },
        {
          title: "5. Third-party services",
          paragraphs: [
            "Konexa may rely on technical third-party services required to provide the service, such as authentication, database, hosting, email delivery, or file storage.",
            "Those services may be involved in the technical operation of the platform. Konexa currently relies on services such as Supabase, Vercel, and Google for website operation and authentication, and may rely on WhatsApp for activity coordination where the user has consented to it.",
            "Whenever those services introduce their own persistence or tracking technologies, this policy should be reviewed so that it accurately reflects the tools in use."
          ]
        },
        {
          title: "6. Analytics cookies",
          paragraphs: [
            "At the moment, Konexa does not use analytics tools, behavioural advertising, heatmaps, or third-party commercial tracking technologies.",
            "If analytics, measurement, or heatmap tools are added in the future, this policy and the consent system will be updated to identify them clearly and explain how they can be accepted or rejected."
          ]
        },
        {
          title: "7. How to manage cookies",
          paragraphs: [
            "You can manage cookies through the website cookie banner and through your browser settings.",
            "However, please note that disabling essential cookies may affect the proper functioning of Konexa."
          ]
        },
        {
          title: "8. Updates to this policy",
          paragraphs: [
            "This policy may be updated if the cookies used, the technical setup of the service, or applicable legal obligations change.",
            "It is recommended to review it periodically."
          ]
        },
        {
          title: "9. Contact",
          paragraphs: [
            "If you have any questions about the use of cookies at Konexa, you can write to konexaevents@gmail.com."
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
