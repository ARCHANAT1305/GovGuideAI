from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker


DATABASE_URL = "sqlite:///./govguide.db"


engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()


SCHEME_METADATA_COLUMNS = {
    "eligibility_rules": "TEXT",
    "application_process": "TEXT",
    "eligibility_notes": "TEXT",
    "source_name": "VARCHAR",
    "source_url": "VARCHAR",
    "verified_on": "VARCHAR",
    "verification_status": "VARCHAR",
}

USER_PROFILE_COLUMNS = {
    "land_holding": "VARCHAR",
    "education_level": "VARCHAR",
    "student_status": "VARCHAR",
    "class12_percentile": "VARCHAR",
    "existing_business": "VARCHAR",
    "other_scholarship": "VARCHAR",
}


def ensure_scheme_metadata_columns() -> None:
    inspector = inspect(engine)
    if not inspector.has_table("schemes"):
        return

    existing_columns = {
        column["name"] for column in inspector.get_columns("schemes")
    }

    with engine.begin() as connection:
        for column_name, column_type in SCHEME_METADATA_COLUMNS.items():
            if column_name not in existing_columns:
                connection.execute(
                    text(
                        f"ALTER TABLE schemes ADD COLUMN "
                        f"{column_name} {column_type}"
                    )
                )


def ensure_user_profile_columns() -> None:
    inspector = inspect(engine)
    if not inspector.has_table("users"):
        return

    existing_columns = {
        column["name"] for column in inspector.get_columns("users")
    }

    with engine.begin() as connection:
        for column_name, column_type in USER_PROFILE_COLUMNS.items():
            if column_name not in existing_columns:
                connection.execute(
                    text(
                        f"ALTER TABLE users ADD COLUMN "
                        f"{column_name} {column_type}"
                    )
                )


APPLICATION_COLUMNS = {
    "application_reference": "VARCHAR",
}


def ensure_application_columns() -> None:
    inspector = inspect(engine)
    if not inspector.has_table("applications"):
        return

    existing_columns = {
        column["name"] for column in inspector.get_columns("applications")
    }

    with engine.begin() as connection:
        for column_name, column_type in APPLICATION_COLUMNS.items():
            if column_name not in existing_columns:
                connection.execute(
                    text(
                        f"ALTER TABLE applications ADD COLUMN "
                        f"{column_name} {column_type}"
                    )
                )



def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()