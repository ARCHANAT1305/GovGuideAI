from typing import Literal

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    age: int = Field(ge=1, le=120)
    gender: str
    state: str
    occupation: str
    annual_income: str
    category: str
    requirement: str
    land_holding: str | None = None
    education_level: str | None = None
    student_status: str | None = None
    class12_percentile: str | None = None
    existing_business: str | None = None
    other_scholarship: str | None = None


class ProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    age: int | None
    gender: str | None
    state: str | None
    occupation: str | None
    annual_income: str | None
    category: str | None
    requirement: str | None
    land_holding: str | None = None
    education_level: str | None = None
    student_status: str | None = None
    class12_percentile: str | None = None
    existing_business: str | None = None
    other_scholarship: str | None = None

    class Config:
        from_attributes = True


class SchemeResponse(BaseModel):
    id: int
    name: str
    description: str
    state: str | None
    category: str | None
    occupation: str | None
    min_age: int | None
    max_age: int | None
    max_income: int | None
    requirement: str | None
    benefits: str | None
    documents: str | None
    official_url: str | None
    application_process: str | None = None
    eligibility_notes: str | None = None
    source_name: str | None = None
    source_url: str | None = None
    verified_on: str | None = None
    verification_status: str | None = None

    class Config:
        from_attributes = True


class ApplicantInformationResponse(BaseModel):
    name: str
    email: str
    age: int | None
    gender: str | None
    state: str | None
    occupation: str | None
    annual_income: str | None
    category: str | None
    requirement: str | None


class ApplicationPreparationResponse(BaseModel):
    scheme_name: str
    application_status: Literal["ready_for_review", "needs_review"]
    message: str
    applicant_information: ApplicantInformationResponse
    documents_to_prepare: list[str]
    profile_gaps: list[str]
    official_url: str | None


class ReminderResponse(BaseModel):
    type: Literal["document", "action"]
    title: str
    description: str
    completed: bool


class ReminderSummaryResponse(BaseModel):
    scheme_name: str
    total_reminders: int = Field(ge=0)
    reminders: list[ReminderResponse]


class SchemeMatchResponse(BaseModel):
    scheme_id: int
    name: str
    description: str
    state: str | None = None
    benefits: str | None = None
    documents: str | None = None
    official_url: str | None = None
    application_process: str | None = None
    eligibility_notes: str | None = None
    source_name: str | None = None
    source_url: str | None = None
    verified_on: str | None = None
    verification_status: str | None = None
    eligibility_score: int = Field(ge=0, le=100)
    eligible: bool
    reasons: list[str]
    missing: list[str]
    required_documents: list[str]
    missing_information: list[str]
    information_complete: bool
    next_step: str
    opportunity_status: Literal["eligible", "not_eligible"]
    opportunity_message: str
    opportunity_gaps: list[str]
    future_opportunity: str | None
    action_plan: list[str]
    action_plan_count: int = Field(ge=0)
    application: ApplicationPreparationResponse
    reminders: ReminderSummaryResponse


class SchemeMatchSummary(BaseModel):
    user_id: int
    total_schemes_checked: int
    matched_count: int
    matched_schemes: list[SchemeMatchResponse]
    analyzed_schemes: list[SchemeMatchResponse]


class ApplicationCreate(BaseModel):
    user_id: int
    scheme_id: int
    application_reference: str | None = None


class ApplicationUpdate(BaseModel):
    status: str
    application_reference: str | None = None
    notes: str | None = None


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    scheme_id: int
    application_reference: str | None = None
    status: str
    notes: str | None = None
    applied_on: str | None = None
    created_at: str

    class Config:
        from_attributes = True
