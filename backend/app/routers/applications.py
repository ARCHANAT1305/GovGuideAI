from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Application, User, Scheme
from ..schemas import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse
)


router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


# --------------------------------------------------
# CREATE APPLICATION
# --------------------------------------------------

@router.post(
    "",
    response_model=ApplicationResponse
)
def create_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(User.id == application.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    scheme = (
        db.query(Scheme)
        .filter(Scheme.id == application.scheme_id)
        .first()
    )

    if not scheme:
        raise HTTPException(
            status_code=404,
            detail="Scheme not found"
        )

    existing_application = (
        db.query(Application)
        .filter(
            Application.user_id == application.user_id,
            Application.scheme_id == application.scheme_id
        )
        .first()
    )

    if existing_application:
        return existing_application

    new_application = Application(
        user_id=application.user_id,
        scheme_id=application.scheme_id,
        application_reference=application.application_reference,
        status="ready_to_apply",
        notes=None,
        applied_on=None,
        created_at=datetime.now().isoformat()
    )


    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


# --------------------------------------------------
# GET USER APPLICATIONS
# --------------------------------------------------

@router.get(
    "/user/{user_id}",
    response_model=list[ApplicationResponse]
)
def get_user_applications(
    user_id: int,
    db: Session = Depends(get_db)
):

    applications = (
        db.query(Application)
        .filter(Application.user_id == user_id)
        .all()
    )

    return applications


# --------------------------------------------------
# GET ONE APPLICATION
# --------------------------------------------------

@router.get(
    "/{application_id}",
    response_model=ApplicationResponse
)
def get_application(
    application_id: int,
    db: Session = Depends(get_db)
):

    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return application


# --------------------------------------------------
# UPDATE APPLICATION STATUS
# --------------------------------------------------

@router.put(
    "/{application_id}",
    response_model=ApplicationResponse
)
def update_application(
    application_id: int,
    update: ApplicationUpdate,
    db: Session = Depends(get_db)
):

    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    allowed_statuses = [
        "ready_to_apply",
        "submitted",
        "under_review",
        "approved",
        "rejected"
    ]

    if update.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid application status"
        )

    application.status = update.status

    if update.application_reference is not None:
        reference = update.application_reference.strip()
        application.application_reference = reference if reference else None

    if update.notes is not None:
        application.notes = update.notes

    if update.status == "submitted" and not application.applied_on:
        application.applied_on = datetime.now().isoformat()


    db.commit()
    db.refresh(application)

    return application
