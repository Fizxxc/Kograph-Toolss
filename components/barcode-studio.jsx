'use client';

import { useEffect, useRef, useState } from 'react';

const formats = ['CODE128', 'EAN13', 'EAN8', 'UPC', 'ITF'];

export default function BarcodeStudio() {
  const canvasRef = useRef(null);
  const [value, setValue] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const [lineColor, setLineColor] = useState('#111827');
  const [background, setBackground] = useState('#ffffff');
  const [status, setStatus] = useState('Preview siap. Sesuaikan isi dan warna lalu simpan hasilnya.');

  useEffect(() => {
    async function draw() {
      if (!canvasRef.current) return;
      try {
        const { default: JsBarcode } = await import('jsbarcode');
        const safeValue = value || '123456789012';
        JsBarcode(canvasRef.current, safeValue, {
          format,
          lineColor,
          background,
          width: 2,
          height: 110,
          displayValue: true,
          margin: 12,
          fontOptions: 'bold'
        });
        setStatus('Preview berhasil diperbarui.');
      } catch {
        setStatus('Format tidak cocok dengan isi barcode. Coba ganti format atau nilainya.');
      }
    }

    draw();
  }, [background, format, lineColor, value]);

  const downloadBarcode = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = 'kograph-barcode.png';
    link.click();
    setStatus('Barcode berhasil disimpan sebagai PNG.');
  };

  return (
    <div className="tool-panel">
      <div className="panel-head">
        <div>
          <h3>Barcode Generator</h3>
          <p>Masukkan kode, pilih format, sesuaikan warna, lalu simpan hasilnya.</p>
        </div>
        <span className="panel-badge">Real-time</span>
      </div>

      <div className="studio-grid compact-grid">
        <div className="studio-form">
          <div className="field-grid">
            <label className="field-full">
              <span className="field-label">Isi barcode</span>
              <input className="field-input" value={value} onChange={(e) => setValue(e.target.value)} placeholder="123456789012" />
            </label>
            <label>
              <span className="field-label">Format</span>
              <select className="field-input" value={format} onChange={(e) => setFormat(e.target.value)}>
                {formats.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="field-label">Warna garis</span>
              <input className="field-input color-input" type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} />
            </label>
            <label>
              <span className="field-label">Background</span>
              <input className="field-input color-input" type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
            </label>
          </div>

          <div className="action-row">
            <button className="button primary" onClick={downloadBarcode}>Download PNG</button>
          </div>
          <p className="status-line">{status}</p>
        </div>

        <aside className="preview-panel">
          <div className="preview-head">
            <h4>Preview</h4>
            <span className="preview-pill">PNG</span>
          </div>
          <div className="preview-surface bright-surface min-preview-compact">
            <canvas ref={canvasRef} />
          </div>
        </aside>
      </div>
    </div>
  );
}
