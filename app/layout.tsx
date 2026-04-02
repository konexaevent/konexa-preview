import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { signOutAction } from "@/app/actions";
import { BrandSplash } from "@/components/brand-splash";
import { CookieBanner } from "@/components/cookie-banner";
import { SiteHeader } from "@/components/site-header";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getCurrentUser, getProfileDashboard } from "@/lib/queries";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Konexa",
  description:
    "Konexa conecta personas a traves de actividades reales y pequenos grupos.",
  metadataBase: new URL(appUrl),
  icons: {
    icon: "/logo.PNG",
    apple: "/logo.PNG",
    shortcut: "/logo.PNG"
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
        <BrandSplash />
        <div className="app-frame">
          <SiteHeader
            locale={locale}
            brandTagline={messages.brandTagline}
            navMenu={messages.navMenu}
            menuHome={messages.menuHome}
            navDiscover={messages.navActivities}
            navHosts={messages.navHosts}
            navEnergy={messages.navEnergy}
            navHowItWorks={messages.menuHowItWorks}
            navCommunity={messages.menuCommunity}
            navAdmin={messages.navAdmin}
            navProfile={messages.myProfile}
            navLogin={messages.navLogin}
            navLogout={messages.navLogout}
            showAdminLink={Boolean(
              dashboard && dashboard.profile.role === "admin"
            )}
            userDisplayName={
              user
                ? dashboard?.profile.name || user.email || null
                : null
            }
          />

          <main>{children}</main>

          <section className="page-end-nav" aria-label={messages.navMenu}>
            <div className="page-end-nav-shell">
              <div className="page-end-brand">
                <p className="page-end-brand-name">Konexa</p>
                <p className="page-end-brand-tagline">{messages.brandTagline}</p>
                <p className="page-end-brand-copy">
                  Activitats reals per conèixer gent, compartir plans i fer que quedar sigui més fàcil.
                </p>
                <div className="page-end-brand-contact">
                  <span>konexaevents@gmail.com</span>
                  <span>Girona</span>
                </div>
                <div className="page-end-socials">
                  <a
                    href="https://www.instagram.com/konexa.events?igsh=NmV1cjZlczRvZ285&utm_source=qr"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://www.tiktok.com/@konexa.on.la.vida?_r=1&_t=ZN-95CVreumUr8"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                  >
                    TikTok
                  </a>
                </div>
              </div>

              <div className="page-end-columns">
                <div className="page-end-column">
                  <p className="page-end-nav-title">Navegació</p>
                  <nav className="page-end-list">
                    <Link href="/">{messages.menuHome}</Link>
                    <Link href="/#plans">{messages.navActivities}</Link>
                    <Link href="/com-funciona">{messages.menuHowItWorks}</Link>
                  </nav>
                </div>

                <div className="page-end-column">
                  <p className="page-end-nav-title">Més Konexa</p>
                  <nav className="page-end-list">
                    <Link href="/comunitat">{messages.menuCommunity}</Link>
                    <Link href="/energia">{messages.navEnergy}</Link>
                    <Link href="/hosts">{messages.navHosts}</Link>
                  </nav>
                </div>

                <div className="page-end-column">
                  <p className="page-end-nav-title">Compte</p>
                  <nav className="page-end-list">
                    {user ? <Link href="/profile">{messages.myProfile}</Link> : <Link href="/login">{messages.navLogin}</Link>}
                    {dashboard && dashboard.profile.role === "admin" ? (
                      <Link href="/admin">{messages.navAdmin}</Link>
                    ) : null}
                    {user ? (
                      <form action={signOutAction} className="footer-nav-form">
                        <button type="submit" className="page-end-link-button">
                          {messages.navLogout}
                        </button>
                      </form>
                    ) : null}
                  </nav>
                </div>
              </div>
            </div>
          </section>

          <footer className="site-footer">
            <div className="footer-main">
              <div className="footer-brand">
                <p>Konexa</p>
                <span>{messages.brandTagline}</span>
              </div>
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
