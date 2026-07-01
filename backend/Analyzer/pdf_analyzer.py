import shutil
import subprocess
import tempfile

import pdfplumber
from typing import Tuple, Dict, List
from pathlib import Path
from .patterns import PATTERNS

class PDFAnalyzer:
    def __init__(self, file_path: Path):
        self.file_path = file_path


    def analyze(self) -> Tuple[int, Dict[str, List[Dict]], int, str]:
        if self.file_path.suffix == '.docx':
            file_path = self.convert_doc_to_pdf()
        else:
            file_path = self.file_path

        with pdfplumber.open(file_path) as file:
            findings = {pattern_name: [] for pattern_name in PATTERNS.keys()}
            total_pages = len(file.pages)
            total_risk: int = 0

            for page_num, page in enumerate(file.pages, start=1):
                text = page.extract_text()

                if not text:
                    continue


                for pattern_name, pattern in PATTERNS.items():
                    matches = pattern.findall(text)
                    for match in matches:
                        match pattern_name:
                            case 'email':
                                total_risk += 5
                            case 'phone':
                                total_risk += 5
                            case 'inn':
                                total_risk += 10
                            case 'snils':
                                total_risk += 10
                            case 'passport':
                                total_risk += 20
                            case 'card':
                                total_risk += 20
                        findings[pattern_name].append({
                            'page': page_num,
                            'value': match.strip(),
                            'masked': self.mask(match.strip())
                        })
            risk_level = 'безопасный' if total_risk == 0 \
                        else 'низкий' if total_risk <= 10 \
                        else 'средний' if total_risk <= 20 \
                        else 'высокий'

        return total_pages, findings, total_risk, risk_level

    def convert_doc_to_pdf(self):
        temp_dir = Path(tempfile.mkdtemp())
        temp_docx = temp_dir / "temp.docx"
        shutil.copy2(self.file_path, temp_docx)

        cmd = [
            'libreoffice',
            '--headless',
            '--convert-to', 'pdf',
            '--outdir', temp_dir,
            str(temp_docx)
        ]

        subprocess.run(cmd, check=True, capture_output=True)
        temp_pdf_path = temp_dir / "temp.pdf"

        return temp_pdf_path

    def mask(self, value: str) -> str:
        return f'{value[:1]}{'*' * (len(value) - 2)}{value[-1:]}'

