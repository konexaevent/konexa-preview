import { updatePasswordAction } from "@/app/login/actions";
import { getLocale } from "@/lib/i18n-server";

type ResetPasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const locale = await getLocale();
  const error = resolvedSearchParams.error;

  const copy = {
    ca: {
      eyebrow: "Recuperacio del compte",
      title: "Posa una contrasenya nova",
      text: "Ara pots triar una contrasenya nova per tornar a entrar al teu compte de Konexa.",
      password: "Nova contrasenya",
      confirmPassword: "Repeteix la contrasenya",
      submit: "Desar contrasenya"
    },
    es: {
      eyebrow: "Recuperacion de cuenta",
      title: "Elige una nueva contrasena",
      text: "Ahora puedes elegir una nueva contrasena para volver a entrar en tu cuenta de Konexa.",
      password: "Nueva contrasena",
      confirmPassword: "Repite la contrasena",
      submit: "Guardar contrasena"
    },
    en: {
      eyebrow: "Account recovery",
      title: "Choose a new password",
      text: "You can now choose a new password to access your Konexa account again.",
      password: "New password",
      confirmPassword: "Repeat password",
      submit: "Save password"
    }
  }[locale];

  return (
    <div className="auth-layout auth-layout-single">
      <section className="auth-card auth-card-single">
        {typeof error === "string" ? <p className="status status-error">{error}</p> : null}
        <form action={updatePasswordAction} className="form-card">
          <div className="form-head">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p>{copy.text}</p>
          </div>
          <label>
            {copy.password}
            <input type="password" name="password" placeholder="At least 8 characters" required />
          </label>
          <label>
            {copy.confirmPassword}
            <input type="password" name="confirm_password" placeholder="Repeat password" required />
          </label>
          <button className="button button-primary" type="submit">
            {copy.submit}
          </button>
        </form>
      </section>
    </div>
  );
}
