from database import Base

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    JSON,
    ForeignKey
)




class Resume(Base):

    __tablename__ = "resumes"

    # PRIMARY KEY
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    
    # OWNER (platform user)
    user_id = Column(
        Integer,
        
        ForeignKey("users.id")
    )

    # FILE INFO
    filename = Column(String)

    file_path = Column(String)

    raw_text = Column(Text)

    # CANDIDATE INFO
    candidate_name = Column(String)

    candidate_email = Column(String)

    candidate_phone = Column(String)

    github = Column(String)

    linkedin = Column(String)

    # PARSED ATS DATA
    skills = Column(JSON)

    education = Column(JSON)

    experience_years = Column(Integer)