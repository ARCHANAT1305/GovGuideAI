def prepare_application(
    user,
    scheme,
    eligibility_result,
    missing_info
):
    """
    Application Assistance Agent

    Prepares a structured application checklist
    based on the user's eligibility result.
    """

    applicant_information = {
        "name": user.name,
        "email": user.email,
        "age": user.age,
        "gender": user.gender,
        "state": user.state,
        "occupation": user.occupation,
        "annual_income": user.annual_income,
        "category": user.category,
        "requirement": user.requirement
    }

    # --------------------------------------------------
    # ELIGIBILITY STATUS
    # --------------------------------------------------

    status = eligibility_result.get(
        "status",
        "not_eligible"
    )

    eligible = eligibility_result.get(
        "eligible",
        False
    )

    # --------------------------------------------------
    # DOCUMENTS
    # --------------------------------------------------

    documents_to_prepare = missing_info.get(
        "required_documents",
        []
    )

    # --------------------------------------------------
    # INFORMATION GAPS
    # --------------------------------------------------

    profile_gaps = missing_info.get(
        "missing_information",
        []
    )

    eligibility_gaps = eligibility_result.get(
        "failed_conditions",
        []
    )

    # --------------------------------------------------
    # APPLICATION STATUS
    # --------------------------------------------------

    if eligible and status == "eligible":

        application_status = "ready_for_review"

        message = (
            "Your available profile information satisfies "
            "the configured eligibility conditions. "
            "Review the application checklist and official "
            "scheme instructions before applying."
        )

        next_action = (
            "Review your information, prepare the required "
            "documents and apply through the official portal."
        )

    elif status == "information_required":

        application_status = "information_required"

        message = (
            "Your application cannot be prepared completely "
            "because some profile information is missing."
        )

        next_action = (
            "Complete the missing profile information and "
            "run the eligibility check again."
        )

    else:

        application_status = "needs_review"

        message = (
            "Some eligibility conditions do not currently "
            "match your profile. Review the gaps before "
            "considering an application."
        )

        next_action = (
            "Review the eligibility gaps and check whether "
            "another government scheme better matches your profile."
        )

    # --------------------------------------------------
    # APPLICATION CHECKLIST
    # --------------------------------------------------

    checklist = []

    # Profile information
    for field in [
        "name",
        "email",
        "age",
        "state",
        "occupation",
        "annual_income",
        "category",
        "requirement"
    ]:

        value = applicant_information.get(field)

        checklist.append({
            "item": field.replace("_", " ").title(),
            "status": (
                "available"
                if value is not None
                and str(value).strip() != ""
                else "missing"
            ),
            "type": "profile"
        })

    # Required documents
    for document in documents_to_prepare:

        checklist.append({
            "item": document,
            "status": "to_prepare",
            "type": "document"
        })

    # Eligibility gaps
    for gap in eligibility_gaps:

        checklist.append({
            "item": gap,
            "status": "needs_review",
            "type": "eligibility"
        })

    # Missing profile information
    for gap in profile_gaps:

        checklist.append({
            "item": gap,
            "status": "missing",
            "type": "profile"
        })

    # --------------------------------------------------
    # RETURN RESULT
    # --------------------------------------------------

    return {
        "scheme_name": scheme.name,
        "application_status": application_status,
        "message": message,
        "next_action": next_action,

        "applicant_information": applicant_information,

        "documents_to_prepare": documents_to_prepare,

        "profile_gaps": profile_gaps,

        "eligibility_gaps": eligibility_gaps,

        "checklist": checklist,

        "official_url": scheme.official_url
    }
