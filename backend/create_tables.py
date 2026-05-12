from database import Base, engine, get_db
from models.user import User
from services.auth.security import hash_password
from sqlalchemy.orm import Session

# IMPORT ALL MODELS
from models.user import User
from models.resume import Resume
from models.job import Job


Base.metadata.create_all(bind=engine)

# Create default user
db = next(get_db())
existing_user = db.query(User).filter(User.email == "admin@hiresense.ai").first()
if not existing_user:
    default_user = User(
        name="Admin",
        email="admin@hiresense.ai",
        password=hash_password("password123")
    )
    db.add(default_user)
    db.commit()
    print("Default user created")
else:
    print("Default user already exists")

print("Tables created successfully")