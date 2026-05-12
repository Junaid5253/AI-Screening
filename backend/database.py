from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLITE DATABASE URL
DATABASE_URL = "sqlite:///./hirsense.db"

# ENGINE
engine = create_engine(

    DATABASE_URL,

    connect_args={
        "check_same_thread": False,
        "timeout" : 30
    }
)

# SESSION
SessionLocal = sessionmaker(

    autocommit=False,

    autoflush=False,

    bind=engine
)

# BASE
Base = declarative_base()


# FASTAPI DB DEPENDENCY
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()