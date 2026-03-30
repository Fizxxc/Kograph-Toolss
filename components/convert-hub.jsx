'use client';

import { useMemo, useState } from 'react';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 600);
}

export default function ConvertHub() {
  const [tab, setTab] = useState('docx');
  const [status, setStatus] = useState('Pilih mode yang ingin digunakan.');
  const [docxOutput, setDocxOutput] = useState('');
  const [docxFileName, setDocxFileName] = useState('converted');
  const [mergeCount, setMergeCount] = useState(0);

  const tabs = useMemo(
    () => [
      { id: 'docx', label: 'DOCX to HTML/TXT' },
      { id: 'images', label: 'Images to PDF' },
      { id: 'merge', label: 'Merge PDF' }
    ],
    []
  );

  const handleDocxConvert = async (event, mode) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      setDocxFileName(file.name.replace(/\.docx$/i, '') || 'converted');

      if (mode === 'html') {
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setDocxOutput(result.value);
        setStatus('Dokumen berhasil dikonversi ke HTML.');
      } else {
        const result = await mammoth.extractRawText({ arrayBuffer });
        setDocxOutput(result.value);
        setStatus('Dokumen berhasil diekstrak menjadi teks.');
      }
    } catch (error) {
      setStatus(`Konversi belum berhasil. ${error?.message || 'Periksa file lalu coba lagi.'}`);
    }
  };

  const downloadDocxOutput = (mode) => {
    if (!docxOutput) return;
    const type = mode === 'html' ? 'text/html' : 'text/plain';
    const ext = mode === 'html' ? 'html' : 'txt';
    const blob = new Blob([docxOutput], { type });
    downloadBlob(blob, `${docxFileName}.${ext}`);
  };

  const handleImagesToPdf = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const image = file.type === 'image/png' ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const pdfBytes = await pdfDoc.save();
      downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'images-to-pdf.pdf');
      setStatus(`PDF berhasil dibuat dari ${files.length} gambar.`);
    } catch (error) {
      setStatus(`Belum berhasil membuat PDF. ${error?.message || 'Coba lagi dengan file lain.'}`);
    }
  };

  const handleMergePdf = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      setMergeCount(files.length);
      downloadBlob(new Blob([mergedBytes], { type: 'application/pdf' }), 'merged-document.pdf');
      setStatus(`Berhasil menggabungkan ${files.length} file PDF.`);
    } catch (error) {
      setStatus(`Belum berhasil menggabungkan PDF. ${error?.message || 'Coba gunakan file lain.'}`);
    }
  };

  return (
    <div className="tool-panel">
      <div className="panel-head">
        <div>
          <h3>Convert Tools</h3>
          <p>Pilih jenis konversi, unggah file, lalu simpan hasilnya.</p>
        </div>
        <span className="panel-badge">Multi tools</span>
      </div>

      <div className="tab-row clean-tab-row">
        {tabs.map((item) => (
          <button key={item.id} className={`segment ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'docx' ? (
        <div className="studio-grid">
          <div className="studio-form">
            <div className="field-grid">
              <label>
                <span className="field-label">Convert to HTML</span>
                <div className="upload-box compact-upload">
                  <input type="file" accept=".docx" onChange={(e) => handleDocxConvert(e, 'html')} />
                </div>
              </label>
              <label>
                <span className="field-label">Convert to TXT</span>
                <div className="upload-box compact-upload">
                  <input type="file" accept=".docx" onChange={(e) => handleDocxConvert(e, 'txt')} />
                </div>
              </label>
            </div>

            <div className="action-row">
              <button className="button secondary" onClick={() => downloadDocxOutput('html')}>Download HTML</button>
              <button className="button secondary" onClick={() => downloadDocxOutput('txt')}>Download TXT</button>
            </div>
            <p className="status-line">{status}</p>
          </div>

          <aside className="preview-panel">
            <div className="preview-head">
              <h4>Preview</h4>
              <span className="preview-pill">Output</span>
            </div>
            <div className="preview-surface doc-preview-surface">
              {docxOutput ? <pre className="plain-preview">{docxOutput}</pre> : <span className="empty-copy">Hasil konversi akan muncul di sini.</span>}
            </div>
          </aside>
        </div>
      ) : null}

      {tab === 'images' ? (
        <div className="single-card-body">
          <div className="field-grid">
            <label className="field-full">
              <span className="field-label">Upload gambar</span>
              <div className="upload-box compact-upload">
                <input type="file" accept="image/png,image/jpeg" multiple onChange={handleImagesToPdf} />
              </div>
            </label>
          </div>
          <p className="subtle-line">Gunakan JPG atau PNG. Semua gambar akan dijadikan satu file PDF.</p>
          <p className="status-line">{status}</p>
        </div>
      ) : null}

      {tab === 'merge' ? (
        <div className="single-card-body">
          <div className="field-grid">
            <label className="field-full">
              <span className="field-label">Upload beberapa PDF</span>
              <div className="upload-box compact-upload">
                <input type="file" accept="application/pdf" multiple onChange={handleMergePdf} />
              </div>
            </label>
          </div>
          <p className="subtle-line">Jumlah file terakhir yang digabung: {mergeCount || 0} dokumen.</p>
          <p className="status-line">{status}</p>
        </div>
      ) : null}
    </div>
  );
}
