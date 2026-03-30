"""
HAK CIPTA (c) 2026 FizzxDevv - Semua Hak Dilindungi Undang-Undang

Dengan ini diberikan izin, bebas biaya, kepada siapa pun yang mendapatkan 
salinan perangkat lunak ini, untuk menggunakan, menyalin, memodifikasi, 
dan mendistribusikan kode ini dengan syarat:

PEMBERITAHUAN HAK CIPTA DI ATAS DAN PERNYATAAN IZIN INI HARUS DISERTAKAN 
DALAM SETIAP SALINAN ATAU BAGIAN SUBSTANSIAL DARI PERANGKAT LUNAK INI.

PERANGKAT LUNAK INI DISEDIAKAN "APA ADANYA", TANPA JAMINAN APA PUN.
"""
#---
"""
==========================================================================
PEMBERITAHUAN HAK CIPTA DAN KREDIT KODE
==========================================================================
Proyek ini mengandung kode yang dikembangkan berdasarkan karya asli dari:
Nama Pencipta : FizzxDevv
IG : @fizzx.docx
Sumber/URL    : https://github.com/Fizxxc/Kograph-Toolss

Sesuai dengan UU No. 28 Tahun 2014 tentang Hak Cipta, kredit ini 
dicantumkan sebagai bentuk penghormatan terhadap Hak Moral Pencipta.

Dimodifikasi oleh : [Nama Kamu]
Tanggal Modifikasi: [Tanggal Hari Ini]
Tujuan            : [Sebutkan: Edukasi / Pengembangan Internal]
==========================================================================
#Notes : Selain Tujuan di atas tidak diperbolehkan untuk penggunaan komersial atau distribusi tanpa izin tertulis dari Pencipta Asli.
harap menghormati hak cipta dan memberikan kredit yang layak kepada pencipta asli sesuai dengan ketentuan hukum yang berlaku.
dan harap menghubungi nomor di samping (+62 889-9111-4939) untuk izin penggunaan lebih lanjut atau pertanyaan terkait hak cipta.
==========================================================================
"""






from io import BytesIO
from typing import List

import qrcode
from docx import Document
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse, PlainTextResponse, Response
from PIL import Image
from pypdf import PdfReader, PdfWriter
from reportlab.graphics import renderPM
from reportlab.graphics.barcode import createBarcodeDrawing

app = FastAPI(title="Kograph Tools API") 


@app.get("/api")
def root():
    return {"name": "Kograph Tools API", "status": "ok"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/qr")
async def generate_qr(
    data: str = Form(...),
    fill_color: str = Form("#111827"),
    back_color: str = Form("#ffffff")
):
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=2)
    qr.add_data(data)
    qr.make(fit=True)
    image = qr.make_image(fill_color=fill_color, back_color=back_color).convert("RGB")
    buf = BytesIO()
    image.save(buf, format="PNG")
    return Response(content=buf.getvalue(), media_type="image/png")


def _barcode_drawing(fmt: str, value: str):
    fmt = fmt.upper()
    mapping = {
        "CODE128": "Code128",
        "EAN13": "EAN13",
        "EAN8": "EAN8",
        "UPC": "UPCA",
        "ITF": "Standard39"
    }
    kind = mapping.get(fmt)
    if not kind:
        raise HTTPException(status_code=400, detail="Format barcode tidak valid")

    kwargs = {"value": value, "humanReadable": True}
    if kind in {"Code128", "Standard39"}:
        kwargs.update({"barHeight": 60, "barWidth": 1.2})
    return createBarcodeDrawing(kind, **kwargs)


@app.post("/api/barcode")
async def generate_barcode(
    value: str = Form(...),
    fmt: str = Form("CODE128")
):
    drawing = _barcode_drawing(fmt, value)
    png_data = renderPM.drawToString(drawing, fmt="PNG")
    return Response(content=png_data, media_type="image/png")


@app.post("/api/docx_to_text")
async def docx_to_text(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail="File harus .docx")

    data = await file.read()
    document = Document(BytesIO(data))
    text = "\n".join(paragraph.text for paragraph in document.paragraphs).strip()
    return PlainTextResponse(text)


@app.post("/api/image_to_pdf")
async def image_to_pdf(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="Tidak ada file")

    images = []
    for file in files:
        content = await file.read()
        image = Image.open(BytesIO(content)).convert("RGB")
        images.append(image)

    if not images:
        raise HTTPException(status_code=400, detail="Tidak ada gambar yang valid")

    output = BytesIO()
    first, *rest = images
    first.save(output, format="PDF", save_all=True, append_images=rest)
    return Response(content=output.getvalue(), media_type="application/pdf")


@app.post("/api/merge_pdf")
async def merge_pdf(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="Tidak ada file")

    writer = PdfWriter()
    for file in files:
        reader = PdfReader(BytesIO(await file.read()))
        for page in reader.pages:
            writer.add_page(page)

    output = BytesIO()
    writer.write(output)
    return Response(content=output.getvalue(), media_type="application/pdf")


@app.post("/api/pdf_to_text")
async def pdf_to_text(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File harus .pdf")

    reader = PdfReader(BytesIO(await file.read()))
    text_parts = []
    for page in reader.pages:
        text_parts.append(page.extract_text() or "")

    return PlainTextResponse("\n\n".join(text_parts).strip())


@app.exception_handler(Exception)
async def unhandled_exception_handler(_, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": str(exc) or "Terjadi kesalahan internal"})
