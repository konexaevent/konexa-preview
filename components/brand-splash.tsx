"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function BrandSplash() {
  const [phase, setPhase] = useState<"hidden" | "visible" | "closing">("hidden");

  useEffect(() => {
    const deviceKey =
      window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
    const storageKey = `konexa-brand-splash-seen-${deviceKey}`;
    let alreadySeen = false;

    try {
      alreadySeen = window.sessionStorage.getItem(storageKey) === "1";
    } catch {
      alreadySeen = false;
    }

    if (alreadySeen) {
      setPhase("hidden");
      return;
    }

    setPhase("visible");

    try {
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // Ignore storage issues and still show the intro once.
    }

    const closeTimer = window.setTimeout(() => {
      setPhase("closing");
    }, 2200);
    const hideTimer = window.setTimeout(() => {
      setPhase("hidden");
    }, 3000);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div
      className={`brand-splash ${phase === "closing" ? "brand-splash-closing" : ""}`}
      aria-hidden="true"
    >
      <div className="brand-splash-glow" />
      <div className="brand-splash-mark">
        <Image
          src="/logo-wordmark.png"
          alt="Konexa"
          width={453}
          height={153}
          className="brand-splash-wordmark"
          priority
        />
        <Image
          src="/logo-sense-lletra-1.png"
          alt="Konexa"
          width={438}
          height={351}
          className="brand-splash-logo"
          priority
        />
      </div>
    </div>
  );
}
