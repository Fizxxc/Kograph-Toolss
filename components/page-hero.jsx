export default function PageHero({
  eyebrow,
  title,
  description,
  cta,
  ctaHref = '#'
}) {
  return (
    <section className="page-hero">
      <div className="wrap page-hero-grid minimal-hero-grid">
        <div className="hero-main-card">
          {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
          <h1 className="page-title">{title}</h1>
          <p className="page-copy">{description}</p>

          {cta ? (
            <div className="page-hero-actions">
              <a className="button primary" href={ctaHref}>
                {cta}
              </a>
            </div>
          ) : null}
        </div>

        <div className="hero-preview-card" aria-hidden="true">
          <div className="hero-preview-window">
            <div className="hero-preview-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="hero-preview-grid">
              <div className="preview-pill large" />
              <div className="preview-pill" />
              <div className="preview-pill" />
              <div className="preview-box tall" />
              <div className="preview-box" />
              <div className="preview-box" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}