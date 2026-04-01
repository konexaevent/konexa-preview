import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getHomepageContent } from "@/lib/queries";
import { getExploreContent } from "@/lib/explore-content";

export default async function CommunityPage() {
  const [homepageContent, locale, messages] = await Promise.all([
    getHomepageContent(),
    getLocale(),
    getLocale().then((resolvedLocale) => getMessages(resolvedLocale))
  ]);
  const page = getExploreContent(locale, messages, homepageContent);

  return (
    <div className="page-stack">
      <section className="subpage-intro">
        <p className="eyebrow">{page.pageLabel}</p>
        <h1>{page.trust.title}</h1>
        <p className="lede">{page.communityIntro}</p>
      </section>

      <section className="trust-panel">
        <div>
          <p className="eyebrow">{page.trust.eyebrow}</p>
          <h2>{page.trust.title}</h2>
          {page.trust.note ? <p className="section-note trust-note">{page.trust.note}</p> : null}
        </div>
        <div className="trust-grid">
          {page.trust.items.map((item) => (
            <article key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
