from fastapi import APIRouter, UploadFile, File, HTTPException

from services.extractor import extract_text
from services.parser import parse_resume
from utils.file_handler import save_uploaded_file

router = APIRouter()


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...)
):

    try:

        # SAVE FILE
        file_path, content = await save_uploaded_file(file)

        # EXTRACT RAW TEXT
        extracted_text = extract_text(
            file_path=file_path,
            file_name=file.filename
        )

        # PARSE RESUME
        parsed_data = parse_resume(extracted_text)

        return {

            "success": True,

            "filename": file.filename,

            "size": len(content),

            "parsed_data": parsed_data,

            "preview_text": extracted_text[:1000]
        }

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )