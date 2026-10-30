from typing import Literal, TypedDict

from ..models import Scheme, User
from .eligibility_agent import EligibilityResult


class OpportunityAnalysis(TypedDict):
    status: Literal["eligible", "not_eligible"]
    message: str
    gaps: list[str]
    future_opportunity: str | None


def analyze_opportunity_gap(
    user: User,
    scheme: Scheme,
    eligibility_result: EligibilityResult,
) -> OpportunityAnalysis:
    profile_fields = (
        (user.age, "Age"),
        (user.gender, "Gender"),
        (user.state, "State"),
        (user.occupation, "Occupation"),
        (user.annual_income, "Annual income"),
        (user.category, "Category"),
        (user.requirement, "Requirement"),
    )
    missing_profile = [
        f"{label} information is required."
        for value, label in profile_fields
        if value is None or (isinstance(value, str) and not value.strip())
    ]

    if eligibility_result["eligible"] and not missing_profile:
        return {
            "status": "eligible",
            "message": "You currently satisfy the configured eligibility conditions.",
            "gaps": [],
            "future_opportunity": None,
        }

    gaps = list(dict.fromkeys([*missing_profile, *eligibility_result["missing"]]))
    if not gaps:
        gaps.append("Review the scheme details and your saved profile.")

    return {
        "status": "not_eligible",
        "message": (
            "Complete the missing profile details to check this scheme accurately."
            if missing_profile
            else f"You do not currently satisfy all configured conditions for {scheme.name}."
        ),
        "gaps": gaps,
        "future_opportunity": (
            "Eligibility may change if your circumstances or scheme criteria change. "
            "You can update your profile and check again later."
        ),
    }
