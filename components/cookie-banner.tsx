"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_KEY = "konexa_cookie_choice";

type CookieBannerProps = {
  copy: {
    title: string;
    text: string;
    accept: string;
    reject: string;
    more: string;
  };
};

export function CookieBanner({ copy }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedChoice = window.localStorage.getItem(COOKIE_KEY);
    if (!storedChoice) {
      setVisible(true);
    }
  }, []);

  function handleChoice(value: "accepted" | "rejected") {
    window.localStorage.setItem(COOKIE_KEY, value);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <aside className="cookie-banner" aria-live="polite">
      <div className="cookie-banner-copy">
        <strong>{copy.title}</strong>
        <p>{copy.text}</p>
      </div>
      <div className="cookie-banner-actions">
        <Link href="/cookies" className="cookie-link">
          {copy.more}
        </Link>
        <button
          type="button"
          className="button button-secondary button-small"
          onClick={() => handleChoice("rejected")}
        >
          {copy.reject}
        </button>
        <button
          type="button"
          className="button button-primary button-small"
          onClick={() => handleChoice("accepted")}
        >
          {copy.accept}
        </button>
      </div>
    </aside>
  );
}
