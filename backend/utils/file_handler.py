import os
import uuid

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


async def save_uploaded_file(file):

    file_id = str(uuid.uuid4())

    file_path = os.path.join(
        UPLOAD_DIR,
        file_id + "_" + file.filename
    )

    with open(file_path, "wb") as f:

        content = await file.read()

        f.write(content)

    return file_path, content