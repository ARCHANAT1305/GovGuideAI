from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Scheme

from ..agents.eligibility_agent import evaluate_eligibility
from ..agents.action_plan_agent import generate_action_plan
from ..agents.application_agent import prepare_application
from ..agents.reminder_agent import generate_reminders
from ..agents.document_agent import analyze_missing_information
from ..agents.opportunity_gap_agent import analyze_opportunity_gap


router = APIRouter(
    prefix="/schemes",
    tags=["Schemes"]
)


# ============================================================
# 1. GET ALL SCHEMES
# ============================================================

@router.get("/")
def get_schemes(
    db: Session = Depends(get_db)
):
    schemes = db.query(Scheme).all()

    return {
        "total": len(schemes),
        "schemes": schemes
    }


# ============================================================
# 2. MATCH SCHEMES FOR USER (Must come before /{scheme_id})
# ============================================================

@router.get("/match/{user_id}")
def match_schemes(
    user_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # GET USER
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # --------------------------------------------------------
    # GET ALL SCHEMES
    # --------------------------------------------------------

    schemes = db.query(Scheme).all()

    if not schemes:

        return {
            "user_id": user_id,
            "total_schemes": 0,
            "total_schemes_checked": 0,
            "matched_count": 0,
            "eligible_count": 0,
            "information_required_count": 0,
            "not_eligible_count": 0,
            "matched_schemes": [],
            "analyzed_schemes": []
        }


    analyzed_schemes = []


    # ========================================================
    # ANALYZE EVERY SCHEME
    # ========================================================

    for scheme in schemes:

        # ----------------------------------------------------
        # 1. ELIGIBILITY AGENT
        # ----------------------------------------------------

        eligibility_result = evaluate_eligibility(
            user=user,
            scheme=scheme
        )


        # ----------------------------------------------------
        # 2. MISSING INFORMATION (from eligibility result)
        # ----------------------------------------------------

        missing_information = (
            eligibility_result.get(
                "missing_information",
                []
            )
        )

        failed_conditions = (
            eligibility_result.get(
                "failed_conditions",
                []
            )
        )


        # ----------------------------------------------------
        # 3. DOCUMENT AGENT
        # ----------------------------------------------------

        missing_info = analyze_missing_information(
            user=user,
            scheme=scheme,
            eligibility_result=eligibility_result,
        )


        # ----------------------------------------------------
        # 4. OPPORTUNITY GAP AGENT
        # ----------------------------------------------------

        opportunity_result = analyze_opportunity_gap(
            user=user,
            scheme=scheme,
            eligibility_result=eligibility_result,
            missing_info=missing_info,
        )

        opportunity_status = opportunity_result["status"]

        opportunity_message = opportunity_result["message"]

        opportunity_gaps = opportunity_result["gaps"]

        future_opportunity = opportunity_result[
            "future_opportunity"
        ]


        # ----------------------------------------------------
        # 5. ACTION PLAN AGENT
        # ----------------------------------------------------
        action_plan_result = generate_action_plan(
            user=user,
            scheme=scheme,
            eligibility_result=eligibility_result,
            missing_info=missing_info
        )


        action_plan = action_plan_result.get(
            "steps",
            []
        )


        # ----------------------------------------------------
        # 6. APPLICATION AGENT
        # ----------------------------------------------------

        application_result = prepare_application(
            user=user,
            scheme=scheme,
            eligibility_result=eligibility_result,
            missing_info=missing_info
        )


        # ----------------------------------------------------
        # 7. REMINDER AGENT
        # ----------------------------------------------------

        reminder_result = generate_reminders(
            scheme=scheme,
            action_plan=action_plan,
            required_documents=missing_info["required_documents"]
        )


        # ----------------------------------------------------
        # 8. FINAL SCHEME RESPONSE
        # ----------------------------------------------------


        scheme_result = {

            # Basic information
            "scheme_id": scheme.id,

            "name": scheme.name,

            "description": scheme.description,

            "benefits": scheme.benefits,

            "documents": scheme.documents,

            "official_url": scheme.official_url,


            # Eligibility
            "status": eligibility_result[
                "status"
            ],

            "eligible": eligibility_result[
                "eligible"
            ],

            "eligibility_score": eligibility_result[
                "score"
            ],

            "passed_checks": eligibility_result[
                "passed_checks"
            ],

            "failed_checks": eligibility_result[
                "failed_checks"
            ],

            "missing_checks": eligibility_result[
                "missing_checks"
            ],

            "reasons": eligibility_result[
                "reasons"
            ],

            "failed_conditions": failed_conditions,

            "missing_information": missing_info[
                "missing_information"
            ],

            # Compatibility with existing frontend
            "missing": eligibility_result.get(
                "missing",
                []
            ),

            # Rich document analysis (from document_agent)
            "document_analysis": {
                "summary": missing_info["summary"],
                "completeness_score": missing_info["completeness_score"],
                "information_details": missing_info["information_details"],
                "document_details": missing_info["document_details"],
                "total_missing_information": missing_info["total_missing_information"],
                "total_required_documents": missing_info["total_required_documents"],
            },

            "required_documents": missing_info["required_documents"],


            # Scheme information
            "eligibility_notes": (
                scheme.eligibility_notes
            ),

            "application_process": (
                scheme.application_process
            ),


            # Opportunity Gap Agent
            "opportunity_status": (
                opportunity_status
            ),

            "opportunity_message": (
                opportunity_message
            ),

            "opportunity_gaps": (
                opportunity_gaps
            ),

            "future_opportunity": (
                future_opportunity
            ),

            "opportunity_analysis": opportunity_result,


            # Personalized Action Plan
            "action_plan": action_plan,

            "action_plan_count": len(
                action_plan
            ),


            # Application Agent
            "application": application_result,


            # Reminder Agent
            "reminders": reminder_result,


            # Source verification
            "source_name": (
                scheme.source_name
            ),

            "source_url": (
                scheme.source_url
            ),

            "verified_on": (
                scheme.verified_on
            ),

            "verification_status": (
                scheme.verification_status
            ),


            # Recommended next step
            "next_step": eligibility_result[
                "next_step"
            ]
        }


        analyzed_schemes.append(
            scheme_result
        )


    # ========================================================
    # SORT RESULTS
    # ========================================================

    # Eligible schemes first,
    # information-required next,
    # not-eligible last.

    status_order = {
        "eligible": 0,
        "information_required": 1,
        "not_eligible": 2
    }

    analyzed_schemes.sort(
        key=lambda item: (
            status_order.get(
                item["status"],
                3
            ),
            -item["eligibility_score"]
        )
    )


    # ========================================================
    # MATCHED SCHEMES
    # ========================================================

    matched_schemes = [
        scheme
        for scheme in analyzed_schemes
        if scheme["status"] == "eligible"
    ]


    # ========================================================
    # SUMMARY
    # ========================================================

    eligible_count = len([
        scheme
        for scheme in analyzed_schemes
        if scheme["status"] == "eligible"
    ])


    information_required_count = len([
        scheme
        for scheme in analyzed_schemes
        if scheme["status"] == "information_required"
    ])


    not_eligible_count = len([
        scheme
        for scheme in analyzed_schemes
        if scheme["status"] == "not_eligible"
    ])


    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "user_id": user_id,

        "total_schemes": len(
            analyzed_schemes
        ),

        "total_schemes_checked": len(
            analyzed_schemes
        ),

        "matched_count": eligible_count,

        "eligible_count": eligible_count,

        "information_required_count": (
            information_required_count
        ),

        "not_eligible_count": (
            not_eligible_count
        ),

        "matched_schemes": matched_schemes,

        "analyzed_schemes": analyzed_schemes
    }


# ============================================================
# 3. GET SINGLE SCHEME (Placed after /match/{user_id})
# ============================================================

@router.get("/{scheme_id}")
def get_scheme(
    scheme_id: int,
    db: Session = Depends(get_db)
):
    scheme = (
        db.query(Scheme)
        .filter(Scheme.id == scheme_id)
        .first()
    )

    if not scheme:
        raise HTTPException(
            status_code=404,
            detail="Scheme not found"
        )

    return scheme
