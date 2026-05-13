from models import Resume
from utils.file_handler import delete_uploaded_file


def save_resume(db, filename, file_path, parsed_data, raw_text, user_id=None, file_size=None):

    resume = Resume(user_id=user_id,filename=filename,file_path=file_path,file_size=file_size,skills=parsed_data.get("skills",[]),
                    education=parsed_data.get("education",[]),
                    experience_years=parsed_data.get("experience_years",0),raw_text=raw_text,
                    candidate_name=parsed_data.get("name"),candidate_email=parsed_data.get("email"),candidate_phone=parsed_data.get("phone"),
                    github=parsed_data.get("github"),linkedin=parsed_data.get("linkedin"),)

    db.add(resume)

    db.commit()

    db.refresh(resume)

    return resume



def get_resume_by_id(db,resume_id,user_id=None):

    query = db.query(Resume).filter(
        Resume.id == resume_id
    )

    if user_id is not None:

        query = query.filter(
            Resume.user_id == user_id
        )

    return query.first()


def get_all_resumes(db, user_id=None):

    query = db.query(Resume)

    # future user isolation
    if user_id is not None:

        query = query.filter(
            Resume.user_id == user_id
        )

    return query.all()



def delete_resume(db,resume_id,user_id=None):

    query = db.query(Resume).filter(
        Resume.id == resume_id
    )

    if user_id is not None:

        query = query.filter(
            Resume.user_id == user_id
        )

    resume = query.first()

    if not resume:
        return None

    file_path = resume.file_path

    db.delete(resume)

    db.commit()

    delete_uploaded_file(file_path)

    return resume