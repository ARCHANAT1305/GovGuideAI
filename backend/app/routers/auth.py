from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin, UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Password hashing
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


# =========================
# REGISTER
# =========================
@router.post("/register", response_model=UserResponse)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # Check whether email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = pwd_context.hash(user.password)

    # Create new user
    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =========================
# LOGIN
# =========================
@router.post("/login", response_model=UserResponse)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    # Find user
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Check password
    password_correct = pwd_context.verify(
        user.password,
        existing_user.password
    )

    if not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return existing_user