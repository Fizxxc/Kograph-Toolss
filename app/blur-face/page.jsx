'use client';

import { useEffect, useState } from 'react';
import PageHero from '../../components/page-hero';

export default function BlurFacePage() {
  const [file, setFile] = useState(null);
  const [blurStrength, setBlurStrength] = useState(51);
  const [status, setStatus] = useState('Unggah gambar lalu blur wajah secara otomatis.');
  const [outputUrl, setOutputUrl] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  const runBlur = async () => {
    if (!file) {
      setStatus('Pilih gambar dulu.');
      return;
    }

    try {
      setProcessing(true);
      setStatus('Sedang mendeteksi wajah lalu mengaburkannya...');
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
        setOutputUrl('');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('blur_strength', String(blurStrength));

      const res = await fetch('/api/blur_face', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Gagal blur wajah');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setStatus('Wajah berhasil di-blur. Silakan preview dan unduh hasilnya.');
    } catch (err) {
      setStatus(err.message || 'Terjadi kesalahan.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Blur Face"
        title="Blur wajah otomatis."
        description="Unggah gambar lalu sistem akan mendeteksi dan mengaburkan wajah."
      />

      <section className="section-block">
        <div className="wrap">
          <div className="tool-card">
            <div className="tool-head">
              <div>
                <h2 style={{ marginTop: 0, marginBottom: 8 }}>Face Blur</h2>
                <p className="tool-subcopy">
                  Cocok untuk menyamarkan wajah sebelum gambar dibagikan.
                </p>
              </div>
              <span className="tool-badge-soft">PNG Output</span>
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

                  <label className="field">
                    <span className="label">Blur strength</span>
                    <input
                      className="input"
                      type="number"
                      min="15"
                      max="151"
                      step="2"
                      value={blurStrength}
                      onChange={(e) => setBlurStrength(Number(e.target.value))}
                    />
                  </label>
                </div>

                <div className="tool-info-grid">
                  <div className="mini-info-card">
                    <span>Nama file</span>
                    <strong>{file?.name || 'Belum ada file'}</strong>
                  </div>
                  <div className="mini-info-card">
                    <span>Kekuatan blur</span>
                    <strong>{blurStrength}</strong>
                  </div>
                  <div className="mini-info-card">
                    <span>Format output</span>
                    <strong>PNG</strong>
                  </div>
                </div>

                <div className="row" style={{ marginTop: 18 }}>
                  <button className="btn" onClick={runBlur} disabled={processing}>
                    {processing ? 'Memproses...' : 'Blur Face'}
                  </button>
                </div>

                <p className="status" style={{ marginTop: 12 }}>{status}</p>
              </div>

              <div className="tool-panel">
                <div className="preview-card soft-preview-card">
                  <div className="row-between" style={{ marginBottom: 12 }}>
                    <h3 style={{ margin: 0 }}>Preview</h3>
                    <span className="tool-badge-soft">Image Result</span>
                  </div>

                  <div className="preview-stage">
                    {outputUrl ? (
                      <img src={outputUrl} alt="Blur face output" />
                    ) : (
                      <span className="helper">Hasil blur akan muncul di sini.</span>
                    )}
                  </div>

                  {outputUrl ? (
                    <div className="row" style={{ marginTop: 16 }}>
                      <a className="btn-secondary full-width-mobile" href={outputUrl} download="blur-face-output.png">
                        Download PNG
                      </a>
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