'use client';

import { useEffect, useState } from 'react';

export default function PageHero({
  eyebrow,
  title,
  description,
  cta,
  ctaHref = '#'
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="page-hero">
      <div className="wrap page-hero-grid minimal-hero-grid">
        <div className={`hero-main-card ${mounted ? 'animate-scale-in' : ''}`}>
          {eyebrow ? <div className="eyebrow animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{eyebrow}</div> : null}
          <h1 className="page-title animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <span className={mounted ? 'animate-gradient-text' : ''}>{title}</span>
          </h1>
          <p className="page-copy animate-fade-in-up" style={{ animationDelay: '0.3s' }}>{description}</p>

          {cta ? (
            <div className="page-hero-actions animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <a className="button primary" href={ctaHref} rel="noopener">
                {cta}
              </a>
            </div>
          ) : null}
        </div>

        <div className={`hero-preview-card ${mounted ? 'animate-slide-in-right' : ''}`} aria-hidden="true" style={{ animationDelay: '0.2s' }}>
          <div className="hero-preview-window">
            <div className="hero-preview-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="hero-3d-illustration">
              <div className="hero-3d-shape shape-1" />
              <div className="hero-3d-shape shape-2" />
              <div className="hero-3d-shape shape-3" />
              <svg viewBox="0 0 400 340" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2154f3" />
                    <stop offset="100%" stopColor="#6ea8ff" />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#6ea8ff" />
                  </linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#f0f4ff" />
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#2154f3" floodOpacity="0.15" />
                  </filter>
                </defs>

                <g transform="translate(80, 60)" filter="url(#shadow)">
                  <rect x="0" y="0" width="240" height="180" rx="24" fill="url(#g3)" stroke="#e6edf8" strokeWidth="2" />
                  <rect x="20" y="24" width="100" height="12" rx="6" fill="url(#g1)" opacity="0.9" />
                  <rect x="20" y="48" width="160" height="8" rx="4" fill="#c7d2fe" opacity="0.6" />
                  <rect x="20" y="64" width="140" height="8" rx="4" fill="#c7d2fe" opacity="0.4" />
                  <rect x="20" y="88" width="200" height="56" rx="16" fill="#f8fbff" stroke="#e6edf8" strokeWidth="1" />
                  <rect x="32" y="100" width="80" height="10" rx="5" fill="url(#g2)" opacity="0.8" />
                  <rect x="32" y="118" width="60" height="8" rx="4" fill="#e0e7ff" opacity="0.7" />
                  <rect x="32" y="134" width="100" height="8" rx="4" fill="#e0e7ff" opacity="0.5" />
                  <circle cx="200" cy="44" r="18" fill="url(#g1)" opacity="0.15" />
                  <path d="M194 44l6 6 10-10" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                </g>

                <g transform="translate(140, 240)" opacity="0.9">
                  <rect x="0" y="0" width="120" height="48" rx="14" fill="url(#g1)" />
                  <rect x="14" y="16" width="60" height="8" rx="4" fill="#ffffff" opacity="0.9" />
                  <rect x="14" y="30" width="40" height="6" rx="3" fill="#ffffff" opacity="0.5" />
                </g>

                <g transform="translate(40, 180)" opacity="0.7">
                  <rect x="0" y="0" width="80" height="80" rx="20" fill="url(#g2)" opacity="0.15" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 4" />
                </g>

                <g transform="translate(300, 100)" opacity="0.6">
                  <circle cx="0" cy="0" r="28" fill="none" stroke="url(#g1)" strokeWidth="2" strokeDasharray="4 4" />
                  <circle cx="0" cy="0" r="12" fill="url(#g1)" opacity="0.2" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
