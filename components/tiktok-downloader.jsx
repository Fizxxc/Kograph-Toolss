'use client';

import { useState, useRef } from 'react';
import PageHero from './page-hero';

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

function TikTokDownloader() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('Tempel URL video TikTok untuk memulai.');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const urlRef = useRef(null);

  const handleDownload = async () => {
    if (!url.trim()) {
      setStatus('Masukkan URL TikTok terlebih dahulu.');
      return;
    }

    setProcessing(true);
    setStatus('Mengambil data video...');
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Gagal memproses URL');
      }

      const data = await res.json();
      setResult(data);
      setStatus('Video berhasil ditemukan. Silakan unduh.');
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memproses URL.');
      setStatus('Gagal mengambil data video.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="tool-card">
      <div className="tool-head">
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>TikTok Downloader</h2>
          <p className="tool-subcopy">
            Unduh video TikTok tanpa watermark. Cukup tempel URL dan tekan download.
          </p>
        </div>
        <span className="tool-badge-soft">No Watermark</span>
      </div>

      <div className="tool-split-grid">
        <div className="tool-panel">
          <div className="form-grid">
            <label className="field-full">
              <span className="label">URL TikTok</span>
              <div className="filebox">
                <input
                  ref={urlRef}
                  type="url"
                  placeholder="https://www.tiktok.com/@user/video/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                />
              </div>
            </label>
          </div>

          <div className="row" style={{ marginTop: 18 }}>
            <button className="btn" onClick={handleDownload} disabled={processing}>
              {processing ? 'Memproses...' : 'Download Video'}
            </button>
          </div>

          {error ? (
            <p className="status" style={{ marginTop: 12, color: '#d92d20' }}>{error}</p>
          ) : (
            <p className="status" style={{ marginTop: 12 }}>{status}</p>
          )}
        </div>

        <div className="tool-panel">
          <div className="preview-card soft-preview-card">
            <div className="row-between" style={{ marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Hasil</h3>
              {result && <span className="tool-badge-soft">Ready</span>}
            </div>

            {result ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {result.cover && (
                  <img
                    src={result.cover}
                    alt="Cover"
                    style={{
                      width: '100%',
                      maxHeight: '220px',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      border: '1px solid var(--line)'
                    }}
                  />
                )}
                <div className="info-list-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="info-list-item">
                    <span>Judul</span>
                    <strong>{result.title || 'Tanpa judul'}</strong>
                  </div>
                  <div className="info-list-item">
                    <span>Author</span>
                    <strong>{result.author || 'Unknown'}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a
                    className="btn"
                    href={result.video_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ flex: 1, minWidth: '140px', textAlign: 'center' }}
                  >
                    Download Video
                  </a>
                  {result.music_url && (
                    <a
                      className="btn-secondary"
                      href={result.music_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ flex: 1, minWidth: '140px', textAlign: 'center' }}
                    >
                      Download Audio
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="preview-stage compact-stage">
                <span className="helper">Hasil unduhan akan muncul di sini.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
