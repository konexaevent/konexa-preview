import { getLocale } from "@/lib/i18n-server";

export default async function PrivacyPage() {
  const locale = await getLocale();

  const copy = {
    ca: {
      eyebrow: "Legal",
      title: "Politica de privacitat",
      intro:
        "Aquesta pagina explica com Konexa tracta les dades personals basiques dels usuaris quan naveguen, creen un compte o participen en activitats.",
      sections: [
        {
          title: "Dades que recollim",
          text: "Podem recollir nom, correu electronic, data de naixement, foto de perfil i dades relacionades amb les activitats reservades."
        },
        {
          title: "Per a que les fem servir",
          text: "Fem servir aquestes dades per gestionar el compte, mostrar activitats, millorar la familiaritat entre persones i facilitar reserves i accessos."
        },
        {
          title: "Comparticio de dades",
          text: "No venem dades personals. Les dades nomes es comparteixen amb proveidors tecnics necessaris per al funcionament de la plataforma, com allotjament o autenticacio."
        },
        {
          title: "Drets dels usuaris",
          text: "Les persones poden demanar accedir, corregir o eliminar les seves dades personals contactant amb l'equip responsable de Konexa."
        }
      ]
    },
    es: {
      eyebrow: "Legal",
      title: "Politica de privacidad",
      intro:
        "Esta pagina explica como Konexa trata los datos personales basicos de los usuarios cuando navegan, crean una cuenta o participan en actividades.",
      sections: [
        {
          title: "Datos que recogemos",
          text: "Podemos recoger nombre, correo electronico, fecha de nacimiento, foto de perfil y datos relacionados con las actividades reservadas."
        },
        {
          title: "Para que los usamos",
          text: "Usamos estos datos para gestionar la cuenta, mostrar actividades, mejorar la familiaridad entre personas y facilitar reservas y accesos."
        },
        {
          title: "Comparticion de datos",
          text: "No vendemos datos personales. Solo se comparten con proveedores tecnicos necesarios para el funcionamiento de la plataforma, como hosting o autenticacion."
        },
        {
          title: "Derechos de los usuarios",
          text: "Las personas pueden pedir acceso, correccion o eliminacion de sus datos personales contactando con el equipo responsable de Konexa."
        }
      ]
    },
    en: {
      eyebrow: "Legal",
      title: "Privacy policy",
      intro:
        "This page explains how Konexa handles basic personal data when people browse, create an account, or participate in activities.",
      sections: [
        {
          title: "Data we collect",
          text: "We may collect name, email, birth date, profile photo, and data related to booked activities."
        },
        {
          title: "How we use it",
          text: "We use this data to manage accounts, display activities, improve familiarity between participants, and support bookings and access."
        },
        {
          title: "Data sharing",
          text: "We do not sell personal data. Information is only shared with technical providers required to operate the platform, such as hosting or authentication services."
        },
        {
          title: "User rights",
          text: "People can request access, correction, or deletion of their personal data by contacting the Konexa team."
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
