import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getHomepageContent } from "@/lib/queries";
import { getExploreContent } from "@/lib/explore-content";

export default async function HostsPage() {
  const [homepageContent, locale, messages] = await Promise.all([
    getHomepageContent(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);
  const page = getExploreContent(locale, messages, homepageContent);
  const hostToneClasses = ["age-tone-18-25", "age-tone-25-35", "age-tone-35-50", "age-tone-50-plus"];

  return (
    <div className="page-stack">
      <section className="subpage-intro">
        <p className="eyebrow">{page.pageLabel}</p>
        <h1>{page.hostsTitle}</h1>
        <p className="lede">{page.hostsText}</p>
      </section>

      <section className="hosts-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">{page.hostsEyebrow}</p>
            <h2>{page.hostsTitle}</h2>
          </div>
          <p className="section-note">{page.hostsText}</p>
        </div>
        <div className="hosts-grid">
          {page.hosts.map((host, index) => (
            <article className={`host-card ${hostToneClasses[index]}`} key={host.name}>
              <div className="host-card-top">
                <img
                  src={host.avatarUrl}
                  alt={host.name}
                  width={68}
                  height={68}
                  className="avatar avatar-large"
                />
                <div>
                  <span className={`signal-tag signal-tag-age ${hostToneClasses[index]}`}>
                    {host.ageLabel}
                  </span>
                  <h3>{host.name}</h3>
                  <p className="host-role">{host.role}</p>
                </div>
              </div>
              <p className="host-bio">{host.bio}</p>
              <div className="host-video-frame">
                <iframe
                  src={host.videoUrl}
                  title={`${page.hostVideoLabel} - ${host.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <span className="host-video-label">{page.hostVideoLabel}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
