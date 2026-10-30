def analyze_opportunity_gap(
    user,
    scheme,
    eligibility_result,
    missing_info
):
    """
    Opportunity Gap Agent

    Explains:
    1. Why the user is currently eligible/not eligible
    2. What information is missing
    3. Which conditions could potentially change
    4. Whether the scheme may become relevant in future
    5. What the user should do next
    """

    status = eligibility_result.get(
        "status",
        "not_eligible"
    )

    failed_conditions = eligibility_result.get(
        "failed_conditions",
        []
    )

    missing_information = missing_info.get(
        "missing_information",
        []
    )

    reasons = eligibility_result.get(
        "reasons",
        []
    )

    # --------------------------------------------------
    # ELIGIBLE
    # --------------------------------------------------

    if status == "eligible":

        return {
            "status": "eligible",

            "future_opportunity": False,

            "title": "Scheme currently matches your profile",

            "message": (
                "Your available profile information currently "
                "matches the configured eligibility conditions "
                "for this scheme."
            ),

            "gaps": [],

            "improvement_areas": [],

            "next_action": (
                "Review the official scheme details and "
                "prepare the required documents before applying."
            )
        }

    # --------------------------------------------------
    # INFORMATION REQUIRED
    # --------------------------------------------------

    if status == "information_required":

        improvement_areas = []

        for item in missing_information:
            improvement_areas.append({
                "area": item,
                "action": (
                    f"Provide or verify your {item}."
                )
            })

        return {
            "status": "information_required",

            "future_opportunity": True,

            "title": "More information is needed",

            "message": (
                "GovGuide cannot completely evaluate this "
                "scheme until the missing information is provided."
            ),

            "gaps": missing_information,

            "improvement_areas": improvement_areas,

            "next_action": (
                "Complete the missing profile information "
                "and run the eligibility check again."
            )
        }

    # --------------------------------------------------
    # NOT ELIGIBLE
    # --------------------------------------------------

    improvement_areas = []

    for condition in failed_conditions:

        condition_lower = condition.lower()

        # Age-related condition
        if "age" in condition_lower:

            improvement_areas.append({
                "area": "Age requirement",
                "action": (
                    "Check whether you will satisfy the "
                    "scheme's age requirement in the future."
                )
            })

        # Occupation-related condition
        elif "occupation" in condition_lower:

            improvement_areas.append({
                "area": "Occupation",
                "action": (
                    "Review whether the scheme is relevant "
                    "to your future occupation or activity."
                )
            })

        # Income-related condition
        elif "income" in condition_lower:

            improvement_areas.append({
                "area": "Income requirement",
                "action": (
                    "Monitor your income against the "
                    "scheme's configured income condition."
                )
            })

        # Education-related condition
        elif (
            "education" in condition_lower
            or "percentile" in condition_lower
        ):

            improvement_areas.append({
                "area": "Education requirement",
                "action": (
                    "Review the educational qualification "
                    "or academic requirement for the scheme."
                )
            })

        # Business-related condition
        elif "business" in condition_lower:

            improvement_areas.append({
                "area": "Business status",
                "action": (
                    "Review the scheme's requirements "
                    "for existing or new businesses."
                )
            })

        else:

            improvement_areas.append({
                "area": "Eligibility condition",
                "action": (
                    f"Review this condition: {condition}"
                )
            })

    # --------------------------------------------------
    # MISSING INFORMATION
    # --------------------------------------------------

    for item in missing_information:

        improvement_areas.append({
            "area": item,
            "action": (
                f"Provide or verify your {item}."
            )
        })

    # --------------------------------------------------
    # FUTURE OPPORTUNITY
    # --------------------------------------------------

    future_opportunity = False

    if failed_conditions:
        future_opportunity = True

    if missing_information:
        future_opportunity = True

    # --------------------------------------------------
    # MESSAGE
    # --------------------------------------------------

    if future_opportunity:

        message = (
            "You do not currently satisfy all configured "
            "conditions, but some gaps may be addressable "
            "or may change with your circumstances."
        )

        next_action = (
            "Review the eligibility gaps and improvement "
            "areas before considering a future application."
        )

    else:

        message = (
            "Your current profile does not match the "
            "configured eligibility conditions."
        )

        next_action = (
            "Explore other schemes that better match "
            "your current profile."
        )

    # --------------------------------------------------
    # RETURN
    # --------------------------------------------------

    return {
        "status": "not_eligible",

        "future_opportunity": future_opportunity,

        "title": "This scheme does not currently match",

        "message": message,

        "gaps": failed_conditions,

        "reasons": reasons,

        "improvement_areas": improvement_areas,

        "next_action": next_action
    }
