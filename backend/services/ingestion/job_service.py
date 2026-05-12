from models import Job


def save_job(

    db,

    title,

    description,

    parsed_job,

    user_id=None
):

    job = Job(

        user_id=user_id,

        title=title,

        description=description,

        required_skills=parsed_job.get(
            "required_skills",
            []
        ),

        experience_required=parsed_job.get(
            "experience_required",
            0
        ),

        context_terms=parsed_job.get(
            "context_terms",
            []
        )
    )

    db.add(job)

    db.commit()

    db.refresh(job)

    return job



def get_job_by_id(db, job_id):

    return db.query(Job).filter(
        Job.id == job_id
    ).first()



def get_all_jobs(db, user_id=None):

    query = db.query(Job)

    # future auth support
    if user_id is not None:

        query = query.filter(
            Job.user_id == user_id
        )

    return query.all()



def delete_job(db, job_id):

    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        return None

    db.delete(job)

    db.commit()

    return job