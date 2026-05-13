from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import resume, auth, job, ranking

from database import Base, engine
import models  # IMPORTANT: registers all tables

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(job.router)
app.include_router(ranking.router)


@app.get("/")
def home():
    return {"message": "Backend running"}