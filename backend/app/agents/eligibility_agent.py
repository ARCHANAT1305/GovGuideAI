from typing import TypedDict


class EligibilityResult(TypedDict, total=False):
    eligible: bool
    status: str
    score: int
    passed_checks: list[str]
    failed_checks: list[str]
    missing_checks: list[str]
    reasons: list[str]
    failed_conditions: list[str]
    missing_information: list[str]
    missing: list[str]
    next_step: str


def clean_text(value):
    """
    Convert a value into clean lowercase text.
    """
    if value is None:
        return ""

    return str(value).strip().lower()


def parse_income(value):
    """
    Convert the income range stored from the frontend
    into an approximate numeric value.

    Example:
    "Below ₹1 lakh" -> 50000
    "₹1 - ₹2 lakh" -> 150000
    """

    if value is None:
        return None

    text = clean_text(value)

    if not text:
        return None

    if "below" in text and "1 lakh" in text:
        return 50000

    if "1 - 2 lakh" in text or "1 - 2.5 lakh" in text or "1 - ₹2.5 lakh" in text:
        return 175000

    if "2.5 - 5 lakh" in text or "2.5 - ₹5 lakh" in text or "2 - 3 lakh" in text:
        return 375000

    if "3 - 4.5 lakh" in text:
        return 375000

    if "4.5 - 6 lakh" in text:
        return 525000

    if "5 - 10 lakh" in text or "5 - ₹10 lakh" in text or "6 - 10 lakh" in text:
        return 750000

    if "above 10 lakh" in text:
        return 1200000

    # If the value is already numeric
    try:
        return float(text.replace(",", "").replace("₹", ""))
    except ValueError:
        return None


def check_condition(
    passed_checks,
    failed_checks,
    missing_checks,
    reasons,
    condition,
    passed,
    failed_reason=None,
    missing_reason=None
):
    """
    Helper function to store eligibility results.
    """

    if passed:
        passed_checks.append(condition)

    elif missing_reason:
        missing_checks.append(condition)
        reasons.append(missing_reason)

    else:
        failed_checks.append(condition)

        if failed_reason:
            reasons.append(failed_reason)


def check_scheme_specific_rules(
    user,
    scheme,
    passed_checks,
    failed_checks,
    missing_checks,
    reasons,
    failed_conditions,
    missing_information
):
    """
    Apply detailed rules for specific government schemes.
    """

    scheme_name = clean_text(scheme.name)
    rules = clean_text(getattr(scheme, "eligibility_rules", ""))

    # =========================================================
    # PM-KISAN
    # =========================================================

    if "pm-kisan" in scheme_name or "pm kisan" in scheme_name:

        land_holding = clean_text(user.land_holding)

        # Land information is required
        if not land_holding:

            missing_information.append(
                "land holding information"
            )

            missing_checks.append(
                "Applicant should have eligible cultivable land."
            )

            reasons.append(
                "Land holding information is required to evaluate PM-KISAN eligibility."
            )

        else:

            try:
                land = float(
                    land_holding
                    .replace("hectares", "")
                    .replace("hectare", "")
                    .strip()
                )

                # PM-KISAN scheme data configured in GovGuide
                # uses up to 2 hectares as a basic check.
                if land <= 2:

                    passed_checks.append(
                        "Land holding is within the configured PM-KISAN limit."
                    )

                else:

                    failed_checks.append(
                        "Land holding should be within the configured PM-KISAN limit."
                    )

                    failed_conditions.append(
                        "Land holding is above the configured PM-KISAN limit."
                    )

                    reasons.append(
                        "The entered land holding is above the configured PM-KISAN limit."
                    )

            except ValueError:

                missing_information.append(
                    "valid land holding value in hectares"
                )

                reasons.append(
                    "A valid land holding value is required."
                )

        # Farmer occupation
        occupation = clean_text(user.occupation)

        if occupation == "farmer":

            passed_checks.append(
                "Occupation is Farmer."
            )

        elif occupation:

            failed_checks.append(
                "Occupation should be Farmer."
            )

            failed_conditions.append(
                "Applicant occupation is not Farmer."
            )

            reasons.append(
                "PM-KISAN is intended for eligible landholding farmer families."
            )

        else:

            missing_information.append(
                "occupation"
            )

            reasons.append(
                "Occupation information is required."
            )

    # =========================================================
    # PMEGP
    # =========================================================

    elif "pmegp" in scheme_name:

        # Age
        if user.age is None:

            missing_information.append("age")

            reasons.append(
                "Age is required to verify PMEGP eligibility."
            )

        elif user.age >= 18:

            passed_checks.append(
                "Applicant is 18 years or older."
            )

        else:

            failed_checks.append(
                "Applicant must be 18 years or older."
            )

            failed_conditions.append(
                "Applicant is below 18 years."
            )

            reasons.append(
                "PMEGP requires the applicant to be above 18 years."
            )

        # Existing business
        existing_business = clean_text(
            user.existing_business
        )

        if not existing_business:

            missing_information.append(
                "existing business status"
            )

            reasons.append(
                "Existing business status is required because PMEGP assistance is for new eligible projects."
            )

        elif existing_business in [
            "no",
            "no existing business",
            "new business",
            "not started",
            "none"
        ]:

            passed_checks.append(
                "Applicant indicates no existing business."
            )

        else:

            failed_checks.append(
                "Applicant should be applying for a new eligible project."
            )

            failed_conditions.append(
                "Applicant indicates an existing business."
            )

            reasons.append(
                "PMEGP new-enterprise assistance is intended for eligible new projects."
            )

        # Education
        education = clean_text(
            user.education_level
        )

        if education:

            passed_checks.append(
                "Education information is available."
            )

        else:

            missing_information.append(
                "education qualification"
            )

            reasons.append(
                "Education information may be required depending on project cost and type."
            )

    # =========================================================
    # PM-USP CSSS
    # =========================================================

    elif (
        "pm-usp" in scheme_name
        or "csss" in scheme_name
        or "central sector scheme of scholarship" in scheme_name
    ):

        # Class XII percentile
        percentile = clean_text(
            user.class12_percentile
        )

        if not percentile:

            missing_information.append(
                "Class XII percentile"
            )

            reasons.append(
                "Class XII percentile is required to check the merit condition."
            )

        else:

            try:

                percentile_value = float(percentile)

                if percentile_value >= 80:

                    passed_checks.append(
                        "Class XII percentile is at least 80."
                    )

                else:

                    failed_checks.append(
                        "Applicant should meet the configured 80th percentile condition."
                    )

                    failed_conditions.append(
                        "Class XII percentile is below the configured 80th percentile condition."
                    )

                    reasons.append(
                        "The configured PM-USP CSSS rule requires the applicant to be above the 80th percentile."
                    )

            except ValueError:

                missing_information.append(
                    "valid Class XII percentile"
                )

                reasons.append(
                    "A valid Class XII percentile is required."
                )

        # Student status
        student_status = clean_text(
            user.student_status
        )

        if not student_status:

            missing_information.append(
                "student/course status"
            )

            reasons.append(
                "Student course status is required."
            )

        elif student_status in [
            "regular course",
            "regular",
            "regular course student"
        ]:

            passed_checks.append(
                "Applicant is pursuing a regular course."
            )

        elif student_status in [
            "distance or part-time course",
            "distance",
            "part-time",
            "correspondence",
            "distance education"
        ]:

            failed_checks.append(
                "Applicant should be pursuing a regular course."
            )

            failed_conditions.append(
                "Applicant is not pursuing a regular course."
            )

            reasons.append(
                "PM-USP CSSS is intended for students pursuing regular courses."
            )

        elif student_status in [
            "not currently a student",
            "not a student",
            "no"
        ]:

            failed_checks.append(
                "Applicant should currently be pursuing a regular course."
            )

            failed_conditions.append(
                "Applicant is not currently a student."
            )

            reasons.append(
                "The scholarship is intended for eligible students pursuing higher education."
            )

        else:

            missing_information.append(
                "valid student/course status"
            )

            reasons.append(
                "The provided student status could not be evaluated."
            )

        # Other scholarship
        other_scholarship = clean_text(
            user.other_scholarship
        )

        if not other_scholarship:

            missing_information.append(
                "other scholarship status"
            )

            reasons.append(
                "Other scholarship status is required."
            )

        elif other_scholarship in [
            "no",
            "none",
            "no scholarship"
        ]:

            passed_checks.append(
                "Applicant is not receiving another scholarship."
            )

        else:

            failed_checks.append(
                "Applicant should not be receiving another scholarship or fee reimbursement."
            )

            failed_conditions.append(
                "Applicant reports receiving another scholarship."
            )

            reasons.append(
                "The configured PM-USP CSSS rule excludes applicants receiving another scholarship or fee reimbursement."
            )


    # =========================================================
    # PMJJBY – Life Insurance (age 18-50, bank account)
    # =========================================================

    elif "jeevan jyoti" in scheme_name or "pmjjby" in scheme_name:

        if user.age is None:
            missing_information.append("age")
            reasons.append("Age is required for PMJJBY eligibility (18–50 years).")
        elif 18 <= user.age <= 50:
            passed_checks.append("Age is within PMJJBY range of 18–50 years.")
        else:
            failed_checks.append("Age must be between 18 and 50 for PMJJBY.")
            failed_conditions.append("Applicant age is outside PMJJBY range (18–50 years).")
            reasons.append("PMJJBY requires the applicant to be between 18 and 50 years of age.")

    # =========================================================
    # PMSBY – Accident Insurance (age 18-70, bank account)
    # =========================================================

    elif "suraksha bima" in scheme_name or "pmsby" in scheme_name:

        if user.age is None:
            missing_information.append("age")
            reasons.append("Age is required for PMSBY eligibility (18–70 years).")
        elif 18 <= user.age <= 70:
            passed_checks.append("Age is within PMSBY range of 18–70 years.")
        else:
            failed_checks.append("Age must be between 18 and 70 for PMSBY.")
            failed_conditions.append("Applicant age is outside PMSBY range (18–70 years).")
            reasons.append("PMSBY requires the applicant to be between 18 and 70 years of age.")

    # =========================================================
    # APY – Atal Pension Yojana (age 18-40, unorganised sector)
    # =========================================================

    elif "atal pension" in scheme_name or "apy" in scheme_name:

        if user.age is None:
            missing_information.append("age")
            reasons.append("Age is required for APY eligibility (18–40 years).")
        elif 18 <= user.age <= 40:
            passed_checks.append("Age is within APY range of 18–40 years.")
        else:
            failed_checks.append("Age must be between 18 and 40 for APY.")
            failed_conditions.append("Applicant age is outside APY eligibility range (18–40 years).")
            reasons.append("APY requires the applicant to be between 18 and 40 years of age.")

    # =========================================================
    # IGNOAPS / Old Age Pension (age 60+, BPL)
    # =========================================================

    elif (
        "old age pension" in scheme_name
        or "ignoaps" in scheme_name
        or "indira gandhi national old age" in scheme_name
    ):

        if user.age is None:
            missing_information.append("age")
            reasons.append("Age is required for old age pension eligibility (60+ years).")
        elif user.age >= 60:
            passed_checks.append("Applicant is 60 years or older — meets age condition.")
        else:
            failed_checks.append("Applicant must be 60 years or older for old age pension.")
            failed_conditions.append("Applicant is below 60 years of age.")
            reasons.append("This pension scheme is for persons aged 60 years and above.")

    # =========================================================
    # Sukanya Samriddhi Yojana (girl child below 10)
    # =========================================================

    elif "sukanya" in scheme_name or "ssy" in scheme_name:

        passed_checks.append(
            "Sukanya Samriddhi Yojana account can be opened for a girl child below 10 years. "
            "Please verify the girl child's age before applying."
        )
        reasons.append(
            "Account must be opened before the girl child turns 10 years of age."
        )

    # =========================================================
    # PMAY – Housing (not owning a pucca house)
    # =========================================================

    elif (
        "awas yojana" in scheme_name
        or "pmay" in scheme_name
        or "pradhan mantri awas" in scheme_name
    ):

        occupation = clean_text(user.occupation)
        if user.age is None:
            missing_information.append("age")
            reasons.append("Age is required (must be 18+ for PMAY).")
        elif user.age >= 18:
            passed_checks.append("Applicant meets the minimum age of 18 for PMAY.")
        else:
            failed_checks.append("Applicant must be at least 18 years old.")
            failed_conditions.append("Applicant is below 18 years of age.")
            reasons.append("PMAY requires the applicant to be at least 18 years old.")

        passed_checks.append(
            "Please confirm you do not already own a pucca house anywhere in India — "
            "this is a key eligibility condition for PMAY."
        )

    # =========================================================
    # PMJAY – Ayushman Bharat (SECC-based)
    # =========================================================

    elif (
        "ayushman" in scheme_name
        or "pmjay" in scheme_name
        or "jan arogya" in scheme_name
    ):

        passed_checks.append(
            "Ayushman Bharat eligibility is based on SECC 2011 database. "
            "Check your eligibility at pmjay.gov.in or call 14555."
        )
        reasons.append(
            "Eligibility is determined by SECC 2011 data. "
            "Check at pmjay.gov.in to see if your family is listed."
        )

    # =========================================================
    # PMMY – Mudra Loan (entrepreneur, non-farm, 18+)
    # =========================================================

    elif (
        "mudra" in scheme_name
        or "pmmy" in scheme_name
    ):

        if user.age is None:
            missing_information.append("age")
            reasons.append("Age is required for Mudra Yojana eligibility (18+ years).")
        elif user.age >= 18:
            passed_checks.append("Applicant is 18 years or older — meets Mudra age condition.")
        else:
            failed_checks.append("Applicant must be at least 18 years old.")
            failed_conditions.append("Applicant is below 18 years of age.")
            reasons.append("PM Mudra Yojana requires the applicant to be at least 18 years old.")

        existing_business = clean_text(user.existing_business)
        if existing_business in ["no", "none", "not started", "new business", "no existing business"]:
            passed_checks.append("Applicant is starting a new business — eligible for Mudra.")
        elif existing_business:
            passed_checks.append(
                "Mudra loans support both new and existing micro enterprises."
            )
        else:
            missing_information.append("business/enterprise status")
            reasons.append("Business type information is useful for Mudra loan eligibility.")

    # =========================================================
    # PMKVY – Skill Training (15-45, unemployed/dropout)
    # =========================================================

    elif (
        "kaushal vikas" in scheme_name
        or "pmkvy" in scheme_name
        or "skill" in scheme_name
    ):

        if user.age is None:
            missing_information.append("age")
            reasons.append("Age is required for PMKVY eligibility (15–45 years).")
        elif 15 <= user.age <= 45:
            passed_checks.append("Age is within PMKVY range of 15–45 years.")
        else:
            failed_checks.append("Age should be between 15 and 45 for PMKVY.")
            failed_conditions.append("Applicant age is outside PMKVY range.")
            reasons.append("PMKVY targets youth between 15 and 45 years of age.")

    # =========================================================
    # Pre-Matric / Post-Matric Scholarship (SC/ST/OBC, student)
    # =========================================================

    elif (
        "pre-matric" in scheme_name
        or "post-matric" in scheme_name
        or "matric scholarship" in scheme_name
    ):

        category = clean_text(user.category)
        sc_st_obc = ["sc", "st", "obc", "scheduled caste", "scheduled tribe",
                     "other backward class", "other backward caste"]

        if not category:
            missing_information.append("category (SC/ST/OBC)")
            reasons.append("Caste/category information is required for this scholarship.")
        elif any(c in category for c in sc_st_obc):
            passed_checks.append("Applicant belongs to SC/ST/OBC category — meets category condition.")
        else:
            failed_checks.append("This scholarship is for SC/ST/OBC category students.")
            failed_conditions.append("Applicant does not belong to SC/ST/OBC category.")
            reasons.append("This scholarship is specifically for SC, ST, and OBC students.")

        student_status = clean_text(user.student_status)
        if student_status in ["regular course", "regular", "regular course student"]:
            passed_checks.append("Applicant is a regular course student.")
        elif not student_status:
            missing_information.append("student/course status")
            reasons.append("Student status is required for scholarship eligibility.")

    # =========================================================
    # Stand-Up India (SC/ST or Women, entrepreneur)
    # =========================================================

    elif "stand-up india" in scheme_name or "standup india" in scheme_name:

        category = clean_text(user.category)
        gender = clean_text(user.gender)
        sc_st = ["sc", "st", "scheduled caste", "scheduled tribe"]

        is_sc_st = any(c in category for c in sc_st)
        is_woman = gender in ["female", "woman", "women"]

        if is_sc_st or is_woman:
            passed_checks.append("Applicant meets category/gender condition (SC/ST or Woman).")
        elif not category and not gender:
            missing_information.append("category and gender")
            reasons.append("Stand-Up India is for SC/ST or women entrepreneurs.")
        else:
            failed_checks.append("Stand-Up India is for SC/ST or women entrepreneurs.")
            failed_conditions.append("Applicant does not meet SC/ST or women category condition.")
            reasons.append("Stand-Up India scheme specifically supports SC/ST and women entrepreneurs.")

        if user.age is not None and user.age >= 18:
            passed_checks.append("Applicant is 18 years or older.")
        elif user.age is None:
            missing_information.append("age")

        existing_business = clean_text(user.existing_business)
        if existing_business in ["no", "none", "not started", "new business"]:
            passed_checks.append("Applicant is proposing a greenfield (new) enterprise.")
        elif existing_business:
            failed_checks.append("Stand-Up India is for greenfield (new) enterprises only.")
            failed_conditions.append("Applicant already has an existing business.")
            reasons.append("Stand-Up India loan is for new (greenfield) enterprises only.")
        else:
            missing_information.append("enterprise status (new or existing)")

    # =========================================================
    # PMMVY – Maternity Benefit (pregnant women, 19+)
    # =========================================================

    elif (
        "matru vandana" in scheme_name
        or "pmmvy" in scheme_name
        or "maternity benefit" in scheme_name
    ):

        gender = clean_text(user.gender)
        if gender not in ["female", "woman"]:
            if not gender:
                missing_information.append("gender")
                reasons.append("Gender information is required for PMMVY eligibility.")
            else:
                failed_checks.append("PMMVY is for pregnant women and lactating mothers.")
                failed_conditions.append("Applicant is not female.")
                reasons.append("PMMVY benefit is exclusively for pregnant women and lactating mothers.")
        else:
            passed_checks.append("Applicant is female — meets gender condition for PMMVY.")

        if user.age is None:
            missing_information.append("age")
            reasons.append("Age must be 19 or above for PMMVY.")
        elif user.age >= 19:
            passed_checks.append("Applicant is 19 years or older.")
        else:
            failed_checks.append("Applicant must be at least 19 years old for PMMVY.")
            failed_conditions.append("Applicant is below 19 years.")
            reasons.append("PMMVY requires the applicant to be at least 19 years of age.")

    # =========================================================
    # DAY-NRLM – Rural Livelihood (rural women, SHG)
    # =========================================================

    elif (
        "nrlm" in scheme_name
        or "national rural livelihood" in scheme_name
        or "deendayal antyodaya" in scheme_name
    ):

        gender = clean_text(user.gender)
        if gender in ["female", "woman"]:
            passed_checks.append("Applicant is female — primary target of DAY-NRLM.")
        elif not gender:
            missing_information.append("gender")
            reasons.append("Gender information is useful for DAY-NRLM eligibility.")
        else:
            passed_checks.append(
                "DAY-NRLM primarily targets rural women. "
                "Please confirm this applies to your household."
            )

        state = clean_text(user.state)
        if state:
            passed_checks.append(f"State information available: {state}.")
        else:
            missing_information.append("state")
            reasons.append("State information is required as DAY-NRLM is implemented through state missions.")

    # =========================================================
    # NAPS – Apprenticeship (14+, student/unemployed)
    # =========================================================

    elif (
        "apprenticeship" in scheme_name
        or "naps" in scheme_name
    ):

        if user.age is None:
            missing_information.append("age")
            reasons.append("Age is required for NAPS eligibility (minimum 14 years).")
        elif user.age >= 14:
            passed_checks.append("Applicant is 14 years or older — meets NAPS age condition.")
        else:
            failed_checks.append("Minimum age for NAPS is 14 years.")
            failed_conditions.append("Applicant is below 14 years of age.")
            reasons.append("NAPS requires the applicant to be at least 14 years old.")

    # =========================================================
    # AAY – Antyodaya Anna Yojana (poorest BPL families)
    # =========================================================

    elif (
        "antyodaya anna" in scheme_name
        or "aay" in scheme_name
    ):

        passed_checks.append(
            "AAY is for the poorest of poor BPL households. "
            "Beneficiaries are identified by state government from BPL surveys."
        )
        reasons.append(
            "AAY eligibility is determined by the state government based on BPL survey. "
            "Contact your Gram Panchayat or local ration office."
        )

    # =========================================================
    # SISFS – Startup India Seed Fund (DPIIT startup)
    # =========================================================

    elif (
        "seed fund" in scheme_name
        or "sisfs" in scheme_name
        or "startup india" in scheme_name
    ):

        if user.age is None:
            missing_information.append("age")
            reasons.append("Age information is needed (must be 18+).")
        elif user.age >= 18:
            passed_checks.append("Applicant is 18 years or older.")
        else:
            failed_checks.append("Must be at least 18 years old.")
            failed_conditions.append("Applicant is below 18 years.")
            reasons.append("Startup India Seed Fund requires the founder to be at least 18 years old.")

        existing_business = clean_text(user.existing_business)
        if not existing_business:
            missing_information.append("startup/business status")
            reasons.append("Information about your startup is required for SISFS eligibility.")
        else:
            passed_checks.append(
                "SISFS is for DPIIT-recognised startups. Ensure your startup is recognised "
                "at startupindia.gov.in before applying."
            )

    # =========================================================
    # PM SVANidhi – Street Vendor Loan
    # =========================================================

    elif (
        "svanidhi" in scheme_name
        or "street vendor" in scheme_name
        or "atma nirbhar nidhi" in scheme_name
    ):

        if user.age is None:
            missing_information.append("age")
            reasons.append("Age is required (must be 18+ for PM SVANidhi).")
        elif user.age >= 18:
            passed_checks.append("Applicant is 18 years or older.")
        else:
            failed_checks.append("Must be at least 18 years old.")
            failed_conditions.append("Applicant is below 18 years.")
            reasons.append("PM SVANidhi requires the applicant to be at least 18 years old.")

        passed_checks.append(
            "PM SVANidhi is for street vendors with ULB-issued vending certificate. "
            "Please confirm you have a vending certificate or Town Vending Committee recommendation."
        )


def evaluate_eligibility(user, scheme):
    """
    Main GovGuide eligibility engine.

    Returns:
        eligible
        status
        score
        passed checks
        failed checks
        missing checks
        reasons
        failed conditions
        missing information
    """

    passed_checks = []
    failed_checks = []
    missing_checks = []

    reasons = []

    failed_conditions = []
    missing_information = []

    # =========================================================
    # AGE
    # =========================================================

    if scheme.min_age is not None:

        if user.age is None:

            missing_information.append("age")

            missing_checks.append(
                f"Age must be at least {scheme.min_age}."
            )

            reasons.append(
                "Age information is required."
            )

        elif user.age >= scheme.min_age:

            passed_checks.append(
                f"Age is at least {scheme.min_age}."
            )

        else:

            failed_checks.append(
                f"Age must be at least {scheme.min_age}."
            )

            failed_conditions.append(
                f"Applicant age is below {scheme.min_age}."
            )

            reasons.append(
                f"The applicant must be at least {scheme.min_age} years old."
            )

    # =========================================================
    # MAX AGE
    # =========================================================

    if scheme.max_age is not None:

        if user.age is None:

            if "age" not in missing_information:

                missing_information.append("age")

        elif user.age <= scheme.max_age:

            passed_checks.append(
                f"Age is within the maximum limit of {scheme.max_age}."
            )

        else:

            failed_checks.append(
                f"Age must not exceed {scheme.max_age}."
            )

            failed_conditions.append(
                f"Applicant age is above {scheme.max_age}."
            )

            reasons.append(
                f"The applicant must not exceed {scheme.max_age} years."
            )

    # =========================================================
    # STATE
    # =========================================================

    scheme_state = clean_text(scheme.state)
    user_state = clean_text(user.state)

    if scheme_state and scheme_state not in [
        "all",
        "all india",
        "india"
    ]:

        if not user_state:

            missing_information.append("state")

            reasons.append(
                "State information is required."
            )

        elif scheme_state == user_state:

            passed_checks.append(
                "Applicant state matches the scheme."
            )

        else:

            failed_checks.append(
                "Applicant state matches the scheme."
            )

            failed_conditions.append(
                "Applicant state does not match the scheme."
            )

            reasons.append(
                "The applicant's state does not match the configured scheme state."
            )

    elif not user_state:

        missing_information.append("state")

        reasons.append(
            "State information is useful for scheme verification."
        )

    else:

        passed_checks.append(
            "Applicant state is available."
        )

    # =========================================================
    # OCCUPATION
    # =========================================================

    scheme_occupation = clean_text(
        scheme.occupation
    )

    user_occupation = clean_text(
        user.occupation
    )

    if scheme_occupation and scheme_occupation not in [
        "all",
        "any"
    ]:

        if not user_occupation:

            missing_information.append(
                "occupation"
            )

            reasons.append(
                "Occupation information is required."
            )

        elif scheme_occupation == user_occupation:

            passed_checks.append(
                "Applicant occupation matches the scheme."
            )

        else:

            # Don't automatically fail here for schemes
            # where occupation is only a broad target category.
            failed_checks.append(
                "Applicant occupation matches the scheme."
            )

            failed_conditions.append(
                "Applicant occupation does not match the configured scheme occupation."
            )

            reasons.append(
                "The applicant's occupation does not match the configured target occupation."
            )

    # =========================================================
    # INCOME
    # =========================================================

    if scheme.max_income is not None:

        income = parse_income(
            user.annual_income
        )

        if income is None:

            missing_information.append(
                "annual income"
            )

            reasons.append(
                "Annual income is required to verify the income condition."
            )

        elif income <= scheme.max_income:

            passed_checks.append(
                f"Annual income is within ₹{scheme.max_income:,.0f}."
            )

        else:

            failed_checks.append(
                f"Annual income should not exceed ₹{scheme.max_income:,.0f}."
            )

            failed_conditions.append(
                "Applicant income exceeds the configured income limit."
            )

            reasons.append(
                f"The applicant's estimated annual income exceeds the scheme limit of ₹{scheme.max_income:,.0f}."
            )

    elif user.annual_income:

        passed_checks.append(
            "Annual income information is available."
        )

    else:

        missing_information.append(
            "annual income"
        )

        reasons.append(
            "Annual income information is useful for eligibility verification."
        )

    # =========================================================
    # CATEGORY
    # =========================================================

    if not user.category:

        missing_information.append(
            "category"
        )

    else:

        passed_checks.append(
            "Applicant category information is available."
        )

    # =========================================================
    # REQUIREMENT
    # =========================================================

    if scheme.requirement:

        scheme_requirement = clean_text(
            scheme.requirement
        )

        user_requirement = clean_text(
            user.requirement
        )

        if not user_requirement:

            missing_information.append(
                "requirement"
            )

            reasons.append(
                "The user's requirement is required for better scheme matching."
            )

        elif scheme_requirement in user_requirement:

            passed_checks.append(
                "User requirement matches the scheme."
            )

        else:

            # Requirement mismatch should contribute to
            # matching but is not always a hard government rule.
            failed_checks.append(
                "User requirement matches the scheme."
            )

            reasons.append(
                "The user's stated requirement does not closely match the configured scheme purpose."
            )

    # =========================================================
    # SCHEME-SPECIFIC RULES
    # =========================================================

    check_scheme_specific_rules(
        user=user,
        scheme=scheme,
        passed_checks=passed_checks,
        failed_checks=failed_checks,
        missing_checks=missing_checks,
        reasons=reasons,
        failed_conditions=failed_conditions,
        missing_information=missing_information
    )

    # =========================================================
    # REMOVE DUPLICATES
    # =========================================================

    passed_checks = list(
        dict.fromkeys(passed_checks)
    )

    failed_checks = list(
        dict.fromkeys(failed_checks)
    )

    missing_checks = list(
        dict.fromkeys(missing_checks)
    )

    reasons = list(
        dict.fromkeys(reasons)
    )

    failed_conditions = list(
        dict.fromkeys(failed_conditions)
    )

    missing_information = list(
        dict.fromkeys(missing_information)
    )

    # =========================================================
    # SCORE
    # =========================================================

    total_checks = (
        len(passed_checks)
        + len(failed_checks)
        + len(missing_checks)
    )

    if total_checks == 0:

        score = 0

    else:

        score = round(
            (
                len(passed_checks)
                / total_checks
            ) * 100
        )

    # =========================================================
    # STATUS
    # =========================================================

    if failed_conditions:

        status = "not_eligible"
        eligible = False

    elif missing_information or missing_checks:

        status = "information_required"
        eligible = False

    else:

        status = "eligible"
        eligible = True

    # =========================================================
    # NEXT STEP
    # =========================================================

    if status == "eligible":

        next_step = (
            "Review the official scheme details and "
            "prepare the required documents before applying."
        )

    elif status == "information_required":

        next_step = (
            "Provide the missing information so GovGuide "
            "can complete the eligibility analysis."
        )

    else:

        next_step = (
            "Review the eligibility gaps and check whether "
            "another government scheme may better match your profile."
        )

    # =========================================================
    # FINAL RESULT
    # =========================================================

    return {
        "eligible": eligible,

        "status": status,

        "score": score,

        "passed_checks": passed_checks,

        "failed_checks": failed_checks,

        "missing_checks": missing_checks,

        "reasons": reasons,

        "failed_conditions": failed_conditions,

        "missing_information": missing_information,

        # Compatibility with existing frontend/backend
        "missing": (
            failed_conditions
            + missing_information
        ),

        "next_step": next_step
    }


# Alias for backward compatibility
check_eligibility = evaluate_eligibility
