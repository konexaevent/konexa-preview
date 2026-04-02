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
  navMenu: string;
  menuHome: string;
  navDiscover: string;
  navHosts: string;
  navEnergy: string;
  navHowItWorks: string;
  navCommunity: string;
  navAdmin: string;
  navProfile: string;
  navLogin: string;
  navLogout: string;
  showAdminLink: boolean;
  userDisplayName: string | null;
};

export function SiteHeader({
  locale,
  brandTagline,
  navMenu,
  menuHome,
  navDiscover,
  navHosts,
  navEnergy,
  navHowItWorks,
  navCommunity,
  navAdmin,
  navProfile,
  navLogin,
  navLogout,
  showAdminLink,
  userDisplayName
}: SiteHeaderProps) {
  const [isCompact, setIsCompact] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isPeeked, setIsPeeked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateHeaderState() {
      const currentScrollY = window.scrollY;
      const shouldCompact = currentScrollY > 18;
      const delta = currentScrollY - lastScrollY;
      const scrollingDown = delta > 6;
      const scrollingUp = delta < -6;

      let nextHidden = isHidden;
      if (currentScrollY < 24) {
        nextHidden = false;
      } else if (scrollingDown && currentScrollY > 120) {
        nextHidden = true;
      } else if (scrollingUp) {
        nextHidden = false;
      }

      setIsCompact(shouldCompact);
      setIsHidden(nextHidden);
      if (!nextHidden || currentScrollY < 24 || scrollingUp) {
        setIsPeeked(false);
      }
      lastScrollY = currentScrollY;
      ticking = false;
    }

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateHeaderState);
        ticking = true;
      }
    }

    updateHeaderState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHidden]);

  useEffect(() => {
    function handleWindowClick() {
      setMenuOpen(false);
    }

    if (menuOpen) {
      window.addEventListener("click", handleWindowClick);
    }

    return () => window.removeEventListener("click", handleWindowClick);
  }, [menuOpen]);

  return (
    <>
      {isHidden ? (
        <div
          className="site-header-peek-zone"
          onMouseEnter={() => setIsPeeked(true)}
          aria-hidden="true"
        />
      ) : null}
      <header
        className={`site-header ${isCompact ? "site-header-compact" : ""} ${isHidden ? "site-header-hidden" : ""} ${isPeeked ? "site-header-peeked" : ""}`}
        onMouseLeave={() => {
          if (isHidden) {
            setIsPeeked(false);
          }
        }}
      >
      <div className="site-header-main">
        <div className="site-header-shell">
          <nav className="site-nav">
            <div className="site-menu-wrap">
              <button
                type="button"
                className="site-menu-button"
                aria-label={navMenu}
                aria-expanded={menuOpen}
                onClick={(event) => {
                  event.stopPropagation();
                  setMenuOpen((current) => !current);
                }}
              >
                <span />
                <span />
                <span />
              </button>
              {menuOpen ? (
                <div
                  className="site-menu-dropdown"
                  onClick={(event) => event.stopPropagation()}
                >
                  <p className="site-menu-title">{navMenu}</p>
                  <Link href="/" className="site-menu-link" onClick={() => setMenuOpen(false)}>
                    {menuHome}
                  </Link>
                  <Link href="/#plans" className="site-menu-link" onClick={() => setMenuOpen(false)}>
                    {navDiscover}
                  </Link>
                  <Link href="/com-funciona" className="site-menu-link" onClick={() => setMenuOpen(false)}>
                    {navHowItWorks}
                  </Link>
                  <Link href="/comunitat" className="site-menu-link" onClick={() => setMenuOpen(false)}>
                    {navCommunity}
                  </Link>
                  <Link href="/energia" className="site-menu-link" onClick={() => setMenuOpen(false)}>
                    {navEnergy}
                  </Link>
                  <Link href="/hosts" className="site-menu-link" onClick={() => setMenuOpen(false)}>
                    {navHosts}
                  </Link>
                  {showAdminLink ? (
                    <Link href="/admin" className="site-menu-link" onClick={() => setMenuOpen(false)}>
                      {navAdmin}
                    </Link>
                  ) : null}
                  {userDisplayName ? (
                    <form action={signOutAction} className="site-menu-form">
                      <button type="submit" className="site-menu-action">
                        {navLogout}
                      </button>
                    </form>
                  ) : (
                    <Link href="/login" className="site-menu-link" onClick={() => setMenuOpen(false)}>
                      {navLogin}
                    </Link>
                  )}
                  <div className="site-menu-socials">
                    <a
                      href="https://www.instagram.com/konexa.events?igsh=NmV1cjZlczRvZ285&utm_source=qr"
                      target="_blank"
                      rel="noreferrer"
                      className="site-menu-social"
                      aria-label="Instagram"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                        <circle cx="12" cy="12" r="4.2" />
                        <circle cx="17.4" cy="6.7" r="1.1" className="site-menu-social-fill" />
                      </svg>
                    </a>
                    <a
                      href="https://www.tiktok.com/@konexa.on.la.vida?_r=1&_t=ZN-95CVreumUr8"
                      target="_blank"
                      rel="noreferrer"
                      className="site-menu-social"
                      aria-label="TikTok"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M14.7 3c.5 1.7 1.9 3 3.6 3.4v3a6.4 6.4 0 0 1-3.6-1.1v5.9a5.6 5.6 0 1 1-5.6-5.5c.5 0 .9 0 1.3.1v3.1a2.6 2.6 0 1 0 1.3 2.3V3h3z" />
                      </svg>
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
            {userDisplayName ? (
              <div className="nav-user-area">
                <Link href="/profile" className="user-chip user-chip-profile">
                  <span className="user-chip-title">{navProfile}</span>
                  <span className="user-chip-subtitle">{userDisplayName}</span>
                </Link>
              </div>
            ) : null}
          </nav>

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
        </div>

        <div className="header-language-slot">
          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
      </header>
    </>
  );
}
