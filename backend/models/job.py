from sqlalchemy import Column, Integer, String, Text, JSON

from database import Base


class Job(Base):

    __tablename__ = "jobs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        nullable=True
    )

    title = Column(String)

    description = Column(Text)

    required_skills = Column(JSON)

    experience_required = Column(Integer)

    context_terms = Column(JSON)