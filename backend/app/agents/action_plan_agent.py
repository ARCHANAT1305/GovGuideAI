def generate_action_plan(
    user,
    scheme,
    eligibility_result,
    missing_info
):
    """
    Creates a personalized, ordered action plan
    based on the user's eligibility and missing information.
    """

    steps = []

    status = eligibility_result.get(
        "status",
        "not_eligible"
    )

    eligible = eligibility_result.get(
        "eligible",
        False
    )

    # --------------------------------------------------
    # STEP 1: COMPLETE MISSING PROFILE INFORMATION
    # --------------------------------------------------

    missing_information = missing_info.get(
        "missing_information",
        []
    )

    for item in missing_information:

        steps.append({
            "step": len(steps) + 1,
            "title": f"Provide {item}",
            "description": (
                f"Provide or verify your {item} "
                f"information in your GovGuide profile."
            ),
            "priority": "High",
            "type": "profile"
        })

    # --------------------------------------------------
    # STEP 2: REVIEW ELIGIBILITY GAPS
    # --------------------------------------------------

    failed_conditions = eligibility_result.get(
        "failed_conditions",
        []
    )

    if status == "not_eligible":

        for condition in failed_conditions:

            steps.append({
                "step": len(steps) + 1,
                "title": "Review eligibility condition",
                "description": condition,
                "priority": "High",
                "type": "eligibility"
            })

    # --------------------------------------------------
    # STEP 3: PREPARE DOCUMENTS
    # --------------------------------------------------

    required_documents = missing_info.get(
        "required_documents",
        []
    )

    for document in required_documents:

        steps.append({
            "step": len(steps) + 1,
            "title": f"Prepare {document}",
            "description": (
                f"Keep {document} ready for "
                f"application or verification."
            ),
            "priority": "Medium",
            "type": "document"
        })

    # --------------------------------------------------
    # STEP 4: ELIGIBLE USER
    # --------------------------------------------------

    if eligible:

        steps.append({
            "step": len(steps) + 1,
            "title": "Review official scheme details",
            "description": (
                "Check the official scheme information, "
                "conditions and application instructions "
                "before submitting."
            ),
            "priority": "High",
            "type": "review"
        })

        steps.append({
            "step": len(steps) + 1,
            "title": "Submit the application",
            "description": (
                "Apply through the official government "
                "application channel."
            ),
            "priority": "High",
            "type": "application"
        })

    # --------------------------------------------------
    # STEP 5: INFORMATION REQUIRED
    # --------------------------------------------------

    elif status == "information_required":

        steps.append({
            "step": len(steps) + 1,
            "title": "Complete your profile",
            "description": (
                "Provide the missing information and "
                "run the eligibility check again."
            ),
            "priority": "High",
            "type": "profile"
        })

    # --------------------------------------------------
    # STEP 6: NOT ELIGIBLE
    # --------------------------------------------------

    elif status == "not_eligible":

        steps.append({
            "step": len(steps) + 1,
            "title": "Review alternative opportunities",
            "description": (
                "Explore other government schemes that "
                "better match your current profile."
            ),
            "priority": "Medium",
            "type": "alternative"
        })

    # --------------------------------------------------
    # REMOVE DUPLICATE STEPS
    # --------------------------------------------------

    unique_steps = []
    seen = set()

    for step in steps:

        key = (
            step["title"],
            step["description"]
        )

        if key not in seen:

            seen.add(key)
            step["step"] = len(unique_steps) + 1
            unique_steps.append(step)

    # --------------------------------------------------
    # SUMMARY
    # --------------------------------------------------

    if eligible:

        summary = (
            "You currently match the configured eligibility "
            "conditions. Follow the steps below to prepare "
            "and submit your application."
        )

    elif status == "information_required":

        summary = (
            "Complete the missing information before "
            "GovGuide can fully evaluate this scheme."
        )

    else:

        summary = (
            "This scheme does not currently match your "
            "profile. Review the eligibility gaps and "
            "consider alternative opportunities."
        )

    return {
        "total_steps": len(unique_steps),
        "summary": summary,
        "steps": unique_steps
    }
