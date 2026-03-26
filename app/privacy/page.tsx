import { getLocale } from "@/lib/i18n-server";

export default async function PrivacyPage() {
  const locale = await getLocale();

  const copy = {
    ca: {
      eyebrow: "Legal",
      title: "Politica de privacitat",
      intro:
        "Aquesta politica explica com Konexa tracta les dades personals de les persones que naveguen pel lloc web, creen un compte, sol.liciten assistir a activitats o participen en experiències organitzades a traves de la plataforma.",
      note:
        "Abans de publicar la versio definitiva, convé afegir-hi les dades reals del responsable del tractament, un correu de contacte legal i, si escau, les dades fiscals de l'entitat o persona titular del projecte.",
      sections: [
        {
          title: "Responsable del tractament",
          text: "El responsable del tractament de les dades es Konexa o la persona o entitat titular del projecte. En la versio final d'aquesta politica s'hauria d'indicar el nom legal complet, l'adreca de contacte i el correu electronic habilitat per a consultes de privacitat."
        },
        {
          title: "Dades que podem recollir",
          text: "Konexa pot tractar dades identificatives i de contacte, com ara nom, cognoms, correu electronic, data de naixement, foto de perfil, dades del compte, dades relacionades amb activitats reservades o sol.licitades i, si l'usuari les facilita, informacio addicional inclosa als formularis d'inscripcio."
        },
        {
          title: "Finalitats del tractament",
          text: "Aquestes dades es fan servir per gestionar el registre i l'autenticacio, permetre l'acces al perfil personal, tramitar sol.licituds d'assistencia a activitats, mostrar connexions socials derivades d'activitats compartides, moderar l'aforament, donar suport a la seguretat del servei i comunicar informacions essencials relacionades amb el compte o les activitats."
        },
        {
          title: "Base juridica",
          text: "La base legal per al tractament es, principalment, l'execucio de la relacio precontractual o contractual amb l'usuari quan crea un compte o sol.licita participar en una activitat. En determinats casos, tambe es pot tractar informacio per interes legitim relacionat amb la seguretat, la prevencio d'abusos, la gestio interna del servei i la proteccio de la comunitat."
        },
        {
          title: "Conservacio de les dades",
          text: "Les dades personals es conserven mentre siguin necessaries per prestar el servei, gestionar el compte de l'usuari i mantenir la traçabilitat basica de les activitats i sol.licituds. Posteriorment es poden conservar bloquejades durant els terminis exigits per obligacions legals o per atendre possibles responsabilitats."
        },
        {
          title: "Destinataris i proveidors",
          text: "Konexa no ven dades personals a tercers. Les dades nomes es poden comunicar a proveidors tecnics necessaris per al funcionament del servei, com plataformes d'allotjament, autenticacio, base de dades, correu transactional o eines estrictament necessaries per operar el lloc web, sempre sota les garanties adequades."
        },
        {
          title: "Drets de les persones usuaries",
          text: "Les persones usuaries poden sol.licitar l'acces, la rectificacio, la supressio, l'oposicio, la limitacio del tractament i, quan sigui aplicable, la portabilitat de les dades. Tambe poden retirar el consentiment quan el tractament es basi en aquest. Per exercir aquests drets, caldra habilitar un correu de contacte legal a la versio definitiva."
        },
        {
          title: "Seguretat i confidencialitat",
          text: "Konexa adopta mesures tecniques i organitzatives raonables per protegir les dades personals davant perdua, acces no autoritzat, alteracio o divulgacio indeguda. Tot i aixi, cap entorn tecnologic pot garantir una seguretat absoluta."
        },
        {
          title: "Menors d'edat",
          text: "La plataforma esta pensada per a persones majors d'edat o, en tot cas, per a persones amb capacitat legal suficient segons la normativa aplicable. Si el projecte s'adreca exclusivament a adults, aquesta limitacio s'ha d'indicar de forma expressa a la versio definitiva."
        }
      ]
    },
    es: {
      eyebrow: "Legal",
      title: "Politica de privacidad",
      intro:
        "Esta politica explica como Konexa trata los datos personales de las personas que navegan por la web, crean una cuenta, solicitan asistir a actividades o participan en experiencias organizadas a traves de la plataforma.",
      note:
        "Antes de publicar la version definitiva, conviene añadir los datos reales del responsable del tratamiento, un correo legal de contacto y, en su caso, los datos fiscales de la persona o entidad titular del proyecto.",
      sections: [
        {
          title: "Responsable del tratamiento",
          text: "El responsable del tratamiento de los datos es Konexa o la persona o entidad titular del proyecto. En la version final de esta politica deberia indicarse el nombre legal completo, la direccion de contacto y el correo electronico habilitado para consultas de privacidad."
        },
        {
          title: "Datos que podemos recoger",
          text: "Konexa puede tratar datos identificativos y de contacto, como nombre, apellidos, correo electronico, fecha de nacimiento, foto de perfil, datos de cuenta, datos relacionados con actividades reservadas o solicitadas y, si la persona usuaria los facilita, informacion adicional incluida en formularios de inscripcion."
        },
        {
          title: "Finalidades del tratamiento",
          text: "Estos datos se usan para gestionar el registro y la autenticacion, permitir el acceso al perfil personal, tramitar solicitudes de asistencia a actividades, mostrar conexiones sociales derivadas de actividades compartidas, moderar el aforo, dar soporte a la seguridad del servicio y comunicar informacion esencial relacionada con la cuenta o las actividades."
        },
        {
          title: "Base juridica",
          text: "La base legal del tratamiento es, principalmente, la ejecucion de la relacion precontractual o contractual con la persona usuaria cuando crea una cuenta o solicita participar en una actividad. En determinados casos tambien puede tratarse informacion por interes legitimo relacionado con la seguridad, la prevencion de abusos, la gestion interna del servicio y la proteccion de la comunidad."
        },
        {
          title: "Conservacion de los datos",
          text: "Los datos personales se conservaran mientras sean necesarios para prestar el servicio, gestionar la cuenta de la persona usuaria y mantener la trazabilidad basica de actividades y solicitudes. Despues podran conservarse bloqueados durante los plazos exigidos por obligaciones legales o para atender posibles responsabilidades."
        },
        {
          title: "Destinatarios y proveedores",
          text: "Konexa no vende datos personales a terceros. La informacion solo puede comunicarse a proveedores tecnicos necesarios para el funcionamiento del servicio, como plataformas de hosting, autenticacion, base de datos, correo transaccional o herramientas estrictamente necesarias para operar la web, siempre bajo garantias adecuadas."
        },
        {
          title: "Derechos de las personas usuarias",
          text: "Las personas usuarias pueden solicitar acceso, rectificacion, supresion, oposicion, limitacion del tratamiento y, cuando proceda, portabilidad de sus datos. Tambien pueden retirar el consentimiento cuando el tratamiento se base en el mismo. Para ejercer estos derechos, debera habilitarse un correo legal de contacto en la version definitiva."
        },
        {
          title: "Seguridad y confidencialidad",
          text: "Konexa adopta medidas tecnicas y organizativas razonables para proteger los datos personales frente a perdida, acceso no autorizado, alteracion o divulgacion indebida. Aun asi, ningun entorno tecnologico puede garantizar una seguridad absoluta."
        },
        {
          title: "Menores de edad",
          text: "La plataforma esta pensada para personas mayores de edad o, en todo caso, con capacidad legal suficiente segun la normativa aplicable. Si el proyecto se dirige exclusivamente a adultos, esta limitacion deberia indicarse expresamente en la version definitiva."
        }
      ]
    },
    en: {
      eyebrow: "Legal",
      title: "Privacy policy",
      intro:
        "This policy explains how Konexa handles personal data when people browse the website, create an account, request access to activities, or participate in experiences organized through the platform.",
      note:
        "Before publishing the final version, it is advisable to add the real identity of the data controller, a legal contact email address, and, where applicable, the tax or company details of the project owner.",
      sections: [
        {
          title: "Data controller",
          text: "The data controller is Konexa or the individual or legal entity that owns the project. In the final version of this policy, the full legal name, contact address, and privacy contact email should be clearly identified."
        },
        {
          title: "Data we may collect",
          text: "Konexa may process identification and contact data such as first name, last name, email address, birth date, profile photo, account information, booking or attendance request data, and any additional information voluntarily provided in activity request forms."
        },
        {
          title: "Purposes of processing",
          text: "We use this information to manage registration and authentication, provide access to personal profiles, process activity attendance requests, show social familiarity signals based on shared activities, moderate capacity, maintain service security, and communicate essential information related to accounts or activities."
        },
        {
          title: "Legal basis",
          text: "The main legal basis for processing is the performance of a pre-contractual or contractual relationship with the user when they create an account or request to join an activity. In certain cases, information may also be processed based on legitimate interest related to security, abuse prevention, internal service management, and protection of the community."
        },
        {
          title: "Retention period",
          text: "Personal data is retained for as long as necessary to provide the service, manage the user account, and keep a basic record of activities and requests. It may then be kept in a restricted form for as long as required by law or to address potential liabilities."
        },
        {
          title: "Recipients and service providers",
          text: "Konexa does not sell personal data to third parties. Information may only be shared with technical providers strictly necessary to operate the service, such as hosting, authentication, database, transactional email, or similar infrastructure providers, always subject to appropriate safeguards."
        },
        {
          title: "User rights",
          text: "Users may request access, rectification, deletion, objection, restriction of processing, and, where applicable, data portability. They may also withdraw consent whenever processing is based on consent. A legal privacy contact email should be added before the final public launch."
        },
        {
          title: "Security and confidentiality",
          text: "Konexa applies reasonable technical and organizational measures to protect personal data against loss, unauthorized access, improper disclosure, or alteration. However, no technological environment can guarantee absolute security."
        },
        {
          title: "Minors",
          text: "The platform is intended for adults or, at minimum, people with sufficient legal capacity under applicable law. If the project is strictly intended for adults, that restriction should be expressly stated in the final version."
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
