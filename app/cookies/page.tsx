import { getLocale } from "@/lib/i18n-server";

export default async function CookiesPage() {
  const locale = await getLocale();

  const copy = {
    ca: {
      eyebrow: "Legal",
      title: "Politica de cookies",
      intro:
        "Konexa fa servir cookies i tecnologies similars per recordar l'idioma, mantenir la sessio iniciada i entendre millor com s'utilitza la plataforma.",
      sections: [
        {
          title: "Cookies essencials",
          text: "Son necessaries per al funcionament basic del lloc, com l'autenticacio, la navegacio i la seguretat."
        },
        {
          title: "Cookies de preferencies",
          text: "Permeten recordar opcions com l'idioma seleccionat o petites preferencies de l'usuari."
        },
        {
          title: "Cookies d'analisi",
          text: "Poden ajudar a entendre quines pagines funcionen millor i com millorar l'experiencia general del producte."
        },
        {
          title: "Com gestionar-les",
          text: "Les persones poden bloquejar o eliminar cookies des del seu navegador, tot i que algunes funcions del lloc poden deixar de funcionar correctament."
        }
      ]
    },
    es: {
      eyebrow: "Legal",
      title: "Politica de cookies",
      intro:
        "Konexa usa cookies y tecnologias similares para recordar el idioma, mantener la sesion iniciada y entender mejor como se utiliza la plataforma.",
      sections: [
        {
          title: "Cookies esenciales",
          text: "Son necesarias para el funcionamiento basico del sitio, como autenticacion, navegacion y seguridad."
        },
        {
          title: "Cookies de preferencias",
          text: "Permiten recordar opciones como el idioma seleccionado o pequenas preferencias del usuario."
        },
        {
          title: "Cookies de analitica",
          text: "Pueden ayudar a entender que paginas funcionan mejor y como mejorar la experiencia general del producto."
        },
        {
          title: "Como gestionarlas",
          text: "Las personas pueden bloquear o eliminar cookies desde su navegador, aunque algunas funciones del sitio podrian dejar de funcionar correctamente."
        }
      ]
    },
    en: {
      eyebrow: "Legal",
      title: "Cookie policy",
      intro:
        "Konexa uses cookies and similar technologies to remember language, keep sessions active, and better understand how the platform is used.",
      sections: [
        {
          title: "Essential cookies",
          text: "These are required for core site functionality, including authentication, navigation, and security."
        },
        {
          title: "Preference cookies",
          text: "These allow the app to remember settings such as selected language and small user preferences."
        },
        {
          title: "Analytics cookies",
          text: "These may help us understand which pages work best and how to improve the overall product experience."
        },
        {
          title: "How to manage them",
          text: "People can block or delete cookies from their browser, although some site functions may stop working correctly."
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
