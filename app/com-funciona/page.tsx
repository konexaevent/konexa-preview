import { getMessages } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getHomepageContent } from "@/lib/queries";
import { getExploreContent } from "@/lib/explore-content";

export default async function HowItWorksPage() {
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
        <h1>{page.stepsTitle}</h1>
        <p className="lede">{page.stepsIntro}</p>
      </section>

      <section className="steps-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">{page.stepsEyebrow}</p>
            <h2>{page.stepsTitle}</h2>
          </div>
        </div>
        <div className="steps-grid">
          {page.steps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <span className="step-number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
