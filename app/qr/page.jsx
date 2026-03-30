import PageHero from '../../components/page-hero';
import QrStudio from '../../components/qr-studio';

export default function QrPage() {
  return (
    <>
      <PageHero
        eyebrow="QR Generator"
        title="Buat QR yang rapi dalam beberapa klik."
        description="Tempel link atau teks, atur style, pasang logo, lalu unduh hasilnya."
      />
      <section className="section-block">
        <div className="wrap single-tool-wrap">
          <QrStudio />
        </div>
      </section>
    </>
  );
}
