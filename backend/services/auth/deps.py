from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from database import get_db
from models.user import User

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

security = HTTPBearer()


def get_current_user(
    token=Depends(security),
    db: Session = Depends(get_db)
):

    try:
        payload = jwt.decode(
            token.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")

    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user