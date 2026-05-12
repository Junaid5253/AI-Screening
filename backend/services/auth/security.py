from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12
)

def hash_password(password: str):
    password = password[:72]  # IMPORTANT FIX
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    plain = plain[:72]
    return pwd_context.verify(plain, hashed)