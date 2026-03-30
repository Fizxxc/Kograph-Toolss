'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const dotTypes = ['square', 'dots', 'rounded', 'classy', 'classy-rounded', 'extra-rounded'];
const cornerSquareTypes = ['square', 'extra-rounded', 'dot'];
const cornerDotTypes = ['square', 'dot'];

export default function QrStudio() {
  const mountRef = useRef(null);
  const qrRef = useRef(null);
  const [value, setValue] = useState('https://example.com');
  const [foreground, setForeground] = useState('#111827');
  const [background, setBackground] = useState('#ffffff');
  const [dotType, setDotType] = useState('rounded');
  const [cornerSquareType, setCornerSquareType] = useState('extra-rounded');
  const [cornerDotType, setCornerDotType] = useState('dot');
  const [logo, setLogo] = useState('');
  const [status, setStatus] = useState('Preview siap. Atur isi, warna, bentuk, atau logo sesuai kebutuhan.');

  const options = useMemo(
    () => ({
      width: 300,
      height: 300,
      data: value || ' ',
      image: logo || undefined,
      qrOptions: {
        errorCorrectionLevel: 'H',
        margin: 1
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 8,
        imageSize: 0.24,
        hideBackgroundDots: true
      },
      dotsOptions: {
        color: foreground,
        type: dotType
      },
      cornersSquareOptions: {
        color: foreground,
        type: cornerSquareType
      },
      cornersDotOptions: {
        color: foreground,
        type: cornerDotType
      },
      backgroundOptions: {
        color: background
      }
    }),
    [background, cornerDotType, cornerSquareType, dotType, foreground, logo, value]
  );

  useEffect(() => {
    let active = true;

    async function loadQr() {
      const { default: QRCodeStyling } = await import('qr-code-styling');
      if (!active) return;

      if (!qrRef.current) {
        qrRef.current = new QRCodeStyling(options);
        if (mountRef.current) {
          mountRef.current.innerHTML = '';
          qrRef.current.append(mountRef.current);
        }
      } else {
        qrRef.current.update(options);
      }
    }

    loadQr().catch(() => {
      setStatus('Preview belum berhasil dimuat. Coba refresh halaman lalu ulangi.');
    });

    return () => {
      active = false;
    };
  }, [options]);

  const onLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(String(reader.result || ''));
      setStatus(`Logo ${file.name} sudah dipasang di tengah.`);
    };
    reader.readAsDataURL(file);
  };

  const downloadQr = async () => {
    if (!qrRef.current) return;
    try {
      await qrRef.current.download({ name: 'kograph-qr', extension: 'png' });
      setStatus('File PNG berhasil disimpan.');
    } catch {
      setStatus('Belum bisa mengunduh hasil. Pastikan preview sudah muncul lalu coba lagi.');
    }
  };

  const resetAll = () => {
    setValue('https://example.com');
    setForeground('#111827');
    setBackground('#ffffff');
    setDotType('rounded');
    setCornerSquareType('extra-rounded');
    setCornerDotType('dot');
    setLogo('');
    setStatus('Pengaturan dikembalikan ke tampilan awal.');
  };

  return (
    <div className="tool-panel">
      <div className="panel-head">
        <div>
          <h3>QR Generator</h3>
          <p>Masukkan link atau teks, sesuaikan tampilan, lalu simpan hasil PNG.</p>
        </div>
        <span className="panel-badge">Live preview</span>
      </div>

      <div className="studio-grid">
        <div className="studio-form">
          <div className="field-grid">
            <label className="field-full">
              <span className="field-label">Link atau teks</span>
              <input className="field-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://domainanda.com" />
            </label>

            <label>
              <span className="field-label">Warna utama</span>
              <input className="field-input color-input" type="color" value={foreground} onChange={(e) => setForeground(e.target.value)} />
            </label>

            <label>
              <span className="field-label">Background</span>
              <input className="field-input color-input" type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
            </label>

            <label>
              <span className="field-label">Bentuk titik</span>
              <select className="field-input" value={dotType} onChange={(e) => setDotType(e.target.value)}>
                {dotTypes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="field-label">Sudut kotak</span>
              <select className="field-input" value={cornerSquareType} onChange={(e) => setCornerSquareType(e.target.value)}>
                {cornerSquareTypes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="field-label">Titik sudut</span>
              <select className="field-input" value={cornerDotType} onChange={(e) => setCornerDotType(e.target.value)}>
                {cornerDotTypes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              <span className="field-label">Logo tengah</span>
              <div className="upload-box compact-upload">
                <input type="file" accept="image/*" onChange={onLogoChange} />
              </div>
            </label>
          </div>

          <div className="action-row">
            <button className="button primary" onClick={downloadQr}>Download PNG</button>
            <button className="button secondary" onClick={resetAll}>Reset</button>
          </div>
          <p className="status-line">{status}</p>
        </div>

        <aside className="preview-panel slim-preview">
          <div className="preview-head">
            <h4>Preview</h4>
            <span className="preview-pill">PNG</span>
          </div>
          <div className="preview-surface bright-surface">
            <div ref={mountRef} />
          </div>
        </aside>
      </div>
    </div>
  );
}
