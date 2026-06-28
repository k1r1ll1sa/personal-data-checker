import asyncio
import shutil
from datetime import datetime, timedelta

from cryptography.x509 import extensions
from starlette.exceptions import HTTPException
from typing import *
from fastapi import FastAPI, UploadFile, File
from pathlib import Path
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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


@app.get("/health")
async def health_check():
    """Проверка работоспособности API"""
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
