import Link from 'next/link';
import PageHero from '../components/page-hero';

const tools = [
  {
    href: '/qr',
    label: 'QR Generator',
    desc: 'Buat QR dari link, teks, atau URL lalu atur warna, bentuk, dan logo.',
    badge: 'QR',
    note: 'Preview langsung'
  },
  {
    href: '/barcode',
    label: 'Barcode Generator',
    desc: 'Buat barcode dengan preview bersih lalu simpan hasil PNG.',
    badge: 'Barcode',
    note: 'Ekspor PNG'
  },
  {
    href: '/video',
    label: 'Video Tools',
    desc: 'Kompres video atau tingkatkan resolusi dari satu halaman yang ringkas.',
    badge: 'Video',
    note: 'Compress & HD'
  },
  {
    href: '/audio-extractor',
    label: 'Audio Extractor',
    desc: 'Ambil audio dari video dan simpan hasilnya dalam format MP3.',
    badge: 'Audio',
    note: 'Extract MP3'
  },
  {
    href: '/remove-background',
    label: 'Remove Background',
    desc: 'Unggah gambar lalu unduh hasil transparan saat proses selesai.',
    badge: 'Image',
    note: 'Standard & HD'
  },
  {
    href: '/blur-face',
    label: 'Blur Face',
    desc: 'Deteksi wajah lalu blur otomatis untuk hasil yang lebih aman dibagikan.',
    badge: 'Privacy',
    note: 'Auto blur'
  },
  {
    href: '/image-info',
    label: 'Image Info',
    desc: 'Lihat detail gambar seperti ukuran, format, resolusi, author, dan metadata.',
    badge: 'Info',
    note: 'Metadata'
  },
  {
    href: '/convert',
    label: 'Convert Tools',
    desc: 'Konversi dokumen, gambar, dan PDF dalam satu tempat.',
    badge: 'Files',
    note: 'Multi tool'
  }
];

function ToolCard({ href, label, desc, badge, note }) {
  return (
    <Link href={href} className="tool-index-card">
      <div className="tool-index-top">
        <span className="tool-index-badge">{badge}</span>
        <span className="tool-index-note">{note}</span>
      </div>
      <h3>{label}</h3>
      <p>{desc}</p>
      <span className="tool-index-link">Buka tool</span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <>
      <PageHero
        eyebrow="Kograph Tools"
        title="Alat praktis untuk gambar, video, audio, QR, dan file."
        description="Pilih tool yang dibutuhkan lalu mulai."
        cta="Lihat semua tools"
        ctaHref="#tools"
      />

      <section className="section-block home-categories-block">
        <div className="wrap">
          <div className="home-category-row">
            <span className="home-category-chip">QR & Barcode</span>
            <span className="home-category-chip">Video</span>
            <span className="home-category-chip">Audio</span>
            <span className="home-category-chip">Images</span>
            <span className="home-category-chip">Documents</span>
            <span className="home-category-chip">PDF</span>
            <span className="home-category-chip">Privacy</span>
            <span className="home-category-chip">Metadata</span>
          </div>
        </div>
      </section>

      <section className="section-block" id="tools">
        <div className="wrap">
          <div className="section-head compact compact-start">
            <div>
              <h2>Semua tool</h2>
              <p>Pilih halaman yang ingin dipakai.</p>
            </div>
          </div>

          <div className="tool-index-grid">
            {tools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block home-steps-block">
        <div className="wrap">
          <div className="home-steps-panel">
            <div className="home-steps-copy">
              <span className="eyebrow eyebrow-soft">Mulai cepat</span>
              <h2>Pilih tool, unggah file, lalu unduh hasilnya.</h2>
              <p>Tampilan dibuat ringkas supaya fokus tetap ke proses dan hasil.</p>
            </div>
            <div className="mini-steps">
              <div className="mini-step-card">
                <strong>1</strong>
                <span>Pilih tool</span>
              </div>
              <div className="mini-step-card">
                <strong>2</strong>
                <span>Unggah file</span>
              </div>
              <div className="mini-step-card">
                <strong>3</strong>
                <span>Atur hasil</span>
              </div>
              <div className="mini-step-card">
                <strong>4</strong>
                <span>Unduh output</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}