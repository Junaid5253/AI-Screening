from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

from services.auth.deps import get_current_user

from services.ingestion.job_service import (get_job_by_id)

from services.ingestion.resume_service import (get_all_resumes)

from services.ai.ranking import (rank_resumes)

router = APIRouter()


@router.get("/rank/{job_id}")
def rank_candidates(

    job_id: int,

    db: Session = Depends(get_db),

    current_user = Depends(get_current_user)
):

    job = get_job_by_id(db,job_id)

    if not job:

        return {
            "success": False,
            "error": "Job not found"
        }

    resumes = get_all_resumes(db,current_user.id)

    rankings = rank_resumes(job,resumes)

    return {

        "success": True,

        "job_title": job.title,

        "total_candidates": len(rankings),

        "rankings": rankings
    }