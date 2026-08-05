import PageHero from '../../components/page-hero';
import ImageEditor from '../../components/image-editor';

export default function ImageEditorPage() {
  return (
    <>
      <PageHero
        eyebrow="Image Editor"
        title="Upscale atau kompres gambar PNG/JPG."
        description="Tingkatkan resolusi gambar atau kurangi ukuran file sesuai kebutuhan."
      />
      <section className="section-block">
        <div className="wrap single-tool-wrap">
          <ImageEditor />
        </div>
      </section>
    </>
  );
}
