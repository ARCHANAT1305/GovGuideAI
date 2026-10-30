def generate_reminders(
    scheme,
    action_plan,
    required_documents
):
    """
    Reminder Agent

    Creates a clean reminder list from:
    1. Required documents
    2. Action plan

    Duplicate document reminders are removed.
    """

    reminders = []
    seen = set()

    # --------------------------------------------------
    # 1. DOCUMENT REMINDERS
    # --------------------------------------------------

    for document in required_documents:

        document = str(document).strip()

        if not document:
            continue

        key = f"document:{document.lower()}"

        if key in seen:
            continue

        seen.add(key)

        reminders.append({
            "type": "document",
            "title": f"Prepare {document}",
            "description": (
                f"Keep your {document} ready "
                f"for the application."
            ),
            "priority": "Medium",
            "completed": False
        })

    # --------------------------------------------------
    # 2. ACTION PLAN REMINDERS
    # --------------------------------------------------

    for step in action_plan:

        # New structured action-plan format
        if isinstance(step, dict):

            title = step.get("title", "Complete action")
            description = step.get(
                "description",
                "Complete this action."
            )
            priority = step.get(
                "priority",
                "Medium"
            )
            step_type = step.get(
                "type",
                "action"
            )

            # Don't create another reminder for
            # document steps because they already
            # exist in the document reminders.
            if step_type == "document":
                continue

            key = (
                f"action:"
                f"{title.lower().strip()}"
            )

            if key in seen:
                continue

            seen.add(key)

            reminders.append({
                "type": "action",
                "title": title,
                "description": description,
                "priority": priority,
                "completed": False
            })

        # Compatibility with old string action plans
        else:

            description = str(step).strip()

            if not description:
                continue

            key = f"action:{description.lower()}"

            if key in seen:
                continue

            seen.add(key)

            reminders.append({
                "type": "action",
                "title": "Review action",
                "description": description,
                "priority": "Medium",
                "completed": False
            })

    # --------------------------------------------------
    # 3. RETURN RESULT
    # --------------------------------------------------

    return {
        "scheme_name": scheme.name,
        "total_reminders": len(reminders),
        "reminders": reminders
    }
