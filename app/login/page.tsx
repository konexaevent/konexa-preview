import {
  sendPasswordResetEmail,
  signInWithGoogle,
  signInWithPassword,
  signUpWithPassword
} from "./actions";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const locale = await getLocale();
  const messages = getMessages(locale);
  const error = resolvedSearchParams.error;
  const success = resolvedSearchParams.success;
  const mode = resolvedSearchParams.mode;
  const next =
    typeof resolvedSearchParams.next === "string" ? resolvedSearchParams.next : "/profile";
  const loginUi = {
    ca: {
      badge: "Acces privat",
      trustTitle: "Un cop entres, l'experiencia es mes personal",
      trustItems: [
        "Veus les activitats futures i les passades en un sol espai.",
        "Saps quines persones ja et son familiars abans de tornar-hi.",
        "Tot esta pensat perque apuntar-te sigui rapid i natural."
      ]
    },
    es: {
      badge: "Acceso privado",
      trustTitle: "Cuando entras, la experiencia se vuelve mas personal",
      trustItems: [
        "Ves actividades futuras y pasadas en un mismo espacio.",
        "Sabes que personas ya te resultan familiares antes de volver a ir.",
        "Todo esta pensado para que apuntarte sea rapido y natural."
      ]
    },
    en: {
      badge: "Private access",
      trustTitle: "Once you log in, the experience becomes more personal",
      trustItems: [
        "See upcoming and past activities in one place.",
        "Know which people already feel familiar before joining again.",
        "Everything is designed to make joining fast and natural."
      ]
    }
  }[locale];

  return (
    <div className="auth-layout">
      <section className="auth-copy">
        <p className="eyebrow">Konexa</p>
        <h1>{messages.loginTitle}</h1>
        <p className="lede">{messages.loginText}</p>
        <ul className="hero-benefits">
          <li>{messages.loginBenefit1}</li>
          <li>{messages.loginBenefit2}</li>
          <li>{messages.loginBenefit3}</li>
        </ul>
        <div className="auth-trust-card">
          <span className="pill pill-soft">{loginUi.badge}</span>
          <strong>{loginUi.trustTitle}</strong>
          <ul className="auth-trust-list">
            {loginUi.trustItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="auth-card">
        {typeof error === "string" ? <p className="status status-error">{error}</p> : null}
        {typeof success === "string" ? (
          <p className="status status-success">{success}</p>
        ) : null}
        {typeof mode === "string" ? (
          <p className="status">{messages.demoMode}</p>
        ) : null}

        <div className="auth-panels">
          <form action={signInWithPassword} className="form-card">
            <div className="form-head">
              <h2>{messages.logIn}</h2>
              <p>{messages.returnDashboard}</p>
            </div>
            <input type="hidden" name="next" value={next} />
            <label>
              {messages.email}
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
            <label>
              {messages.password}
              <input type="password" name="password" placeholder="Your password" required />
            </label>
            <button className="button button-primary" type="submit">
              {messages.accessAccount}
            </button>
          </form>

          <form action={signUpWithPassword} className="form-card">
            <div className="form-head">
              <h2>{messages.createAccount}</h2>
              <p>{messages.setupProfile}</p>
            </div>
            <input type="hidden" name="next" value={next} />
            <label>
              {messages.fullName}
              <input type="text" name="full_name" placeholder="Alex Rivera" required />
            </label>
            <label>
              {messages.email}
              <input type="email" name="email" placeholder="alex@example.com" required />
            </label>
            <label>
              {messages.phone}
              <input type="tel" name="phone_number" placeholder="+34 600 000 000" required />
            </label>
            <label>
              {messages.birthDate}
              <input type="date" name="birth_date" required />
            </label>
            <label>
              {messages.password}
              <input type="password" name="password" placeholder="At least 8 characters" required />
            </label>
            <button className="button button-secondary" type="submit">
              {messages.signUp}
            </button>
          </form>

          <form action={sendPasswordResetEmail} className="form-card form-card-compact">
            <div className="form-head">
              <h2>
                {locale === "ca"
                  ? "Has oblidat la contrasenya?"
                  : locale === "es"
                    ? "Has olvidado tu contrasena?"
                    : "Forgot your password?"}
              </h2>
              <p>
                {locale === "ca"
                  ? "T'enviarem un correu per recuperar l'acces al compte."
                  : locale === "es"
                    ? "Te enviaremos un correo para recuperar el acceso a tu cuenta."
                    : "We will send you an email so you can recover access to your account."}
              </p>
            </div>
            <label>
              {messages.email}
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
            <button className="button button-ghost" type="submit">
              {locale === "ca"
                ? "Enviar correu de recuperacio"
                : locale === "es"
                  ? "Enviar correo de recuperacion"
                  : "Send recovery email"}
            </button>
          </form>
        </div>

        <form action={signInWithGoogle}>
          <input type="hidden" name="next" value={next} />
          <button className="button button-ghost" type="submit">
            {messages.continueGoogle}
          </button>
        </form>
      </section>
    </div>
  );
}
