from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..models import Scheme, User
from ..agents.chat_agent import answer_chat_message


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    message: str
    user_id: int | None = None


@router.post("")
def chat(
    payload: ChatRequest | None = Body(default=None),
    message: str | None = None,
    user_id: int | None = None,
    db: Session = Depends(get_db)
):
    final_message = ""
    final_user_id = None

    if payload is not None:
        final_message = payload.message
        final_user_id = payload.user_id
    elif message is not None:
        final_message = message
        final_user_id = user_id

    schemes = (
        db.query(Scheme)
        .all()
    )

    user = None

    if final_user_id is not None:
        user = (
            db.query(User)
            .filter(User.id == final_user_id)
            .first()
        )

    result = answer_chat_message(
        message=final_message,
        schemes=schemes,
        user=user
    )

    return result
