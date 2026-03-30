import PageHero from '../../components/page-hero';
import ConvertHub from '../../components/convert-hub';

export default function ConvertPage() {
  return (
    <>
      <PageHero
        eyebrow="Convert Tools"
        title="Konversi file tanpa tampilan yang ribet."
        description="Pilih mode yang dibutuhkan lalu langsung proses file dari halaman ini."
      />
      <section className="section-block">
        <div className="wrap single-tool-wrap">
          <ConvertHub />
        </div>
      </section>
    </>
  );
}
