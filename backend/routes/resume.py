from fastapi import APIRouter, UploadFile, File

from services.extractor import extract_text
from utils.file_handler import save_uploaded_file

router = APIRouter()


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...)
):

    try:

        # SAVE FILE
        file_path, content = await save_uploaded_file(file)

        # EXTRACT TEXT
        extracted_text = extract_text(
            file_path,
            file.filename
        )

        return {

            "success": True,

            "filename": file.filename,

            "size": len(content),

            "saved_path": file_path,

            "extracted_text": extracted_text[:3000]
        }

    except Exception as e:

        return {
            "error": str(e)
        }