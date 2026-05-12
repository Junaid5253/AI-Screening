from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User

from services.auth.security import hash_password, verify_password
from services.auth.jwt import create_access_token

router = APIRouter()


@router.post("/register")
def register(name: str, email: str, password: str, db: Session = Depends(get_db)):

    user = User(
        name=name,
        email=email,
        password=hash_password(password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"success": True, "user_id": user.id}


@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": user.id})

    return {"access_token": token}