export const locales = ["ca", "es", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ca";
export const localeCookieName = "konexa-locale";

type Messages = {
  brandTagline: string;
  navDiscover: string;
  navActivities: string;
  navHosts: string;
  navEnergy: string;
  navLogin: string;
  navLogout: string;
  navAdmin: string;
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  heroCtaPlans: string;
  heroCtaProfile: string;
  heroCtaCreate: string;
  heroBenefit1: string;
  heroBenefit2: string;
  heroBenefit3: string;
  trustEyebrow: string;
  trustTitle: string;
  trustUpcomingTitle: string;
  trustUpcomingText: string;
  trustPastTitle: string;
  trustPastText: string;
  trustSharedTitle: string;
  trustSharedText: string;
  feedEyebrow: string;
  feedTitle: string;
  feedNote: string;
  sharedAvailable: string;
  smallHostedGroup: string;
  viewActivity: string;
  joined: string;
  joinActivity: string;
  loginTitle: string;
  loginText: string;
  loginBenefit1: string;
  loginBenefit2: string;
  loginBenefit3: string;
  demoMode: string;
  logIn: string;
  returnDashboard: string;
  email: string;
  phone: string;
  password: string;
  accessAccount: string;
  createAccount: string;
  setupProfile: string;
  fullName: string;
  signUp: string;
  continueGoogle: string;
  myProfile: string;
  profileText: string;
  upcoming: string;
  sharedConnections: string;
  scheduledActivities: string;
  scheduledPlans: string;
  pendingActivities: string;
  pendingPlans: string;
  noPending: string;
  personalInfo: string;
  personalInfoTitle: string;
  editProfile: string;
  saveProfile: string;
  profileSaved: string;
  avatarUrl: string;
  avatarHelp: string;
  avatarFile: string;
  avatarFileHelp: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  upcomingActivities: string;
  joinedPlans: string;
  participantsJoined: string;
  noUpcoming: string;
  pastActivities: string;
  happenedPlans: string;
  noPast: string;
  sharedConnectionsTitle: string;
  sharedConnectionsText: string;
  sharedCount: string;
  youMetIn: string;
  noSharedYet: string;
  date: string;
  priceLabel: string;
  participants: string;
  socialSignal: string;
  knowPeopleInActivity: string;
  everyoneNew: string;
  alreadyJoinedThisActivity: string;
  joinThisActivity: string;
  logInToJoin: string;
  participantsTitle: string;
  participantsText: string;
  alreadyFamiliar: string;
  newForYou: string;
  noSharedActivityYet: string;
  cityLabel: string;
  adminPending: string;
  adminPendingTitle: string;
  adminPendingText: string;
  approve: string;
  reject: string;
  noApprovals: string;
  statusConfirmed: string;
  reservationPending: string;
  reservationConfirmed: string;
  cancelReservation: string;
  reservationCancelled: string;
  cancellationNotice: string;
};

const messages: Record<Locale, Messages> = {
  ca: {
    brandTagline: "On la vida es viu",
    navDiscover: "Descobreix",
    navActivities: "Activitats",
    navHosts: "Coneix els hosts",
    navEnergy: "Energia Konexa",
    navLogin: "Inicia sessio",
    navLogout: "Tanca sessio",
    navAdmin: "Administracio",
    heroEyebrow: "Grups petits. Converses reals. Zero incomoditat.",
    heroTitle: "No sempre és fàcil quedar, aquí sí.",
    heroText:
      "A Konexa, la vida no s'explica: es viu.",
    heroCtaPlans: "Veure plans",
    heroCtaProfile: "Obrir perfil",
    heroCtaCreate: "Crear compte",
    heroBenefit1: "Plans seleccionats per fer facil el primer pas",
    heroBenefit2: "Veu abans d'anar-hi quines cares et poden sonar",
    heroBenefit3: "Connexions reals creades a partir d'activitats compartides",
    trustEyebrow: "Senyal de comunitat",
    trustTitle: "La sensacio canvia quan saps que no hi vas completament de zero",
    trustUpcomingTitle: "Properes",
    trustUpcomingText: "Les persones veuen els propers plans amb participants i acces rapid.",
    trustPastTitle: "Passades",
    trustPastText: "Cada activitat completada passa a formar part de la teva historia.",
    trustSharedTitle: "Compartides",
    trustSharedText: "Les connexions neixen de manera natural de les activitats viscudes plegats.",
    feedEyebrow: "",
    feedTitle: "Activitats",
    feedNote:
      "Sense filtres expressament. El feed prioritza la claredat, el to del grup i la familiaritat social per ajudar-te a decidir de seguida.",
    sharedAvailable: "Connexions compartides disponibles quan iniciis sessio",
    smallHostedGroup: "Grup petit amb amfitrio",
    viewActivity: "Veure activitat",
    joined: "Apuntat",
    joinActivity: "Apuntar-me",
    loginTitle: "Entra i fes que cada pla se senti mes proper",
    loginText:
      "Quan tens compte, Konexa recorda el teu recorregut i et mostra qui ja coneixes, quins plans tens a prop i on et pots sentir mes comode.",
    loginBenefit1: "Sessio segura amb Supabase Auth",
    loginBenefit2: "Perfil personal amb plans reservats i completats",
    loginBenefit3: "Visibilitat social sense semblar una xarxa social",
    demoMode: "Mode demo actiu fins que configuris les claus de Supabase.",
    logIn: "Inicia sessio",
    returnDashboard: "Torna al teu perfil i al teu historial d'activitats.",
    email: "Correu electronic",
    phone: "Telefon",
    password: "Contrasenya",
    accessAccount: "Accedir al compte",
    createAccount: "Crear compte",
    setupProfile: "Configura el teu perfil perque Konexa pugui seguir les activitats compartides.",
    fullName: "Nom complet",
    signUp: "Registrar-me",
    continueGoogle: "Continuar amb Google",
    myProfile: "El meu perfil",
    profileText:
      "Un espai personal, net i util per seguir els teus propers plans, recuperar els que ja has viscut i reconeixer les persones amb qui ja has coincidit.",
    upcoming: "properes",
    sharedConnections: "connexions compartides",
    scheduledActivities: "Activitats programades",
    scheduledPlans: "Plans confirmats als quals ja t'has apuntat",
    pendingActivities: "Pendents de confirmar",
    pendingPlans: "Sol.licituds encara pendents de validacio",
    noPending: "No tens activitats pendents de confirmar.",
    personalInfo: "Informacio personal",
    personalInfoTitle: "Dades del teu usuari",
    editProfile: "Editar perfil",
    saveProfile: "Desar canvis",
    profileSaved: "Perfil desat correctament.",
    avatarUrl: "URL de la foto de perfil",
    avatarHelp: "Pots enganxar una URL d'imatge o mantenir l'avatar automatic.",
    avatarFile: "Pujar nova foto",
    avatarFileHelp: "Si puges una imatge, tindra prioritat sobre la URL manual.",
    firstName: "Nom",
    lastName: "Cognoms",
    birthDate: "Data de naixement",
    upcomingActivities: "Properes activitats",
    joinedPlans: "Plans on ja t'has apuntat",
    participantsJoined: "participants apuntats",
    noUpcoming: "Encara no tens activitats futures.",
    pastActivities: "Activitats passades",
    happenedPlans: "Plans que ja han passat",
    noPast: "Els plans passats apareixeran aqui despres de la primera activitat.",
    sharedConnectionsTitle: "Connexions compartides",
    sharedConnectionsText:
      "Creat a partir d'assistencia real per generar familiaritat i confianca sense soroll social.",
    sharedCount: "Heu compartit {count} activitats",
    youMetIn: "Us vau coneixer a: {activities}",
    noSharedYet: "Les connexions compartides apareixeran despres del teu primer pla en grup.",
    date: "Data",
    priceLabel: "Preu",
    participants: "Participants",
    socialSignal: "Senyal social",
    knowPeopleInActivity: "Ja coneixes {count} persones en aquesta activitat",
    everyoneNew: "Tothom es nou per a tu en aquesta activitat",
    alreadyJoinedThisActivity: "Ja t'has apuntat a aquesta activitat",
    joinThisActivity: "Apuntar-me a aquesta activitat",
    logInToJoin: "Inicia sessio per apuntar-t'hi",
    participantsTitle: "Persones apuntades a aquesta activitat",
    participantsText:
      "Les persones amb qui ja has compartit activitats queden destacades per reforcar la familiaritat i la confianca.",
    alreadyFamiliar: "Ja la coneixes",
    newForYou: "Nova per a tu",
    noSharedActivityYet: "Encara no heu compartit cap activitat.",
    cityLabel: "Ciutat",
    adminPending: "Aprovacions pendents",
    adminPendingTitle: "Activitats pendents de confirmar",
    adminPendingText: "Des d'aqui pots confirmar o rebutjar sol.licituds d'entrada.",
    approve: "Confirmar",
    reject: "Rebutjar",
    noApprovals: "No hi ha cap sol.licitud pendent per revisar.",
    statusConfirmed: "Canvis desats correctament.",
    reservationPending: "Reserva pendent de confirmar",
    reservationConfirmed: "Reserva confirmada",
    cancelReservation: "Anul.lar reserva",
    reservationCancelled: "Has anul.lat la reserva d'aquesta activitat.",
    cancellationNotice: "Si l'anul.les, la teva plaça tornara a quedar disponible."
  },
  es: {
    brandTagline: "Donde la vida se vive",
    navDiscover: "Descubrir",
    navActivities: "Actividades",
    navHosts: "Conoce los hosts",
    navEnergy: "Energia Konexa",
    navLogin: "Iniciar sesion",
    navLogout: "Cerrar sesion",
    navAdmin: "Administracion",
    heroEyebrow: "Grupos pequenos. Conversaciones reales. Cero incomodidad.",
    heroTitle: "Descubre actividades y conecta con gente nueva de forma natural.",
    heroText:
      "En Konexa, la vida no se explica: se vive.",
    heroCtaPlans: "Ver planes",
    heroCtaProfile: "Abrir perfil",
    heroCtaCreate: "Crear cuenta",
    heroBenefit1: "Planes seleccionados para que el primer paso sea facil",
    heroBenefit2: "Ve antes de ir que caras pueden resultarte familiares",
    heroBenefit3: "Conexiones reales creadas a partir de experiencias compartidas",
    trustEyebrow: "Senal de comunidad",
    trustTitle: "La sensacion cambia cuando sabes que no vas completamente de cero",
    trustUpcomingTitle: "Proximas",
    trustUpcomingText: "Las personas ven los proximos planes con participantes y acceso rapido.",
    trustPastTitle: "Pasadas",
    trustPastText: "Cada actividad completada pasa a formar parte de tu historia.",
    trustSharedTitle: "Compartidas",
    trustSharedText: "Las conexiones nacen de forma natural de las actividades vividas juntos.",
    feedEyebrow: "",
    feedTitle: "Actividades",
    feedNote:
      "Sin filtros a proposito. El feed prioriza claridad, tono del grupo y familiaridad social para ayudarte a decidir rapido.",
    sharedAvailable: "Conexiones compartidas disponibles al iniciar sesion",
    smallHostedGroup: "Grupo pequeno con anfitrion",
    viewActivity: "Ver actividad",
    joined: "Apuntado",
    joinActivity: "Unirme",
    loginTitle: "Entra y haz que cada plan se sienta mas cercano",
    loginText:
      "Cuando tienes cuenta, Konexa recuerda tu recorrido y te muestra a quien ya conoces, que planes tienes cerca y donde puedes sentirte mas comodo.",
    loginBenefit1: "Sesion segura con Supabase Auth",
    loginBenefit2: "Perfil personal con planes reservados y completados",
    loginBenefit3: "Visibilidad social sin parecer una red social",
    demoMode: "Modo demo activo hasta que configures las claves de Supabase.",
    logIn: "Iniciar sesion",
    returnDashboard: "Vuelve a tu perfil y a tu historial de actividades.",
    email: "Correo electronico",
    phone: "Telefono",
    password: "Contrasena",
    accessAccount: "Acceder a la cuenta",
    createAccount: "Crear cuenta",
    setupProfile: "Configura tu perfil para que Konexa pueda seguir las actividades compartidas.",
    fullName: "Nombre completo",
    signUp: "Registrarme",
    continueGoogle: "Continuar con Google",
    myProfile: "Mi perfil",
    profileText:
      "Un espacio personal, limpio y util para seguir tus proximos planes, recuperar los que ya viviste y reconocer a las personas con las que ya coincidiste.",
    upcoming: "proximas",
    sharedConnections: "conexiones compartidas",
    scheduledActivities: "Actividades programadas",
    scheduledPlans: "Planes confirmados a los que ya te has apuntado",
    pendingActivities: "Pendientes de confirmar",
    pendingPlans: "Solicitudes que todavia estan pendientes de validacion",
    noPending: "No tienes actividades pendientes de confirmar.",
    personalInfo: "Informacion personal",
    personalInfoTitle: "Datos de tu usuario",
    editProfile: "Editar perfil",
    saveProfile: "Guardar cambios",
    profileSaved: "Perfil guardado correctamente.",
    avatarUrl: "URL de la foto de perfil",
    avatarHelp: "Puedes pegar una URL de imagen o mantener el avatar automatico.",
    avatarFile: "Subir nueva foto",
    avatarFileHelp: "Si subes una imagen, tendra prioridad sobre la URL manual.",
    firstName: "Nombre",
    lastName: "Apellidos",
    birthDate: "Fecha de nacimiento",
    upcomingActivities: "Proximas actividades",
    joinedPlans: "Planes en los que ya te has apuntado",
    participantsJoined: "participantes apuntados",
    noUpcoming: "Todavia no tienes actividades futuras.",
    pastActivities: "Actividades pasadas",
    happenedPlans: "Planes que ya han ocurrido",
    noPast: "Los planes pasados apareceran aqui despues de tu primera actividad.",
    sharedConnectionsTitle: "Conexiones compartidas",
    sharedConnectionsText:
      "Creado a partir de asistencia real para generar familiaridad y confianza sin ruido social.",
    sharedCount: "Habeis compartido {count} actividades",
    youMetIn: "Os conocisteis en: {activities}",
    noSharedYet: "Las conexiones compartidas apareceran despues de tu primer plan en grupo.",
    date: "Fecha",
    priceLabel: "Precio",
    participants: "Participantes",
    socialSignal: "Senal social",
    knowPeopleInActivity: "Ya conoces a {count} personas en esta actividad",
    everyoneNew: "Todo el mundo es nuevo para ti en esta actividad",
    alreadyJoinedThisActivity: "Ya te has apuntado a esta actividad",
    joinThisActivity: "Unirme a esta actividad",
    logInToJoin: "Inicia sesion para apuntarte",
    participantsTitle: "Personas apuntadas a esta actividad",
    participantsText:
      "Las personas con las que ya has compartido actividades quedan destacadas para reforzar la familiaridad y la confianza.",
    alreadyFamiliar: "Ya la conoces",
    newForYou: "Nueva para ti",
    noSharedActivityYet: "Todavia no habeis compartido ninguna actividad.",
    cityLabel: "Ciudad",
    adminPending: "Aprobaciones pendientes",
    adminPendingTitle: "Actividades pendientes de confirmar",
    adminPendingText: "Desde aqui puedes confirmar o rechazar solicitudes de entrada.",
    approve: "Confirmar",
    reject: "Rechazar",
    noApprovals: "No hay ninguna solicitud pendiente por revisar.",
    statusConfirmed: "Cambios guardados correctamente.",
    reservationPending: "Reserva pendiente de confirmar",
    reservationConfirmed: "Reserva confirmada",
    cancelReservation: "Anular reserva",
    reservationCancelled: "Has anulado la reserva de esta actividad.",
    cancellationNotice: "Si la anulas, tu plaza volverá a quedar disponible."
  },
  en: {
    brandTagline: "Where life is lived",
    navDiscover: "Discover",
    navActivities: "Activities",
    navHosts: "Meet the hosts",
    navEnergy: "Konexa energy",
    navLogin: "Log in",
    navLogout: "Log out",
    navAdmin: "Admin",
    heroEyebrow: "Small groups. Real conversation. No awkwardness.",
    heroTitle: "Discover activities and connect with new people naturally.",
    heroText:
      "At Konexa, life is not explained: it is lived.",
    heroCtaPlans: "See plans",
    heroCtaProfile: "Open profile",
    heroCtaCreate: "Create account",
    heroBenefit1: "Curated plans that make the first step easier",
    heroBenefit2: "See which faces may already feel familiar before you join",
    heroBenefit3: "Real connections built from shared experiences",
    trustEyebrow: "Community signal",
    trustTitle: "Everything feels easier when you know you are not starting from zero",
    trustUpcomingTitle: "Upcoming",
    trustUpcomingText: "People see upcoming plans with participants and quick access.",
    trustPastTitle: "Past",
    trustPastText: "Every completed activity becomes part of your history.",
    trustSharedTitle: "Shared",
    trustSharedText: "Connections emerge naturally from activities attended together.",
    feedEyebrow: "",
    feedTitle: "Activities",
    feedNote:
      "No filters on purpose. The feed stays simple while surfacing group mood, ease of entry, and social familiarity right on each card.",
    sharedAvailable: "Shared connections available after login",
    smallHostedGroup: "Small hosted group",
    viewActivity: "View activity",
    joined: "Joined",
    joinActivity: "Join activity",
    loginTitle: "Log in and make every plan feel more familiar",
    loginText:
      "With an account, Konexa remembers your path and shows who you already know, which plans are ahead, and where you are most likely to feel comfortable.",
    loginBenefit1: "Secure session with Supabase Auth",
    loginBenefit2: "Personal dashboard for booked and completed plans",
    loginBenefit3: "Social visibility without feeling like a social network",
    demoMode: "Demo mode is active until Supabase keys are configured.",
    logIn: "Log in",
    returnDashboard: "Return to your profile and your activity history.",
    email: "Email",
    phone: "Phone",
    password: "Password",
    accessAccount: "Access account",
    createAccount: "Create account",
    setupProfile: "Set up your profile so Konexa can track shared activities.",
    fullName: "Full name",
    signUp: "Sign up",
    continueGoogle: "Continue with Google",
    myProfile: "My profile",
    profileText:
      "A clean personal space to track upcoming plans, revisit past experiences, and recognize the people you have already shared moments with.",
    upcoming: "upcoming",
    sharedConnections: "shared connections",
    scheduledActivities: "Scheduled activities",
    scheduledPlans: "Confirmed plans you have already joined",
    pendingActivities: "Pending confirmation",
    pendingPlans: "Requests that are still waiting for validation",
    noPending: "You do not have activities pending confirmation.",
    personalInfo: "Personal information",
    personalInfoTitle: "Your account details",
    editProfile: "Edit profile",
    saveProfile: "Save changes",
    profileSaved: "Profile saved successfully.",
    avatarUrl: "Profile photo URL",
    avatarHelp: "You can paste an image URL or keep the automatic avatar.",
    avatarFile: "Upload new photo",
    avatarFileHelp: "If you upload an image, it will take priority over the manual URL.",
    firstName: "First name",
    lastName: "Last name",
    birthDate: "Birth date",
    upcomingActivities: "Upcoming activities",
    joinedPlans: "Plans you have already joined",
    participantsJoined: "participants joined",
    noUpcoming: "You do not have upcoming activities yet.",
    pastActivities: "Past activities",
    happenedPlans: "Plans that already happened",
    noPast: "Past plans will appear here after your first activity.",
    sharedConnectionsTitle: "Shared connections",
    sharedConnectionsText:
      "Built from real attendance to create familiarity and trust without social-network noise.",
    sharedCount: "You have shared {count} activities",
    youMetIn: "You met in: {activities}",
    noSharedYet: "Shared connections will appear after your first group plan.",
    date: "Date",
    priceLabel: "Price",
    participants: "Participants",
    socialSignal: "Social signal",
    knowPeopleInActivity: "You already know {count} people in this activity",
    everyoneNew: "Everyone is new to you in this activity",
    alreadyJoinedThisActivity: "You already joined this activity",
    joinThisActivity: "Join this activity",
    logInToJoin: "Log in to join",
    participantsTitle: "People joining this activity",
    participantsText:
      "Participants you have already shared activities with are highlighted to reinforce familiarity and trust.",
    alreadyFamiliar: "Already familiar",
    newForYou: "New for you",
    noSharedActivityYet: "You have not shared any activity yet.",
    cityLabel: "City",
    adminPending: "Pending approvals",
    adminPendingTitle: "Activities waiting for confirmation",
    adminPendingText: "From here you can approve or reject join requests.",
    approve: "Approve",
    reject: "Reject",
    noApprovals: "There are no pending requests to review.",
    statusConfirmed: "Changes saved successfully.",
    reservationPending: "Reservation pending confirmation",
    reservationConfirmed: "Reservation confirmed",
    cancelReservation: "Cancel reservation",
    reservationCancelled: "You have cancelled your reservation for this activity.",
    cancellationNotice: "If you cancel it, your spot will become available again."
  }
};

export function getMessages(locale: Locale) {
  return messages[locale];
}

export function t(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template
  );
}
