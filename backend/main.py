from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.resume import router as resume_router
from routes.job import router as job_router

app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():

    return {
        "message": "Backend is running successfully"
    }


# ROUTES
app.include_router(resume_router)

app.include_router(job_router)