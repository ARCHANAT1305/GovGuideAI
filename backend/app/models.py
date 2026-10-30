from sqlalchemy import Column, Integer, String, Text
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(String, nullable=False)

    # ==========================================
    # PROFILE INFORMATION
    # ==========================================

    age = Column(Integer, nullable=True)

    gender = Column(String, nullable=True)

    state = Column(String, nullable=True)

    occupation = Column(String, nullable=True)

    annual_income = Column(String, nullable=True)

    category = Column(String, nullable=True)

    requirement = Column(String, nullable=True)

    # Farmer-related information
    land_holding = Column(String, nullable=True)

    # Education-related information
    education_level = Column(String, nullable=True)

    student_status = Column(String, nullable=True)

    class12_percentile = Column(String, nullable=True)

    # Business-related information
    existing_business = Column(String, nullable=True)

    # Scholarship-related information
    other_scholarship = Column(String, nullable=True)


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)

    # ==========================================
    # BASIC SCHEME INFORMATION
    # ==========================================

    name = Column(String, nullable=False)

    description = Column(Text, nullable=False)

    state = Column(String, nullable=True)

    category = Column(String, nullable=True)

    occupation = Column(String, nullable=True)

    # ==========================================
    # BASIC ELIGIBILITY CONDITIONS
    # ==========================================

    min_age = Column(Integer, nullable=True)

    max_age = Column(Integer, nullable=True)

    max_income = Column(Integer, nullable=True)

    requirement = Column(String, nullable=True)

    # ==========================================
    # DETAILED ELIGIBILITY RULES
    # ==========================================

    eligibility_rules = Column(
        Text,
        nullable=True
    )

    # ==========================================
    # BENEFITS AND DOCUMENTS
    # ==========================================

    benefits = Column(Text, nullable=True)

    documents = Column(Text, nullable=True)

    # ==========================================
    # APPLICATION INFORMATION
    # ==========================================

    official_url = Column(String, nullable=True)

    application_process = Column(
        Text,
        nullable=True
    )

    # ==========================================
    # ELIGIBILITY EXPLANATION
    # ==========================================

    eligibility_notes = Column(
        Text,
        nullable=True
    )

    # ==========================================
    # SOURCE / VERIFICATION INFORMATION
    # ==========================================

    source_name = Column(
        String,
        nullable=True
    )

    source_url = Column(
        String,
        nullable=True
    )

    verified_on = Column(
        String,
        nullable=True
    )

    verification_status = Column(
        String,
        nullable=True
    )


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False)
    scheme_id = Column(Integer, nullable=False)

    application_reference = Column(
        String,
        nullable=True
    )

    status = Column(
        String,
        nullable=False,
        default="ready_to_apply"
    )

    notes = Column(Text, nullable=True)

    applied_on = Column(String, nullable=True)

    created_at = Column(
        String,
        nullable=False
    )