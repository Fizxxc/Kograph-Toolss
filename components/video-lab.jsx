'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_VIDEO_MB = 150;
const FUN_MESSAGES = [
  'Mesin lagi pemanasan, jangan ditinggal dulu.',
  'Sedang merapikan frame satu per satu.',
  'Video lagi dipoles biar tampil lebih manis.',
  'Sedikit lagi, pikselnya sedang antre rapi.',
  'Masih proses, jangan panik, semesta tetap aman.'
];

function prettyMb(bytes) {
  if (!bytes) return '0 MB';
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VideoLab() {
  const workerRef = useRef(null);
  const ffmpegRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('compress');
  const [preset, setPreset] = useState('balanced');
  const [targetWidth, setTargetWidth] = useState('1280');
  const [status, setStatus] = useState('Unggah video lalu pilih mode yang diinginkan.');
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');
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
      if (workerRef.current) window.clearInterval(workerRef.current);
      setFunText('');
      return;
    }

    let index = 0;
    setFunText(FUN_MESSAGES[0]);
    workerRef.current = window.setInterval(() => {
      index = (index + 1) % FUN_MESSAGES.length;
      setFunText(FUN_MESSAGES[index]);
    }, 2200);

    return () => {
      if (workerRef.current) window.clearInterval(workerRef.current);
    };
  }, [processing]);

  const ensureEngine = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;

    const [{ FFmpeg }, { fetchFile, toBlobURL }] = await Promise.all([
      import('@ffmpeg/ffmpeg'),
      import('@ffmpeg/util')
    ]);

    const ffmpeg = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
    });

    ffmpegRef.current = { ffmpeg, fetchFile };
    return ffmpegRef.current;
  };

  const getCompressArgs = (inputName, outputName) => {
    const map = {
      light: ['-i', inputName, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '31', '-c:a', 'aac', '-b:a', '96k', outputName],
      balanced: ['-i', inputName, '-c:v', 'libx264', '-preset', 'medium', '-crf', '27', '-c:a', 'aac', '-b:a', '128k', outputName],
      quality: ['-i', inputName, '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-c:a', 'aac', '-b:a', '160k', outputName]
    };
    return map[preset] || map.balanced;
  };

  const getUpscaleArgs = (inputName, outputName) => [
    '-i',
    inputName,
    '-vf',
    `scale='min(${targetWidth},iw*2)':-2:flags=lanczos`,
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    '20',
    '-c:a',
    'aac',
    '-b:a',
    '160k',
    outputName
  ];

  const runProcess = async () => {
    if (!file) {
      setStatus('Pilih file video terlebih dahulu.');
      return;
    }

    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setStatus(`Ukuran file terlalu besar. Gunakan file di bawah ${MAX_VIDEO_MB} MB untuk hasil yang lebih stabil.`);
      return;
    }

    setProcessing(true);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl('');

    try {
      setStatus('Menyiapkan proses...');
      const { ffmpeg, fetchFile } = await ensureEngine();
      const inputName = `input-${Date.now()}.mp4`;
      const outputName = `output-${Date.now()}.mp4`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      setStatus(mode === 'compress' ? 'Video sedang dikompres.' : 'Video sedang diproses ke ukuran yang dipilih.');

      const args = mode === 'compress' ? getCompressArgs(inputName, outputName) : getUpscaleArgs(inputName, outputName);
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([data.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setStatus('Selesai. Hasil sudah siap dipreview dan diunduh.');

      try { await ffmpeg.deleteFile(inputName); } catch {}
      try { await ffmpeg.deleteFile(outputName); } catch {}
    } catch (error) {
      setStatus(`Proses belum berhasil. ${error?.message || 'Coba gunakan file yang lebih kecil lalu ulangi.'}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!ready) {
    return <div className="loading-card">Menyiapkan halaman video…</div>;
  }

  return (
    <div className="tool-panel">
      <div className="panel-head">
        <div>
          <h3>Video Tools</h3>
          <p>Unggah video, pilih mode, lalu simpan hasil saat proses selesai.</p>
        </div>
        <span className="panel-badge">MP4 output</span>
      </div>

      <div className="studio-grid">
        <div className="studio-form">
          <div className="field-grid">
            <label className="field-full">
              <span className="field-label">File video</span>
              <div className="upload-box">
                <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </label>

            <div className="field-full segmented-wrap">
              <button type="button" className={`segment ${mode === 'compress' ? 'active' : ''}`} onClick={() => setMode('compress')}>Compress</button>
              <button type="button" className={`segment ${mode === 'upscale' ? 'active' : ''}`} onClick={() => setMode('upscale')}>Upscale HD</button>
            </div>

            {mode === 'compress' ? (
              <label>
                <span className="field-label">Preset</span>
                <select className="field-input" value={preset} onChange={(e) => setPreset(e.target.value)}>
                  <option value="light">Ukuran lebih kecil</option>
                  <option value="balanced">Seimbang</option>
                  <option value="quality">Kualitas lebih baik</option>
                </select>
              </label>
            ) : (
              <label>
                <span className="field-label">Target width</span>
                <select className="field-input" value={targetWidth} onChange={(e) => setTargetWidth(e.target.value)}>
                  <option value="1280">1280 px</option>
                  <option value="1920">1920 px</option>
                </select>
              </label>
            )}
          </div>

          <div className="info-card-stack">
            <div className="info-card"><strong>Ukuran file</strong><span>{file ? prettyMb(file.size) : 'Belum ada file dipilih'}</span></div>
            <div className="info-card"><strong>Batas aman</strong><span>Hingga {MAX_VIDEO_MB} MB per proses.</span></div>
            <div className="info-card"><strong>Saran</strong><span>Mode compress biasanya lebih cepat untuk file berukuran besar.</span></div>
          </div>

          <div className="action-row">
            <button className="button primary" onClick={runProcess} disabled={processing}>
              {processing ? 'Memproses...' : mode === 'compress' ? 'Mulai compress' : 'Mulai upscale'}
            </button>
          </div>
          {funText ? <p className="fun-line">{funText}</p> : null}
          <p className="status-line">{status}</p>
        </div>

        <aside className="preview-panel">
          <div className="preview-head">
            <h4>Preview</h4>
            <span className="preview-pill">Output</span>
          </div>
          <div className="preview-surface video-preview-surface">
            {outputUrl ? <video src={outputUrl} controls playsInline /> : <span className="empty-copy">Hasil video akan muncul di sini.</span>}
          </div>
          {outputUrl ? (
            <div className="action-row preview-actions">
              <a className="button primary" href={outputUrl} download="kograph-video-output.mp4">Download output</a>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
