import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
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
            navDiscover={messages.navActivities}
            navHosts={messages.navHosts}
            navEnergy={messages.navEnergy}
            navAdmin={messages.navAdmin}
            navLogin={messages.navLogin}
            navLogout={messages.navLogout}
            showAdminLink={Boolean(
              dashboard && dashboard.profile.role === "admin"
            )}
            userDisplayName={user ? user.user_metadata.full_name || user.email || null : null}
          />

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
