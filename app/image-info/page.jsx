'use client';

import { useState } from 'react';
import PageHero from '../../components/page-hero';

function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index += 1;
  }

  return `${size.toFixed(size >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function ImageInfoPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('Unggah gambar untuk melihat detailnya.');
  const [info, setInfo] = useState(null);

  const checkInfo = async () => {
    if (!file) {
      setStatus('Pilih gambar dulu.');
      return;
    }

    try {
      setStatus('Membaca detail gambar...');
      setInfo(null);

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/image_info', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Gagal membaca info gambar');
      }

      const data = await res.json();
      setInfo(data);
      setStatus('Detail gambar berhasil dibaca.');
    } catch (err) {
      setStatus(err.message || 'Terjadi kesalahan.');
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Image Info"
        title="Lihat detail gambar."
        description="Periksa format, ukuran, resolusi, mode warna, dan metadata dasar."
      />

      <section className="section-block">
        <div className="wrap">
          <div className="tool-card">
            <div className="tool-head">
              <div>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>Image Details</h2>
                <p className="tool-subcopy">
                  Tampilkan informasi file gambar secara ringkas dan mudah dibaca.
                </p>
              </div>
              <span className="tool-badge-soft">Metadata</span>
            </div>

            <div className="tool-split-grid">
              <div className="tool-panel">
                <div className="form-grid">
                  <label className="field-full">
                    <span className="label">Upload image</span>
                    <div className="filebox">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </label>
                </div>

                <div className="tool-info-grid">
                  <div className="mini-info-card">
                    <span>Nama file</span>
                    <strong>{file?.name || 'Belum ada file'}</strong>
                  </div>
                  <div className="mini-info-card">
                    <span>Ukuran file</span>
                    <strong>{file ? formatBytes(file.size) : '-'}</strong>
                  </div>
                  <div className="mini-info-card">
                    <span>Status</span>
                    <strong>{info ? 'Siap dibaca' : 'Menunggu file'}</strong>
                  </div>
                </div>

                <div className="row" style={{ marginTop: 18 }}>
                  <button className="btn" onClick={checkInfo}>Lihat Detail</button>
                </div>

                <p className="status" style={{ marginTop: 12 }}>{status}</p>
              </div>

              <div className="tool-panel">
                <div className="preview-card soft-preview-card">
                  <div className="row-between" style={{ marginBottom: 12 }}>
                    <h3 style={{ margin: 0 }}>Detail</h3>
                    <span className="tool-badge-soft">Info</span>
                  </div>

                  {info ? (
                    <div className="info-list-grid">
                      <div className="info-list-item">
                        <span>Filename</span>
                        <strong>{info.filename || '-'}</strong>
                      </div>
                      <div className="info-list-item">
                        <span>Format</span>
                        <strong>{info.format || '-'}</strong>
                      </div>
                      <div className="info-list-item">
                        <span>Mode</span>
                        <strong>{info.mode || '-'}</strong>
                      </div>
                      <div className="info-list-item">
                        <span>Width</span>
                        <strong>{info.width || '-'}</strong>
                      </div>
                      <div className="info-list-item">
                        <span>Height</span>
                        <strong>{info.height || '-'}</strong>
                      </div>
                      <div className="info-list-item">
                        <span>Size</span>
                        <strong>{formatBytes(info.size_bytes)}</strong>
                      </div>
                      <div className="info-list-item">
                        <span>Author</span>
                        <strong>{info.author || '-'}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="preview-stage compact-stage">
                      <span className="helper">Informasi gambar akan tampil di sini.</span>
                    </div>
                  )}

                  {info?.metadata && Object.keys(info.metadata).length > 0 ? (
                    <div className="meta-box">
                      <h4 style={{ marginTop: 0 }}>Metadata</h4>
                      <div className="meta-table">
                        {Object.entries(info.metadata).map(([key, value]) => (
                          <div className="meta-row" key={key}>
                            <span>{key}</span>
                            <strong>{String(value)}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}