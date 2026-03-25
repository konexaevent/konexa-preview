type KonexaLogoProps = {
  className?: string;
  iconOnly?: boolean;
};

export function KonexaLogo({ className, iconOnly = false }: KonexaLogoProps) {
  return (
    <svg
      viewBox={iconOnly ? "0 0 100 100" : "0 0 320 84"}
      aria-label="Konexa"
      role="img"
      className={className}
    >
      <defs>
        <linearGradient id="konexaWarm" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb12b" />
          <stop offset="55%" stopColor="#ff5d64" />
          <stop offset="100%" stopColor="#eb2f8b" />
        </linearGradient>
        <linearGradient id="konexaCool" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#16c7b4" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="konexaBar" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb12b" />
          <stop offset="38%" stopColor="#ff4f6f" />
          <stop offset="72%" stopColor="#a02cb5" />
          <stop offset="100%" stopColor="#5a36c6" />
        </linearGradient>
      </defs>

      <g transform="translate(4 6)">
        <circle cx="28" cy="18" r="10" fill="#ffab2d" />
        <circle cx="10" cy="55" r="9" fill="url(#konexaWarm)" />
        <circle cx="60" cy="72" r="8" fill="#14b8c7" />

        <path
          d="M24 31c4 0 8 2 11 6l13 15c4 4 4 11 0 16l-10 10c-3 3-9 2-12-2l-6-9c-2-3-2-8 1-11l2-3c2-2 2-6 0-8l-5-7c-3-4 0-7 6-7z"
          fill="url(#konexaCool)"
        />

        <rect
          x="42"
          y="18"
          width="30"
          height="60"
          rx="15"
          transform="rotate(-42 42 18)"
          fill="url(#konexaBar)"
        />
        <rect
          x="72"
          y="42"
          width="18"
          height="54"
          rx="9"
          transform="rotate(-42 72 42)"
          fill="url(#konexaBar)"
          opacity="0.92"
        />
      </g>

      {!iconOnly ? (
        <g fill="#140f3f">
          <path d="M118 73V29h10v24l24-24h13l-25 25 27 19h-14l-20-14-5 5v9z" />
          <path d="M184 74c-13 0-22-9-22-22 0-13 9-22 22-22 12 0 21 9 21 22 0 13-9 22-21 22zm0-9c7 0 12-5 12-13s-5-13-12-13c-8 0-13 5-13 13s5 13 13 13z" />
          <path d="M210 73V31h9l1 6c4-5 9-7 15-7 10 0 17 7 17 19v24h-10V51c0-8-4-11-10-11-7 0-12 5-12 13v20z" />
          <path d="M282 74c-13 0-22-8-22-22 0-13 9-22 22-22 12 0 21 8 21 22 0 1 0 2-1 3h-32c1 7 6 11 13 11 5 0 9-2 11-5h9c-3 8-11 13-21 13zm-12-26h22c-1-6-6-10-11-10-6 0-10 4-11 10z" />
        </g>
      ) : null}
    </svg>
  );
}
