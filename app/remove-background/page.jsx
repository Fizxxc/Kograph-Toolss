import PageHero from '../../components/page-hero';
import BackgroundLab from '../../components/background-lab';

export default function RemoveBackgroundPage() {
  return (
    <>
      <PageHero
        eyebrow="Remove Background"
        title="Hilangkan background foto dengan cepat."
        description="Unggah gambar, pilih mode, lalu unduh hasil transparan saat sudah siap."
      />
      <section className="section-block">
        <div className="wrap single-tool-wrap">
          <BackgroundLab />
        </div>
      </section>
    </>
  );
}
