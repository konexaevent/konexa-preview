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
                </div>
              ) : null}
            </div>
            {showAdminLink ? (
              <Link href="/admin" className="nav-link-muted">{navAdmin}</Link>
            ) : null}
            {userDisplayName ? (
              <div className="nav-user-area">
                <Link href="/profile" className="user-chip user-chip-profile">
                  <span className="user-chip-title">{navProfile}</span>
                  <span className="user-chip-subtitle">{userDisplayName}</span>
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
