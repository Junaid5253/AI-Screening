from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

from models.job_request import JobCreateRequest

from services.parsing.job_parser import parse_job

from services.ingestion.job_service import (

    save_job,

    get_all_jobs
)

router = APIRouter()


@router.post("/create-job")
def create_job(

    payload: JobCreateRequest,

    db: Session = Depends(get_db)
):

    try:

        title = payload.title

        description = payload.description
        

        # PARSE JOB
        parsed_job = parse_job(description)

        # SAVE TO DB
        job = save_job(

            db=db,

            title=title,

            description=description,

            parsed_job=parsed_job
        )

        return {

            "success": True,

            "job_id": job.id,

            "title": job.title,

            "parsed_job": {

                "required_skills": job.required_skills,

                "experience_required": job.experience_required,

                "context_terms": job.context_terms
            }
        }

    except Exception as e:

        return {

            "success": False,

            "error": str(e)
        }



@router.get("/jobs")
def fetch_jobs(

    db: Session = Depends(get_db)
):

    jobs = get_all_jobs(db)

    data = []

    for j in jobs:

        data.append({

            "id": j.id,

            "title": j.title,

            "required_skills": j.required_skills,

            "experience_required": j.experience_required,

            "context_terms": j.context_terms
        })

    return {

        "success": True,

        "count": len(data),

        "jobs": data
    }