from database import Base, engine
from models.resume import Resume
from models.job import Job

Base.metadata.create_all(bind=engine)

print("Tables created successfully")