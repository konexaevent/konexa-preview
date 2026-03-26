import { getLocale } from "@/lib/i18n-server";

export default async function CookiesPage() {
  const locale = await getLocale();

  const copy = {
    ca: {
      eyebrow: "Legal",
      title: "Politica de cookies",
      intro:
        "Aquesta politica explica quines cookies i tecnologies similars es poden utilitzar a Konexa, amb quina finalitat i com les persones usuaries poden gestionar-les des del navegador o des de les opcions que ofereixi la plataforma.",
      note:
        "Abans de publicar la versio definitiva, convé revisar aquesta pagina segons les cookies reals que s'utilitzin finalment, especialment si s'afegeixen eines d'analitica, mapes, videos incrustats o serveis de tercers.",
      sections: [
        {
          title: "Que son les cookies",
          text: "Les cookies son petits arxius que es guarden al dispositiu de la persona usuaria quan visita un lloc web. Poden servir per recordar preferencies, mantenir sessions, facilitar la navegacio o obtenir informacio estadistica sobre l'us del lloc."
        },
        {
          title: "Cookies essencials o tecniques",
          text: "Son necessaries per al funcionament basic del lloc web i per prestar serveis expressament sol.licitats per l'usuari, com la navegacio, l'autenticacio, la seguretat, la gestio de sessio o el record de preferencies imprescindibles per al servei."
        },
        {
          title: "Cookies de preferencies",
          text: "Permeten recordar configuracions com l'idioma seleccionat o determinades opcions d'experiencia per tal que la navegacio sigui mes comoda i coherent en futures visites."
        },
        {
          title: "Cookies d'analisi o mesura",
          text: "Si Konexa incorpora eines d'analitica, aquestes cookies poden utilitzar-se per entendre quines pagines funcionen millor, detectar errors, mesurar l'us del servei i millorar l'experiencia general. Aquestes cookies s'haurien d'identificar de manera concreta a la versio final."
        },
        {
          title: "Cookies de tercers",
          text: "Alguns continguts o serveis integrats, com ara videos incrustats, eines externes o plataformes d'autenticacio, poden establir cookies propies. En aquest cas, s'hauria d'informar de forma clara sobre el tercer responsable i la seva finalitat."
        },
        {
          title: "Com gestionar-les",
          text: "Les persones usuaries poden acceptar, rebutjar o eliminar cookies des del seu navegador o des de les eines de configuracio disponibles al lloc web. Cal tenir en compte que la desactivacio d'algunes cookies tecniques pot afectar el funcionament correcte del servei."
        },
        {
          title: "Actualitzacio de la politica",
          text: "Aquesta politica de cookies es pot actualitzar si canvien les tecnologies utilitzades, els serveis integrats o els requisits legals aplicables. Es recomana revisar-la periodicament."
        }
      ]
    },
    es: {
      eyebrow: "Legal",
      title: "Politica de cookies",
      intro:
        "Esta politica explica que cookies y tecnologias similares puede utilizar Konexa, con que finalidad y como pueden gestionarlas las personas usuarias desde su navegador o desde las opciones que ofrezca la propia plataforma.",
      note:
        "Antes de publicar la version definitiva, conviene revisar esta pagina segun las cookies reales que se utilicen finalmente, especialmente si se añaden herramientas de analitica, mapas, videos incrustados o servicios de terceros.",
      sections: [
        {
          title: "Que son las cookies",
          text: "Las cookies son pequeños archivos que se guardan en el dispositivo de la persona usuaria cuando visita un sitio web. Pueden servir para recordar preferencias, mantener sesiones, facilitar la navegacion u obtener informacion estadistica sobre el uso del sitio."
        },
        {
          title: "Cookies esenciales o tecnicas",
          text: "Son necesarias para el funcionamiento basico del sitio web y para prestar servicios expresamente solicitados por la persona usuaria, como la navegacion, la autenticacion, la seguridad, la gestion de sesion o el recuerdo de preferencias imprescindibles para el servicio."
        },
        {
          title: "Cookies de preferencias",
          text: "Permiten recordar configuraciones como el idioma seleccionado o determinadas opciones de experiencia para que la navegacion sea mas comoda y coherente en futuras visitas."
        },
        {
          title: "Cookies de analitica o medicion",
          text: "Si Konexa incorpora herramientas de analitica, estas cookies pueden utilizarse para entender que paginas funcionan mejor, detectar errores, medir el uso del servicio y mejorar la experiencia general. En la version final deberian identificarse de forma concreta."
        },
        {
          title: "Cookies de terceros",
          text: "Algunos contenidos o servicios integrados, como videos incrustados, herramientas externas o plataformas de autenticacion, pueden establecer cookies propias. En ese caso, deberia informarse claramente sobre el tercero responsable y la finalidad correspondiente."
        },
        {
          title: "Como gestionarlas",
          text: "Las personas usuarias pueden aceptar, rechazar o eliminar cookies desde su navegador o desde las herramientas de configuracion disponibles en la web. Debe tenerse en cuenta que desactivar determinadas cookies tecnicas puede afectar al funcionamiento correcto del servicio."
        },
        {
          title: "Actualizacion de la politica",
          text: "Esta politica de cookies puede actualizarse si cambian las tecnologias utilizadas, los servicios integrados o las obligaciones legales aplicables. Se recomienda revisarla de forma periodica."
        }
      ]
    },
    en: {
      eyebrow: "Legal",
      title: "Cookie policy",
      intro:
        "This policy explains which cookies and similar technologies Konexa may use, for what purposes, and how users can manage them through their browser settings or through controls made available on the website.",
      note:
        "Before publishing the final version, this page should be reviewed against the real cookies and third-party services actually used, especially if analytics tools, embedded videos, maps, or external integrations are added.",
      sections: [
        {
          title: "What cookies are",
          text: "Cookies are small files stored on a user device when visiting a website. They can be used to remember preferences, keep sessions active, support navigation, or gather statistical information about how the site is used."
        },
        {
          title: "Essential or technical cookies",
          text: "These are necessary for the core operation of the website and for services expressly requested by the user, such as browsing, authentication, security, session handling, or remembering settings that are strictly required to provide the service."
        },
        {
          title: "Preference cookies",
          text: "These may remember settings such as selected language or certain experience choices so that browsing is more consistent and convenient in future visits."
        },
        {
          title: "Analytics or measurement cookies",
          text: "If Konexa adds analytics tools, these cookies may be used to understand which pages perform better, detect errors, measure service usage, and improve the overall experience. They should be specifically identified in the final version of this policy."
        },
        {
          title: "Third-party cookies",
          text: "Some integrated services or content, such as embedded videos, external tools, or authentication providers, may place their own cookies. In such cases, the final version should clearly identify the third party involved and the relevant purpose."
        },
        {
          title: "How to manage them",
          text: "Users can accept, reject, block, or delete cookies through their browser settings or through the controls available on the website. Disabling certain technical cookies may affect the correct operation of the service."
        },
        {
          title: "Policy updates",
          text: "This cookie policy may be updated if the technologies used, the integrated services, or the applicable legal requirements change. It is recommended to review it periodically."
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
        <p className="status">{copy.note}</p>
        <div className="legal-sections">
          {copy.sections.map((section) => (
            <article className="legal-card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
