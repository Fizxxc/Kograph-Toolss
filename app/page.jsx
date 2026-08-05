'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PageHero from '../components/page-hero';

const tools = [
  {
    href: '/qr',
    label: 'QR Generator',
    desc: 'Buat QR dari link, teks, atau URL lalu atur warna, bentuk, dan logo.',
    badge: 'QR',
    note: 'Preview langsung',
    icon: 'QR'
  },
  {
    href: '/barcode',
    label: 'Barcode Generator',
    desc: 'Buat barcode dengan preview bersih lalu simpan hasil PNG.',
    badge: 'Barcode',
    note: 'Ekspor PNG',
    icon: 'BC'
  },
  {
    href: '/video',
    label: 'Video Tools',
    desc: 'Kompres video atau tingkatkan resolusi dari satu halaman yang ringkas.',
    badge: 'Video',
    note: 'Compress & HD',
    icon: 'VD'
  },
  {
    href: '/audio-extractor',
    label: 'Audio Extractor',
    desc: 'Ambil audio dari video dan simpan hasilnya dalam format MP3.',
    badge: 'Audio',
    note: 'Extract MP3',
    icon: 'AU'
  },
  {
    href: '/image-editor',
    label: 'Image Upscale & Compress',
    desc: 'Tingkatkan kualitas resolusi atau kompres ukuran gambar PNG/JPG.',
    badge: 'Image',
    note: 'Upscale & Compress',
    icon: 'IMG'
  },
  {
    href: '/remove-background',
    label: 'Remove Background',
    desc: 'Unggah gambar lalu unduh hasil transparan saat proses selesai.',
    badge: 'Image',
    note: 'Standard & HD',
    icon: 'BG'
  },
  {
    href: '/blur-face',
    label: 'Blur Face',
    desc: 'Deteksi wajah lalu blur otomatis untuk hasil yang lebih aman dibagikan.',
    badge: 'Privacy',
    note: 'Auto blur',
    icon: 'BF'
  },
  {
    href: '/image-info',
    label: 'Image Info',
    desc: 'Lihat detail gambar seperti ukuran, format, resolusi, author, dan metadata.',
    badge: 'Info',
    note: 'Metadata',
    icon: 'IF'
  },
  {
    href: '/convert',
    label: 'Convert Tools',
    desc: 'Konversi dokumen, gambar, dan PDF dalam satu tempat.',
    badge: 'Files',
    note: 'Multi tool',
    icon: 'CV'
  },
  {
    href: '/tiktok',
    label: 'TikTok Downloader',
    desc: 'Unduh video TikTok tanpa watermark menggunakan API resmi.',
    badge: 'Social',
    note: 'No Watermark',
    icon: 'TT'
  }
];

function ToolCard({ href, label, desc, badge, note, icon, index }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Link href={href} className="tool-index-card card-3d" ref={ref} style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="tool-index-top">
        <span className="tool-index-badge">
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: '22px',
            height: '22px',
            borderRadius: '6px',
            background: 'rgba(33, 84, 243, 0.12)',
            color: 'var(--primary)',
            fontSize: '0.7rem',
            fontWeight: '800',
            marginRight: '6px'
          }}>{icon}</span>
          {badge}
        </span>
        <span className="tool-index-note">{note}</span>
      </div>
      <h3 style={{ margin: 0 }}>{label}</h3>
      <p style={{ margin: 0 }}>{desc}</p>
      <span className="tool-index-link">Buka tool</span>
    </Link>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <div className="home-category-row stagger-children">
            <span className="home-category-chip" style={{ animationDelay: '0s' }}>QR & Barcode</span>
            <span className="home-category-chip" style={{ animationDelay: '0.05s' }}>Video</span>
            <span className="home-category-chip" style={{ animationDelay: '0.1s' }}>Audio</span>
            <span className="home-category-chip" style={{ animationDelay: '0.15s' }}>Images</span>
            <span className="home-category-chip" style={{ animationDelay: '0.2s' }}>Documents</span>
            <span className="home-category-chip" style={{ animationDelay: '0.25s' }}>PDF</span>
            <span className="home-category-chip" style={{ animationDelay: '0.3s' }}>Privacy</span>
            <span className="home-category-chip" style={{ animationDelay: '0.35s' }}>Social</span>
            <span className="home-category-chip" style={{ animationDelay: '0.4s' }}>Metadata</span>
          </div>
        </div>
      </section>

      <section className="section-block" id="tools">
        <div className="wrap">
          <div className="section-head compact compact-start">
            <div>
              <h2 className={mounted ? 'animate-gradient-text' : ''}>Semua tool</h2>
              <p>Pilih halaman yang ingin dipakai.</p>
            </div>
          </div>

          <div className="tool-index-grid stagger-children">
            {tools.map((tool, index) => (
              <ToolCard key={tool.href} index={index} {...tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-block home-steps-block">
        <div className="wrap">
          <div className="home-steps-panel">
            <div className="home-steps-copy">
              <span className="eyebrow eyebrow-soft animate-fade-in-up">Mulai cepat</span>
              <h2 className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Pilih tool, unggah file, lalu unduh hasilnya.</h2>
              <p className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Tampilan dibuat ringkas supaya fokus tetap ke proses dan hasil.</p>
            </div>
            <div className="mini-steps stagger-children">
              <div className="mini-step-card card-3d" style={{ animationDelay: '0.1s' }}>
                <strong>1</strong>
                <span>Pilih tool</span>
              </div>
              <div className="mini-step-card card-3d" style={{ animationDelay: '0.15s' }}>
                <strong>2</strong>
                <span>Unggah file</span>
              </div>
              <div className="mini-step-card card-3d" style={{ animationDelay: '0.2s' }}>
                <strong>3</strong>
                <span>Atur hasil</span>
              </div>
              <div className="mini-step-card card-3d" style={{ animationDelay: '0.25s' }}>
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
