import Image from "next/image";
import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getHomepageContent } from "@/lib/queries";
import { getExploreContent } from "@/lib/explore-content";

export default async function EnergyPage() {
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
        <h1>{page.galleryTitle}</h1>
        <p className="lede">{page.galleryText}</p>
      </section>

      <section className="memory-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">{page.galleryEyebrow}</p>
            <h2>{page.galleryTitle}</h2>
          </div>
          <p className="section-note">{page.galleryText}</p>
        </div>

        <div className="memory-grid">
          <article className="memory-video-card">
            <div className="memory-video-frame">
              <iframe
                src={page.memoriesVideoUrl}
                title={page.videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="memory-card-copy">
              <strong>{page.videoTitle}</strong>
              <p>{page.galleryText}</p>
            </div>
          </article>

          <div className="memory-photo-grid">
            {page.memoriesItems.map((item) => (
              <article className="memory-photo-card" key={item.title}>
                <div className="memory-photo-frame">
                  <Image src={item.imageUrl} alt={item.title} fill className="activity-image" />
                </div>
                <div className="memory-card-copy">
                  <strong>{item.title}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
