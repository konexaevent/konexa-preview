"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOutAction } from "@/app/actions";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
  brandTagline: string;
  navDiscover: string;
  navAdmin: string;
  navLogin: string;
  navLogout: string;
  showAdminLink: boolean;
  userDisplayName: string | null;
};

export function SiteHeader({
  locale,
  brandTagline,
  navDiscover,
  navAdmin,
  navLogin,
  navLogout,
  showAdminLink,
  userDisplayName
}: SiteHeaderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPeeked, setIsPeeked] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const nextCollapsed = window.scrollY > 28;
      setIsCollapsed(nextCollapsed);
      if (!nextCollapsed) {
        setIsPeeked(false);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {isCollapsed ? (
        <div
          className="site-header-peek-zone"
          onMouseEnter={() => setIsPeeked(true)}
          aria-hidden="true"
        />
      ) : null}
      <header
        className={`site-header ${isCollapsed ? "site-header-collapsed" : ""} ${isPeeked ? "site-header-peeked" : ""}`}
        onMouseEnter={() => {
          if (isCollapsed) {
            setIsPeeked(true);
          }
        }}
        onMouseLeave={() => {
          if (isCollapsed) {
            setIsPeeked(false);
          }
        }}
      >
      <div className="site-header-main">
        <div className="site-header-shell">
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
              <small>{brandTagline}</small>
            </span>
          </Link>

          <nav className="site-nav">
            <Link href="/" className="nav-link-muted">{navDiscover}</Link>
            {showAdminLink ? (
              <Link href="/admin/pending" className="nav-link-muted">{navAdmin}</Link>
            ) : null}
            {userDisplayName ? (
              <div className="nav-user-area">
                <Link href="/profile" className="user-chip">
                  {userDisplayName}
                </Link>
                <form action={signOutAction}>
                  <button type="submit" className="nav-plain-button">
                    {navLogout}
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="nav-cta">
                {navLogin}
              </Link>
            )}
          </nav>
        </div>

        <div className="header-language-slot">
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
      </header>
    </>
  );
}
