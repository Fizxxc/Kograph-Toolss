'use client';

import { useEffect, useState } from 'react';
import PageHero from './page-hero';

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

export default function ImageEditorPage() {
  return (
    <>
      <PageHero
        eyebrow="Image Editor"
        title="Upscale atau kompres gambar PNG/JPG."
        description="Tingkatkan resolusi gambar atau kurangi ukuran file sesuai kebutuhan."
      />
      <section className="section-block">
        <div className="wrap">
          <ImageEditor />
        </div>
      </section>
    </>
  );
}

function ImageEditor() {
  const [tab, setTab] = useState('upscale');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('Pilih gambar untuk diproses.');
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');
  const [scale, setScale] = useState('2');
  const [quality, setQuality] = useState('70');
  const [maxWidth, setMaxWidth] = useState('0');

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const handleUpscale = async () => {
    if (!file) {
      setStatus('Pilih gambar terlebih dahulu.');
      return;
    }

    setProcessing(true);
    setStatus('Sedang meningkatkan resolusi...');
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('scale', scale);

      const res = await fetch('/api/upscale_image', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Gagal meng-upscale gambar');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setStatus(`Berhasil upscale ${scale}x. Gambar siap diunduh.`);
    } catch (err) {
      setStatus(err.message || 'Terjadi kesalahan saat upscale.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setStatus('Pilih gambar terlebih dahulu.');
      return;
    }

    setProcessing(true);
    setStatus('Sedang mengompres gambar...');
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', quality);
      formData.append('max_width', maxWidth);

      const res = await fetch('/api/compress_image', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Gagal mengompres gambar');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      const originalSize = formatBytes(file.size);
      const compressedSize = formatBytes(blob.size);
      setStatus(`Berhasil kompres. ${originalSize} → ${compressedSize}`);
    } catch (err) {
      setStatus(err.message || 'Terjadi kesalahan saat kompres.');
    } finally {
      setProcessing(false);
    }
  };

  const tabs = [
    { id: 'upscale', label: 'Upscale PNG/JPG' },
    { id: 'compress', label: 'Compress PNG/JPG' }
  ];

  return (
    <div className="tool-card">
      <div className="tool-head">
        <div>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Image Editor</h2>
          <p className="tool-subcopy">
            Tingkatkan kualitas resolusi atau kurangi ukuran file gambar.
          </p>
        </div>
        <span className="tool-badge-soft">Image</span>
      </div>

      <div className="tab-row clean-tab-row" style={{ marginBottom: 18 }}>
        {tabs.map((item) => (
          <button key={item.id} className={`segment ${tab === item.id ? 'active' : ''}`} onClick={() => { setTab(item.id); setOutputUrl(''); }}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="tool-split-grid">
        <div className="tool-panel">
          <div className="form-grid">
            <label className="field-full">
              <span className="label">Upload gambar (PNG/JPG)</span>
              <div className="filebox">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </label>

            {tab === 'upscale' ? (
              <label>
                <span className="label">Skala upscale</span>
                <select className="input" value={scale} onChange={(e) => setScale(e.target.value)}>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="4">4x</option>
                </select>
              </label>
            ) : (
              <>
                <label>
                  <span className="label">Kualitas (1-95)</span>
                  <select className="input" value={quality} onChange={(e) => setQuality(e.target.value)}>
                    <option value="50">50 - Ringan</option>
                    <option value="70">70 - Seimbang</option>
                    <option value="85">85 - Bagus</option>
                    <option value="95">95 - Maksimal</option>
                  </select>
                </label>
                <label>
                  <span className="label">Max width (px, 0 = original)</span>
                  <select className="input" value={maxWidth} onChange={(e) => setMaxWidth(e.target.value)}>
                    <option value="0">Original</option>
                    <option value="1920">1920 px</option>
                    <option value="1280">1280 px</option>
                    <option value="800">800 px</option>
                  </select>
                </label>
              </>
            )}
          </div>

          <div className="tool-info-grid">
            <div className="mini-info-card">
              <span>File</span>
              <strong>{file?.name || 'Belum ada file'}</strong>
            </div>
            <div className="mini-info-card">
              <span>Ukuran</span>
              <strong>{file ? formatBytes(file.size) : '-'}</strong>
            </div>
            <div className="mini-info-card">
              <span>Status</span>
              <strong>{processing ? 'Memproses...' : (outputUrl ? 'Selesai' : 'Menunggu')}</strong>
            </div>
          </div>

          <div className="row" style={{ marginTop: 18 }}>
            <button className="btn" onClick={tab === 'upscale' ? handleUpscale : handleCompress} disabled={processing}>
              {processing ? 'Memproses...' : tab === 'upscale' ? 'Mulai Upscale' : 'Mulai Compress'}
            </button>
          </div>

          <p className="status" style={{ marginTop: 12 }}>{status}</p>
        </div>

        <div className="tool-panel">
          <div className="preview-card soft-preview-card">
            <div className="row-between" style={{ marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Preview</h3>
              <span className="tool-badge-soft">{tab === 'upscale' ? 'Upscale' : 'Compress'}</span>
            </div>

            <div className="preview-stage checker-surface">
              {outputUrl ? (
                <img src={outputUrl} alt="Processed output" style={{ maxWidth: '100%', borderRadius: '12px' }} />
              ) : (
                <span className="helper">Hasil pemrosesan akan muncul di sini.</span>
              )}
            </div>

            {outputUrl ? (
              <div className="action-row preview-actions" style={{ marginTop: 14 }}>
                <a className="btn" href={outputUrl} download={tab === 'upscale' ? 'upscaled-image.png' : 'compressed-image.jpg'}>
                  Download {tab === 'upscale' ? 'PNG' : 'JPG'}
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
