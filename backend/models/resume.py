from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey

from database import Base


class Resume(Base):

    __tablename__ = "resumes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        nullable=True
    )

    filename = Column(String)

    file_path = Column(String)

    skills = Column(JSON)

    education = Column(JSON)

    experience_years = Column(Integer)

    raw_text = Column(Text)