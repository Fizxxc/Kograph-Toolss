import './globals.css';
import SiteHeader from '../components/site-header';
import SiteFooter from '../components/site-footer';

export const metadata = {
  title: 'Kograph Tools',
  description: 'QR, barcode, video, remove background, dan file tools dalam satu tempat.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="site-shell">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
