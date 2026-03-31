'use client';

import { useEffect, useState } from 'react';
import PageHero from '../../components/page-hero';

function formatFileSize(bytes) {
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

export default function AudioExtractorPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('Unggah video untuk mengambil audionya.');
  const [processing, setProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [audioName, setAudioName] = useState('kograph-audio.mp3');

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const runExtract = async () => {
    if (!file) {
      setStatus('Pilih file video dulu.');
      return;
    }

    try {
      setProcessing(true);
      setStatus('Sedang mengekstrak audio dari video...');
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl('');
      }

      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/audio_extractor', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Gagal mengekstrak audio');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const cleanName = (file.name || 'audio')
        .replace(/\.[^/.]+$/, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();

      setAudioName(`${cleanName || 'kograph-audio'}.mp3`);
      setAudioUrl(url);
      setStatus('Audio berhasil diekstrak. Silakan preview atau unduh hasilnya.');
    } catch (err) {
      setStatus(err.message || 'Terjadi kesalahan saat mengekstrak audio.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Audio Extractor"
        title="Ambil audio dari video."
        description="Unggah video lalu simpan hasil audionya dalam format MP3."
      />

      <section className="section-block">
        <div className="wrap">
          <div className="tool-card">
            <div className="tool-head">
              <div>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>Extract Audio</h2>
                <p className="tool-subcopy">
                  Cocok untuk mengambil suara dari video dengan alur yang ringkas.
                </p>
              </div>
              <span className="tool-badge-soft">MP3 Output</span>
            </div>

            <div className="tool-split-grid">
              <div className="tool-panel">
                <div className="form-grid">
                  <label className="field-full">
                    <span className="label">Upload video</span>
                    <div className="filebox">
                      <input
                        type="file"
                        accept="video/mp4,video/quicktime,video/x-matroska,video/webm,video/x-msvideo"
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
                    <span>Ukuran</span>
                    <strong>{file ? formatFileSize(file.size) : '-'}</strong>
                  </div>
                  <div className="mini-info-card">
                    <span>Output</span>
                    <strong>MP3</strong>
                  </div>
                </div>

                <div className="row" style={{ marginTop: 18 }}>
                  <button className="btn" onClick={runExtract} disabled={processing}>
                    {processing ? 'Memproses...' : 'Extract Audio'}
                  </button>
                </div>

                <p className="status" style={{ marginTop: 12 }}>{status}</p>
              </div>

              <div className="tool-panel">
                <div className="preview-card soft-preview-card">
                  <div className="row-between" style={{ marginBottom: 12 }}>
                    <h3 style={{ margin: 0 }}>Preview Audio</h3>
                    <span className="tool-badge-soft">Ready</span>
                  </div>

                  <div className="preview-stage compact-stage">
                    {audioUrl ? (
                      <div className="audio-preview-stack">
                        <audio controls src={audioUrl} style={{ width: '100%' }} />
                        <a className="btn-secondary full-width-mobile" href={audioUrl} download={audioName}>
                          Download MP3
                        </a>
                      </div>
                    ) : (
                      <span className="helper">Hasil audio akan tampil di sini setelah proses selesai.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}