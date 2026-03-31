from io import BytesIO
from typing import List, Optional
import os
import tempfile
import uuid

import qrcode
import numpy as np

from docx import Document
from fastapi import BackgroundTasks, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse, Response
from PIL import Image, PngImagePlugin, ExifTags, UnidentifiedImageError
from pypdf import PdfReader, PdfWriter
from reportlab.graphics import renderPM
from reportlab.graphics.barcode import createBarcodeDrawing

# Optional imports with safer fallbacks
try:
    import cv2
except Exception:
    cv2 = None

try:
    from moviepy import VideoFileClip
except Exception:
    try:
        from moviepy.editor import VideoFileClip
    except Exception:
        VideoFileClip = None


AUTHOR_NAME = "FizzxDevv"
APP_TITLE = "Kograph Tools API"

ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".mov",
    ".mkv",
    ".webm",
    ".avi",
    ".m4v"
}

ALLOWED_IMAGE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".bmp"
}

MAX_FILE_SIZE_MB = 200
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

app = FastAPI(title=APP_TITLE)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Helpers
# =========================================================

def file_ext(filename: Optional[str]) -> str:
    return os.path.splitext((filename or "").lower())[1]


def safe_remove(*paths: str) -> None:
    for path in paths:
        try:
            if path and os.path.exists(path):
                os.remove(path)
        except Exception:
            pass


async def read_upload_bytes(file: UploadFile) -> bytes:
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="File kosong")
    if len(data) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Ukuran file terlalu besar. Maksimal {MAX_FILE_SIZE_MB} MB"
        )
    return data


def png_response_with_author(image: Image.Image) -> Response:
    buf = BytesIO()
    pnginfo = PngImagePlugin.PngInfo()
    pnginfo.add_text("Author", AUTHOR_NAME)
    pnginfo.add_text("Software", "Kograph Tools")
    pnginfo.add_text("Copyright", f"(c) 2026 {AUTHOR_NAME}")
    image.save(buf, format="PNG", pnginfo=pnginfo)
    return Response(content=buf.getvalue(), media_type="image/png")


def parse_image(content: bytes) -> Image.Image:
    try:
        img = Image.open(BytesIO(content))
        img.load()
        return img
    except UnidentifiedImageError:
        raise HTTPException(status_code=400, detail="File gambar tidak valid")
    except Exception:
        raise HTTPException(status_code=400, detail="Gagal membaca file gambar")


def validate_video_filename(filename: str) -> None:
    ext = file_ext(filename)
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Format video tidak didukung"
        )


def validate_image_filename(filename: str) -> None:
    ext = file_ext(filename)
    if ext and ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Format gambar tidak didukung"
        )


def get_barcode_drawing(fmt: str, value: str):
    normalized = (fmt or "").upper().strip()

    mapping = {
        "CODE128": "Code128",
        "EAN13": "EAN13",
        "EAN8": "EAN8",
        "UPC": "UPCA",
        "ITF": "Standard39",
    }

    kind = mapping.get(normalized)
    if not kind:
        raise HTTPException(status_code=400, detail="Format barcode tidak valid")

    if normalized == "EAN13" and (not value.isdigit() or len(value) not in {12, 13}):
        raise HTTPException(status_code=400, detail="EAN13 harus 12 atau 13 digit angka")

    if normalized == "EAN8" and (not value.isdigit() or len(value) not in {7, 8}):
        raise HTTPException(status_code=400, detail="EAN8 harus 7 atau 8 digit angka")

    if normalized == "UPC" and (not value.isdigit() or len(value) not in {11, 12}):
        raise HTTPException(status_code=400, detail="UPC harus 11 atau 12 digit angka")

    kwargs = {
        "value": value,
        "humanReadable": True,
    }

    if kind in {"Code128", "Standard39"}:
        kwargs.update({"barHeight": 60, "barWidth": 1.2})

    try:
        return createBarcodeDrawing(kind, **kwargs)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Gagal membuat barcode: {str(exc)}")


def blur_faces_in_image(content: bytes, blur_strength: int) -> Image.Image:
    if cv2 is None:
        raise HTTPException(
            status_code=500,
            detail="Fitur blur face belum tersedia. Dependensi OpenCV belum terpasang"
        )

    np_arr = np.frombuffer(content, np.uint8)
    frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if frame is None:
        raise HTTPException(status_code=400, detail="File gambar tidak valid")

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(cascade_path)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(40, 40)
    )

    if len(faces) == 0:
        raise HTTPException(status_code=404, detail="Wajah tidak ditemukan")

    if blur_strength % 2 == 0:
        blur_strength += 1
    blur_strength = max(15, min(blur_strength, 151))

    for (x, y, w, h) in faces:
        roi = frame[y:y + h, x:x + w]
        blurred = cv2.GaussianBlur(roi, (blur_strength, blur_strength), 0)
        frame[y:y + h, x:x + w] = blurred

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    return Image.fromarray(rgb)


# =========================================================
# Basic routes
# =========================================================

@app.get("/api")
def root():
    return {
        "name": APP_TITLE,
        "status": "ok",
        "author": AUTHOR_NAME
    }


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": APP_TITLE
    }


# =========================================================
# QR
# =========================================================

@app.post("/api/qr")
async def generate_qr(
    data: str = Form(...),
    fill_color: str = Form("#111827"),
    back_color: str = Form("#ffffff")
):
    if not data.strip():
        raise HTTPException(status_code=400, detail="Data QR tidak boleh kosong")

    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2
    )
    qr.add_data(data)
    qr.make(fit=True)

    image = qr.make_image(
        fill_color=fill_color,
        back_color=back_color
    ).convert("RGB")

    return png_response_with_author(image)


# =========================================================
# Barcode
# =========================================================

@app.post("/api/barcode")
async def generate_barcode(
    value: str = Form(...),
    fmt: str = Form("CODE128")
):
    if not value.strip():
        raise HTTPException(status_code=400, detail="Value barcode tidak boleh kosong")

    drawing = get_barcode_drawing(fmt, value)
    png_data = renderPM.drawToString(drawing, fmt="PNG")
    image = Image.open(BytesIO(png_data)).convert("RGBA")
    return png_response_with_author(image)


# =========================================================
# DOCX / PDF
# =========================================================

@app.post("/api/docx_to_text")
async def docx_to_text(file: UploadFile = File(...)):
    if file_ext(file.filename) != ".docx":
        raise HTTPException(status_code=400, detail="File harus .docx")

    data = await read_upload_bytes(file)

    try:
        document = Document(BytesIO(data))
        text = "\n".join(p.text for p in document.paragraphs).strip()
        return PlainTextResponse(text)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Gagal membaca file DOCX: {str(exc)}")


@app.post("/api/image_to_pdf")
async def image_to_pdf(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="Tidak ada file")

    images: List[Image.Image] = []

    for file in files:
        validate_image_filename(file.filename or "")
        content = await read_upload_bytes(file)
        image = parse_image(content).convert("RGB")
        images.append(image)

    if not images:
        raise HTTPException(status_code=400, detail="Tidak ada gambar yang valid")

    output = BytesIO()
    first, *rest = images
    first.save(output, format="PDF", save_all=True, append_images=rest)

    return Response(
        content=output.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="images-to-pdf.pdf"'}
    )


@app.post("/api/merge_pdf")
async def merge_pdf(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="Tidak ada file")

    writer = PdfWriter()

    try:
        for file in files:
            if file_ext(file.filename) != ".pdf":
                raise HTTPException(status_code=400, detail="Semua file harus PDF")

            data = await read_upload_bytes(file)
            reader = PdfReader(BytesIO(data))

            for page in reader.pages:
                writer.add_page(page)

        output = BytesIO()
        writer.write(output)

        return Response(
            content=output.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="merged-document.pdf"'}
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Gagal merge PDF: {str(exc)}")


@app.post("/api/pdf_to_text")
async def pdf_to_text(file: UploadFile = File(...)):
    if file_ext(file.filename) != ".pdf":
        raise HTTPException(status_code=400, detail="File harus .pdf")

    data = await read_upload_bytes(file)

    try:
        reader = PdfReader(BytesIO(data))
        text_parts = []

        for page in reader.pages:
            text_parts.append(page.extract_text() or "")

        return PlainTextResponse("\n\n".join(text_parts).strip())
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Gagal membaca PDF: {str(exc)}")


# =========================================================
# Image info
# =========================================================

@app.post("/api/image_info")
async def image_info(file: UploadFile = File(...)):
    validate_image_filename(file.filename or "")
    content = await read_upload_bytes(file)
    image = parse_image(content)

    exif_data = {}
    try:
        exif = image.getexif()
        if exif:
            tag_map = ExifTags.TAGS
            for tag_id, value in exif.items():
                tag_name = tag_map.get(tag_id, str(tag_id))
                exif_data[str(tag_name)] = str(value)
    except Exception:
        exif_data = {}

    return {
        "filename": file.filename,
        "format": image.format,
        "mode": image.mode,
        "width": image.width,
        "height": image.height,
        "size_bytes": len(content),
        "author": AUTHOR_NAME,
        "metadata": exif_data
    }


# =========================================================
# Blur face
# =========================================================

@app.post("/api/blur_face")
async def blur_face(
    file: UploadFile = File(...),
    blur_strength: int = Form(51)
):
    validate_image_filename(file.filename or "")
    content = await read_upload_bytes(file)
    result_image = blur_faces_in_image(content, blur_strength)
    return png_response_with_author(result_image)


# =========================================================
# Audio Extractor
# =========================================================

@app.post("/api/audio_extractor")
async def audio_extractor(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    if VideoFileClip is None:
        raise HTTPException(
            status_code=500,
            detail="Fitur audio extractor belum tersedia. Dependensi moviepy belum terpasang"
        )

    validate_video_filename(file.filename or "")
    data = await read_upload_bytes(file)

    temp_dir = tempfile.gettempdir()
    input_ext = file_ext(file.filename or "") or ".mp4"
    input_path = os.path.join(temp_dir, f"{uuid.uuid4()}{input_ext}")
    output_path = os.path.join(temp_dir, f"{uuid.uuid4()}.mp3")

    clip = None
    try:
        with open(input_path, "wb") as f:
            f.write(data)

        clip = VideoFileClip(input_path)

        if clip.audio is None:
            raise HTTPException(status_code=400, detail="Video tidak memiliki audio")

        clip.audio.write_audiofile(output_path, logger=None)

        background_tasks.add_task(safe_remove, input_path, output_path)

        return FileResponse(
            output_path,
            media_type="audio/mpeg",
            filename="kograph-audio.mp3"
        )
    except HTTPException:
        if clip is not None:
            try:
                clip.close()
            except Exception:
                pass
        safe_remove(input_path, output_path)
        raise
    except Exception as exc:
        if clip is not None:
            try:
                clip.close()
            except Exception:
                pass
        safe_remove(input_path, output_path)
        raise HTTPException(
            status_code=500,
            detail=f"Gagal mengekstrak audio: {str(exc)}"
        )
    finally:
        if clip is not None:
            try:
                clip.close()
            except Exception:
                pass


# =========================================================
# Global exception
# =========================================================

@app.exception_handler(Exception)
async def unhandled_exception_handler(_, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc) or "Terjadi kesalahan internal"}
    )