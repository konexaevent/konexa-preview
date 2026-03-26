"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function BrandSplash() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const deviceKey =
      window.matchMedia("(max-width: 768px)").matches ? "mobile" : "desktop";
    const storageKey = `konexa-brand-splash-seen-${deviceKey}`;
    const alreadySeen = window.sessionStorage.getItem(storageKey) === "1";

    if (alreadySeen) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    window.sessionStorage.setItem(storageKey, "1");

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="brand-splash" aria-hidden="true">
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
