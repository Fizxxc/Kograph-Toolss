import PageHero from '../../components/page-hero';
import VideoLab from '../../components/video-lab';

export default function VideoPage() {
  return (
    <>
      <PageHero
        eyebrow="Video Tools"
        title="Kompres atau tingkatkan resolusi video."
        description="Pilih mode, unggah file, lalu tunggu hasil siap diunduh."
      />
      <section className="section-block">
        <div className="wrap single-tool-wrap">
          <VideoLab />
        </div>
      </section>
    </>
  );
}
