from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import (
    Base,
    engine,
    ensure_scheme_metadata_columns,
    ensure_user_profile_columns,
    ensure_application_columns,
)
from . import models
from .routers import auth
from .routers import users
from .routers import schemes
from .routers import applications
from .routers import chat

# Import all models and routers before creating tables.
Base.metadata.create_all(bind=engine)
ensure_scheme_metadata_columns()
ensure_user_profile_columns()
ensure_application_columns()


app = FastAPI(
    title="GovGuide API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


app.include_router(auth.router)

app.include_router(users.router)

app.include_router(schemes.router)

app.include_router(applications.router)

app.include_router(chat.router)




@app.get("/")
def home():

    return {
        "message": "Welcome to GovGuide Backend",
        "status": "Backend is running successfully!"
    }