import os
import uuid

UPLOAD_DIR = "uploads"

ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"]

MAX_FILE_SIZE = 5 * 1024 * 1024

os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_uploaded_file(file):

    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise Exception("Unsupported file type")

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise Exception("File size exceeds limit")

    file_id = str(uuid.uuid4())

    file_path = os.path.join(
        UPLOAD_DIR,
        file_id + "_" + file.filename
    )

    with open(file_path, "wb") as f:
        f.write(content)

    return file_path, content