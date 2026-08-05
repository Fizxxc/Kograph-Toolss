import PageHero from '../../components/page-hero';
import TikTokDownloader from '../../components/tiktok-downloader';

export default function TikTokPage() {
  return (
    <>
      <PageHero
        eyebrow="TikTok Downloader"
        title="Unduh video TikTok tanpa watermark."
        description="Tempel URL video TikTok, lalu unduh hasilnya dalam kualitas terbaik."
      />
      <section className="section-block">
        <div className="wrap single-tool-wrap">
          <TikTokDownloader />
        </div>
      </section>
    </>
  );
}
