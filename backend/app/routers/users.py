from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import ProfileUpdate, ProfileResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get(
    "/{user_id}/profile",
    response_model=ProfileResponse
)
def get_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.put(
    "/{user_id}/profile",
    response_model=ProfileResponse
)
def update_profile(
    user_id: int,
    profile: ProfileUpdate,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.age = profile.age
    user.gender = profile.gender
    user.state = profile.state
    user.occupation = profile.occupation
    user.annual_income = profile.annual_income
    user.category = profile.category
    user.requirement = profile.requirement
    user.land_holding = profile.land_holding
    user.education_level = profile.education_level
    user.student_status = profile.student_status
    user.class12_percentile = profile.class12_percentile
    user.existing_business = profile.existing_business
    user.other_scholarship = profile.other_scholarship

    db.commit()
    db.refresh(user)

    return user