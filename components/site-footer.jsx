import Link from 'next/link';

function FooterList({ title, items }) {
  return (
    <div>
      <h4 className="footer-title">{title}</h4>
      <ul className="footer-list">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-shell">
        <div className="refined-footer-grid">
          <div className="footer-about">
            <div className="brandline">
              <span className="brandmark">K</span>
              <span className="brandcopy">Kograph Tools</span>
            </div>
            <p className="footer-copy">
              Web tools untuk QR, barcode, video, gambar, dan file dalam tampilan yang ringkas.
            </p>
            <a className="footer-donate" href="https://saweria.co/Fizzx" target="_blank" rel="noreferrer">
              Traktir Admin Ngopi
            </a>
          </div>

          <FooterList
            title="Tools"
            items={[
              { href: '/qr', label: 'QR Generator' },
              { href: '/barcode', label: 'Barcode Generator' },
              { href: '/video', label: 'Video Tools' },
              { href: '/remove-background', label: 'Remove Background' },
              { href: '/convert', label: 'Convert Tools' }
            ]}
          />

          <FooterList
            title="Legal"
            items={[
              { href: '/terms', label: 'Syarat & Ketentuan' },
              { href: '/privacy', label: 'Kebijakan Privasi' }
            ]}
          />

          <div>
            <h4 className="footer-title">Ringkasan</h4>
            <div className="legal-mini-card">
              <strong>Gunakan file milik Anda</strong>
              <p>Pastikan file yang diproses memang Anda miliki atau Anda punya izin untuk menggunakannya.</p>
            </div>
            <div className="legal-mini-card">
              <strong>Periksa hasil sebelum dipakai</strong>
              <p>Tinjau kembali output sebelum digunakan untuk dokumen penting, publikasi, atau kebutuhan komersial.</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Kograph Tools</span>
          <div className="footer-bottom-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
