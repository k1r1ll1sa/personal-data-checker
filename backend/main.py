import asyncio
import shutil
from datetime import datetime, timedelta

from Analyzer.pdf_analyzer import PDFAnalyzer
from cryptography.x509 import extensions
from starlette.exceptions import HTTPException
from typing import *
from fastapi import FastAPI, UploadFile, File
from pathlib import Path
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

logging.getLogger('pdfminer').setLevel(logging.ERROR)
logging.getLogger('pdfplumber').setLevel(logging.ERROR)

app = FastAPI(title="Personal Data Checker API")
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

MAX_FILE_SIZE = 20 * 1024 * 1024
ALLOW_FILE_TYPE = [".pdf", ".docx"]
UPLOAD_DIR = Path("uploads")

delete_timers: Dict[str, asyncio.Task] = {}

class FileResponse(BaseModel):
    filename: str
    size: int
    upload_time: str
    message: str

class AnalysisResult(BaseModel):
    filename: str
    risk_level: str
    total_pages: int
    total_findings: int
    findings: Dict[str, list]
    analysis_time: str

class AnalyzeRequest(BaseModel):
    filename: str

async def delete_file_with_timer(filename: str, delay: int = 3600):
    """Удаление файла по таймеру"""
    await asyncio.sleep(delay)

    file_path = UPLOAD_DIR / filename
    if file_path.exists():
        file_path.unlink()
        print(f"Файл {filename} удалён")

    if filename in delete_timers:
        del delete_timers[filename]


def validate_file(file: UploadFile):
    """Валидация загруженного файла по типу и размеру"""
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOW_FILE_TYPE:
        raise HTTPException(
            status_code=400,
            detail="Недопустимый формат файла")

    file.file.seek(0,2)
    file_size = file.file.tell()
    file.file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Файл превышает максимальный допустим размер (20 Мб)")


@app.post("/upload", response_model=FileResponse)
async def upload_file(file: UploadFile = File(...)):
    """Загрузка файла на сервер"""
    try:
        validate_file(file)
        upload_time = datetime.now().strftime("%Y%m%d_%H%M%S")
        original_filename = Path(file.filename).stem
        extensions = Path(file.filename).suffix
        unique_filename = f"{upload_time}_{original_filename}{extensions}"

        file_path = UPLOAD_DIR / unique_filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        file_size = file_path.stat().st_size

        if unique_filename in delete_timers:
            delete_timers[unique_filename].cancel()

        delete_task = asyncio.create_task(delete_file_with_timer(unique_filename, 3600))
        delete_timers[unique_filename] = delete_task

        return FileResponse(
            filename=unique_filename,
            size=file_size,
            upload_time=datetime.now().isoformat(),
            message="Файл успешно загружен")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail={e})


@app.post("/analyze", response_model=AnalysisResult)
async def analyze_file(request: AnalyzeRequest):
    try:
        filename = request.filename
        file_path = UPLOAD_DIR / filename
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Файл не найден")

        file_type = file_path.suffix.lower()
        if file_type == '.pdf' or file_type == '.docx':
            analyzer = PDFAnalyzer(file_path)
        else:
            raise HTTPException(status_code=400, detail="Недопустимый формат файла")

        total_pages, findings, total_risk, risk_level = analyzer.analyze()
        total_findings = sum(len(matches) for matches in findings.values())

        print(f"Результат анализа файла {filename}:")
        print(f"Количество страниц: {total_pages}")
        print(f"Уровень риска: {risk_level}, {total_risk} очков")
        for pattern_type, matches in findings.items():
            if matches:
                print(f"\n{pattern_type.upper()}: {len(matches)} совпадений")
                for match in matches:
                    print(f"  Страница {match['page']}: {match['masked']}")

        return AnalysisResult(
            filename = filename,
            risk_level = risk_level,
            total_pages = total_pages,
            total_findings = total_findings,
            findings = findings,
            analysis_time = datetime.now().isoformat())

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")

@app.get("/health")
async def health_check():
    """Проверка работоспособности API"""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
