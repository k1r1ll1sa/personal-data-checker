import re

# 1234 567890 | 12 34 567890
PASSPORT_PATTERN = re.compile(r'\b\d{2}\s?\d{2}\s?\d{6}\b')
# 1234567890 | 123456789000
INN_PATTERN = re.compile(r'\b\d{10}\b|\b\d{12}\b')
# 123-456-789 00 | 123-456 789 00 | 123-45678900
SNILS_PATTERN = re.compile(r'\b\d{3}[-\s]\d{3}[-\s]\d{3}\s\d{2}\b')
# +7 123 456 7890 | +81234567890 | ...
PHONE_PATTERN = re.compile(r'(?:\+7|8|7)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}')
# abcd@mail.ru
EMAIL_PATTERN = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
# 1234 5678 9000 0000 | 1234567890000000 | 1234-5678-9000-0000
CARD_PATTERN = re.compile(r'\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b')

PATTERNS = {
    'passport': PASSPORT_PATTERN,
    'inn': INN_PATTERN,
    'snils': SNILS_PATTERN,
    'phone': PHONE_PATTERN,
    'email': EMAIL_PATTERN,
    'card': CARD_PATTERN,
}