'use client';

import { useEffect, useMemo, useState } from 'react';

const MAX_IMAGE_MB = 12;
const FUN_MESSAGES = [
  'Lagi nyapu background yang bandel.',
  'Sedang milih tepi paling rapi.',
  'Objek utama lagi diamankan dulu.',
  'Sebentar ya, pinggiran gambar sedang dipoles.',
  'Masih jalan, kopi belum tumpah kok.'
];

function formatSize(bytes) {
  if (!bytes) return '0 MB';
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BackgroundLab() {
  const [ready, setReady] = useState(false);
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('standard');
  const [status, setStatus] = useState('Unggah gambar lalu pilih mode yang diinginkan.');
  const [outputUrl, setOutputUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [funText, setFunText] = useState('');

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  useEffect(() => {
    if (!processing) {
      setFunText('');
      return;
    }

    let index = 0;
    setFunText(FUN_MESSAGES[0]);
    const timer = window.setInterval(() => {
      index = (index + 1) % FUN_MESSAGES.length;
      setFunText(FUN_MESSAGES[index]);
    }, 2100);

    return () => window.clearInterval(timer);
  }, [processing]);

  const fileNotes = useMemo(() => {
    if (!file) return 'Belum ada file dipilih.';
    return `${file.name} • ${formatSize(file.size)}`;
  }, [file]);

  const runRemoval = async () => {
    if (!file) {
      setStatus('Pilih gambar terlebih dahulu.');
      return;
    }

    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setStatus(`Ukuran file terlalu besar. Gunakan file sekitar ${MAX_IMAGE_MB} MB atau kurang untuk hasil yang lebih stabil.`);
      return;
    }

    setProcessing(true);
    setProgressText('');
    setStatus('Menyiapkan proses...');
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl('');

    try {
      const { preload, removeBackground } = await import('@imgly/background-removal');
      const config = {
        model: mode === 'hd' ? 'medium' : 'small',
        progress: (phase, current, total) => {
          if (typeof current === 'number' && typeof total === 'number' && total > 0) {
            const pct = Math.round((current / total) * 100);
            setProgressText(`${phase}: ${pct}%`);
          } else if (phase) {
            setProgressText(String(phase));
          }
        }
      };

      await preload(config);
      setStatus('Gambar sedang diproses.');
      const result = await removeBackground(file, config);
      const url = URL.createObjectURL(result);
      setOutputUrl(url);
      setProgressText('');
      setStatus('Selesai. Hasil transparan siap diunduh.');
    } catch (error) {
      setStatus(`Proses belum berhasil. ${error?.message || 'Coba refresh halaman atau gunakan gambar lain.'}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!ready) {
    return <div className="loading-card">Menyiapkan halaman remove background…</div>;
  }

  return (
    <div className="tool-panel">
      <div className="panel-head">
        <div>
          <h3>Remove Background</h3>
          <p>Unggah gambar, pilih mode, lalu simpan hasil transparan saat proses selesai.</p>
        </div>
        <span className="panel-badge">PNG output</span>
      </div>

      <div className="studio-grid">
        <div className="studio-form">
          <div className="field-grid">
            <label className="field-full">
              <span className="field-label">File gambar</span>
              <div className="upload-box">
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </label>

            <div className="field-full segmented-wrap">
              <button type="button" className={`segment ${mode === 'standard' ? 'active' : ''}`} onClick={() => setMode('standard')}>Standard</button>
              <button type="button" className={`segment ${mode === 'hd' ? 'active' : ''}`} onClick={() => setMode('hd')}>HD</button>
            </div>
          </div>

          <div className="info-card-stack">
            <div className="info-card"><strong>File</strong><span>{fileNotes}</span></div>
            <div className="info-card"><strong>Saran</strong><span>Pilih gambar dengan objek utama yang cukup jelas dari background.</span></div>
            <div className="info-card"><strong>Batas aman</strong><span>Hingga {MAX_IMAGE_MB} MB per file.</span></div>
          </div>

          <div className="action-row">
            <button className="button primary" onClick={runRemoval} disabled={processing}>{processing ? 'Memproses...' : 'Hapus background'}</button>
          </div>
          {progressText ? <p className="subtle-line">{progressText}</p> : null}
          {funText ? <p className="fun-line">{funText}</p> : null}
          <p className="status-line">{status}</p>
        </div>

        <aside className="preview-panel">
          <div className="preview-head">
            <h4>Preview</h4>
            <span className="preview-pill">Transparent PNG</span>
          </div>
          <div className="preview-surface checker-surface">
            {outputUrl ? <img src={outputUrl} alt="Background removed output" /> : <span className="empty-copy">Hasil transparan akan muncul di sini.</span>}
          </div>
          {outputUrl ? (
            <div className="action-row preview-actions">
              <a className="button primary" href={outputUrl} download="kograph-remove-bg.png">Download PNG</a>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
