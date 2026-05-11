from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from database import get_db

from utils.file_handler import save_uploaded_file

from services.utils.extractor import extract_text

from services.parsing.parser import parse_resume

from services.ingestion.resume_service import (
    save_resume,
    get_all_resumes
)

router = APIRouter()


@router.post("/upload-resume")
async def upload_resume(

    file: UploadFile = File(...),

    db: Session = Depends(get_db)
):

    try:

        # SAVE FILE
        file_path, content = await save_uploaded_file(file)

        # EXTRACT TEXT
        extracted_text = extract_text(
            file_path,
            file.filename
        )

        # PARSE RESUME
        parsed_data = parse_resume(extracted_text)

        # SAVE TO DB
        resume = save_resume(

            db=db,

            filename=file.filename,

            file_path=file_path,

            parsed_data=parsed_data,

            raw_text=extracted_text
        )

        return {

            "success": True,

            "resume_id": resume.id,

            "filename": resume.filename,

            "parsed_data": {

                "skills": resume.skills,

                "education": resume.education,

                "experience_years": resume.experience_years
            }
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }


@router.get("/resumes")
def fetch_resumes(

    db: Session = Depends(get_db)
):

    resumes = get_all_resumes(db)

    data = []

    for r in resumes:

        data.append({

            "id": r.id,

            "filename": r.filename,

            "skills": r.skills,

            "education": r.education,

            "experience_years": r.experience_years
        })

    return {

        "success": True,

        "count": len(data),

        "resumes": data
    }