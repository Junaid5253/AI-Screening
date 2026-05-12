from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from database import get_db

from models.resume import Resume

from utils.file_handler import save_uploaded_file

from utils.extractor import extract_text

from services.parsing.parser import parse_resume
from services.auth.deps import get_current_user

from services.ingestion.resume_service import (
    save_resume,
    get_all_resumes,
    delete_resume
)

router = APIRouter()


@router.post("/upload-resume")
async def upload_resume(

    file: UploadFile = File(...),

    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
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

            raw_text=extracted_text,

            user_id=current_user.id
        )

        return {

            "success": True,

            "resume_id": resume.id,

            "filename": resume.filename,

            "parsed_data": {

                "candidate_name": resume.candidate_name,

                "candidate_email": resume.candidate_email,

                "candidate_phone": resume.candidate_phone,

                "github": resume.github,

                "linkedin": resume.linkedin,

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

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)
):

    resumes = get_all_resumes(db, user_id=current_user.id)

    data = []

    for r in resumes:

        data.append({

            "id": r.id,

            "filename": r.filename,

            "candidate_name": r.candidate_name,

            "candidate_email": r.candidate_email,

            "candidate_phone": r.candidate_phone,

            "github": r.github,

            "linkedin": r.linkedin,

            "skills": r.skills,

            "education": r.education,

            "experience_years": r.experience_years
        })

    return {

        "success": True,

        "count": len(data),

        "resumes": data
    }


@router.delete("/resumes/{resume_id}")
def delete_resume_endpoint(

    resume_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)
):

    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        return {
            "success": False,
            "error": "Resume not found or not owned by user"
        }

    delete_resume(db, resume_id)

    return {
        "success": True,
        "message": "Resume deleted successfully"
    }