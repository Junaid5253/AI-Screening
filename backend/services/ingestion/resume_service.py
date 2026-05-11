from models.resume import Resume


def save_resume(db,filename,file_path,parsed_data,raw_text,user_id=None):

    resume = Resume(user_id=user_id,filename=filename,file_path=file_path,skills=parsed_data.get("skills",[]),
                    education=parsed_data.get("education",[]),
                    experience_years=parsed_data.get("experience_years",0),raw_text=raw_text)

    db.add(resume)

    db.commit()

    db.refresh(resume)

    return resume



def get_resume_by_id(db, resume_id):

    return db.query(Resume).filter(
        Resume.id == resume_id
    ).first()



def get_all_resumes(db, user_id=None):

    query = db.query(Resume)

    # future user isolation
    if user_id is not None:

        query = query.filter(
            Resume.user_id == user_id
        )

    return query.all()



def delete_resume(db, resume_id):

    resume = db.query(Resume).filter(
        Resume.id == resume_id
    ).first()

    if not resume:
        return None

    db.delete(resume)

    db.commit()

    return resume