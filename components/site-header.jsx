'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/qr', label: 'QR' },
  { href: '/barcode', label: 'Barcode' },
  { href: '/video', label: 'Video' },
  { href: '/audio-extractor', label: 'Audio' },
  { href: '/remove-background', label: 'Remove BG' },
  { href: '/blur-face', label: 'Blur Face' },
  { href: '/image-info', label: 'Image Info' },
  { href: '/convert', label: 'Convert' }
];

function NavItems({ pathname, onNavigate }) {
  return links.map((item) => {
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`topnav-link${active ? ' is-active' : ''}`}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  });
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link href="/" className="brandline" aria-label="Kograph Tools Home">
          <span className="brandmark">K</span>
          <span className="brandcopy">Kograph Tools</span>
        </Link>

        <nav className="topnav topnav-desktop" aria-label="Main navigation">
          <NavItems pathname={pathname} />
        </nav>

        <div className="topbar-actions">
          <a className="topbar-cta desktop-donate" href="https://saweria.co/Fizzx" target="_blank" rel="noreferrer">
            Traktir Admin Ngopi
          </a>

          <button
            type="button"
            className={`menu-toggle${open ? ' is-open' : ''}`}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-nav-panel" className={`mobile-nav-shell${open ? ' is-open' : ''}`}>
        <div className="wrap">
          <div className="mobile-nav-card">
            <nav className="mobile-nav-grid" aria-label="Mobile navigation">
              <NavItems pathname={pathname} onNavigate={() => setOpen(false)} />
            </nav>
            <a className="topbar-cta mobile-donate" href="https://saweria.co/Fizzx" target="_blank" rel="noreferrer">
              Traktir Admin Ngopi
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
