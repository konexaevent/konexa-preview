import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { signOutAction } from "@/app/actions";
import { CookieBanner } from "@/components/cookie-banner";
import { LanguageSwitcher } from "@/components/language-switcher";
import { PwaRegister } from "@/components/pwa-register";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getCurrentUser, getProfileDashboard } from "@/lib/queries";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Konexa",
  description:
    "Konexa conecta personas a traves de actividades reales y pequenos grupos.",
  metadataBase: new URL(appUrl),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo.PNG",
    apple: "/logo.PNG",
    shortcut: "/logo.PNG"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Konexa"
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, locale, messages] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);
  const dashboard = user ? await getProfileDashboard(user.id) : null;
  const cookieCopy = {
    ca: {
      title: "Cookies i preferencies",
      text: "Fem servir cookies essencials i de preferencies per mantenir la sessio, recordar l'idioma i millorar l'experiencia.",
      accept: "Acceptar",
      reject: "Nomes essencials",
      more: "Mes informacio"
    },
    es: {
      title: "Cookies y preferencias",
      text: "Usamos cookies esenciales y de preferencias para mantener la sesion, recordar el idioma y mejorar la experiencia.",
      accept: "Aceptar",
      reject: "Solo esenciales",
      more: "Mas informacion"
    },
    en: {
      title: "Cookies and preferences",
      text: "We use essential and preference cookies to keep sessions active, remember language, and improve the experience.",
      accept: "Accept",
      reject: "Essential only",
      more: "More info"
    }
  }[locale];

  return (
    <html lang={locale}>
      <body>
        <PwaRegister />
        <div className="app-frame">
          <header className="site-header">
            <div className="site-utility">
              <LanguageSwitcher currentLocale={locale} />
            </div>

            <div className="site-header-main">
              <Link href="/" className="brand">
                <span className="brand-mark">
                  <Image
                    src="/logo-sense-lletra-1.png"
                    alt="Konexa icon"
                    width={438}
                    height={351}
                    className="brand-logo-image"
                    priority
                  />
                </span>
                <span className="brand-copy">
                  <Image
                    src="/logo-wordmark.png"
                    alt="Konexa"
                    width={453}
                    height={153}
                    className="brand-wordmark-image"
                    priority
                  />
                  <small>{messages.brandTagline}</small>
                </span>
              </Link>

              <nav className="site-nav">
                <Link href="/" className="nav-link-muted">{messages.navDiscover}</Link>
                {dashboard && (dashboard.profile.role === "admin" || dashboard.profile.role === "host") ? (
                  <Link href="/admin/pending" className="nav-link-muted">{messages.navAdmin}</Link>
                ) : null}
                {user ? (
                  <div className="nav-user-area">
                    <Link href="/profile" className="user-chip">
                      {user.user_metadata.full_name || user.email}
                    </Link>
                    <form action={signOutAction}>
                      <button type="submit" className="nav-plain-button">
                        {messages.navLogout}
                      </button>
                    </form>
                  </div>
                ) : (
                  <Link href="/login" className="nav-cta">
                    {messages.navLogin}
                  </Link>
                )}
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="site-footer">
            <div className="footer-brand">
              <p>Konexa</p>
              <span>{messages.brandTagline}</span>
            </div>
            <div className="footer-links">
              <Link href="/privacy">Privacitat</Link>
              <Link href="/cookies">Cookies</Link>
            </div>
          </footer>
        </div>
        <CookieBanner copy={cookieCopy} />
      </body>
    </html>
  );
}
