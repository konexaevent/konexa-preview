import Link from "next/link";

type ProfileSectionCardProps = {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  meta: string;
  accent: string;
  openLabel: string;
  activeLabel: string;
  active?: boolean;
};

export function ProfileSectionCard({
  href,
  eyebrow,
  title,
  description,
  meta,
  accent,
  openLabel,
  activeLabel,
  active = false
}: ProfileSectionCardProps) {
  return (
    <Link className={`profile-section-card${active ? " is-active" : ""}`} href={href}>
      <div className="profile-section-card-head">
        <span className="profile-section-card-accent">{accent}</span>
        <span className="pill pill-soft">{eyebrow}</span>
      </div>
      <div className="profile-section-card-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="profile-section-card-meta">
        <strong>{meta}</strong>
        <span>{active ? activeLabel : openLabel}</span>
      </div>
    </Link>
  );
}
