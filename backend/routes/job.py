from fastapi import APIRouter
from services.job_parser import parse_job

router = APIRouter()


@router.post("/parse-job")
def parse_job_route(job_text: str):

    parsed = parse_job(job_text)

    return {

        "success": True,
        "parsed_job": parsed
    }