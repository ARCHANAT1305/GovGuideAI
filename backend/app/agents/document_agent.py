import re
from typing import TypedDict

from ..models import Scheme, User


# ============================================================
# TYPES
# ============================================================

class InformationDetail(TypedDict):
    field: str
    label: str
    why_needed: str
    how_to_obtain: str
    priority: str


class DocumentDetail(TypedDict):
    name: str
    why_needed: str
    how_to_obtain: str
    priority: str


class DocumentAnalysis(TypedDict):
    status: str
    summary: str
    completeness_score: int
    missing_information: list[str]
    required_documents: list[str]
    information_details: list[InformationDetail]
    document_details: list[DocumentDetail]
    total_missing_information: int
    total_required_documents: int
    next_step: str


# ============================================================
# HELPERS
# ============================================================

def clean_list(value: str | None) -> list[str]:
    """
    Split a comma/semicolon/newline-separated string into a
    de-duplicated list of clean strings.
    """
    if not value:
        return []

    items: list[str] = []
    seen: set[str] = set()

    for item in re.split(r"[,;\n]+", value):
        clean = re.sub(r"^[\s\-•]+|[\s.]+$", "", item)
        key = clean.casefold()
        if clean and key not in seen:
            items.append(clean)
            seen.add(key)

    return items


# ============================================================
# DOCUMENT REQUIREMENTS PER SCHEME
# ============================================================

_SCHEME_DOCUMENT_DETAILS: dict[str, list[DocumentDetail]] = {

    "PM-KISAN": [
        {
            "name": "Aadhaar Card",
            "why_needed": "Identity and biometric verification required by PM-KISAN.",
            "how_to_obtain": "Visit your nearest Aadhaar Seva Kendra or enrol at a bank branch.",
            "priority": "High",
        },
        {
            "name": "Land Records / Khasra-Khatauni",
            "why_needed": "Proves landholding status of the farmer family.",
            "how_to_obtain": "Obtain from the Patwari or Tehsildar office or the state land-records portal.",
            "priority": "High",
        },
        {
            "name": "Bank Passbook (first page)",
            "why_needed": "Direct-benefit-transfer requires a verified bank account.",
            "how_to_obtain": "Available at your bank branch. Ensure the account is Aadhaar-linked.",
            "priority": "High",
        },
    ],

    "PMEGP": [
        {
            "name": "Aadhaar Card",
            "why_needed": "Mandatory identity proof for PMEGP application.",
            "how_to_obtain": "Visit your nearest Aadhaar Seva Kendra or enrol at a bank branch.",
            "priority": "High",
        },
        {
            "name": "Educational Certificate (Class VIII or above)",
            "why_needed": "PMEGP requires a minimum education qualification.",
            "how_to_obtain": "Obtain from the issuing school/board or apply for a duplicate via the state board.",
            "priority": "High",
        },
        {
            "name": "Project Report / Business Plan",
            "why_needed": "Required to assess the viability of the proposed business.",
            "how_to_obtain": "Prepare with the help of a KVIC/KVIB district office or a chartered accountant.",
            "priority": "High",
        },
        {
            "name": "Caste Certificate (if applicable)",
            "why_needed": "Required for SC/ST/OBC category applicants to avail higher subsidy.",
            "how_to_obtain": "Obtain from the tehsildar or SDM office in your district.",
            "priority": "Medium",
        },
    ],

    "PM-USP CSSS": [
        {
            "name": "Class XII Mark Sheet",
            "why_needed": "Proves the minimum 80th percentile score required for the scholarship.",
            "how_to_obtain": "Available from your school or the issuing board office.",
            "priority": "High",
        },
        {
            "name": "Bonafide / Enrollment Certificate",
            "why_needed": "Confirms the applicant is a regular student at the institution.",
            "how_to_obtain": "Request from the administrative office of your college/university.",
            "priority": "High",
        },
        {
            "name": "Income Certificate",
            "why_needed": "Required to verify family income is within the prescribed limit.",
            "how_to_obtain": "Obtain from the tehsildar or SDM office; some states issue it via e-District portals.",
            "priority": "High",
        },
        {
            "name": "Bank Account Details",
            "why_needed": "Scholarship amount is transferred directly to the student's account.",
            "how_to_obtain": "Available in your bank passbook. Ensure the account is Aadhaar-linked.",
            "priority": "High",
        },
    ],
}


# ============================================================
# INFORMATION FIELD METADATA
# ============================================================

_FIELD_METADATA: dict[str, dict[str, str]] = {
    "age": {
        "label": "Age",
        "why_needed": "Age is used to verify eligibility thresholds set by the scheme.",
        "how_to_obtain": "Provide your date of birth from your Aadhaar card or birth certificate.",
        "priority": "High",
    },
    "gender": {
        "label": "Gender",
        "why_needed": "Some schemes target specific genders.",
        "how_to_obtain": "Select from your profile settings.",
        "priority": "Medium",
    },
    "state": {
        "label": "State",
        "why_needed": "Many schemes are state-specific or have state-level quotas.",
        "how_to_obtain": "Select your state of residence in your profile.",
        "priority": "High",
    },
    "occupation": {
        "label": "Occupation",
        "why_needed": "Schemes often target specific occupational groups (e.g., farmers, students).",
        "how_to_obtain": "Select the option that best describes your current primary occupation.",
        "priority": "High",
    },
    "annual_income": {
        "label": "Annual Income",
        "why_needed": "Income limits are a common eligibility criterion.",
        "how_to_obtain": "Refer to your income certificate or last year's tax return.",
        "priority": "High",
    },
    "category": {
        "label": "Category (General / SC / ST / OBC)",
        "why_needed": "Caste category determines subsidy rates and reserved quotas.",
        "how_to_obtain": "Check your caste certificate issued by the competent authority.",
        "priority": "High",
    },
    "land_holding": {
        "label": "Land Holding",
        "why_needed": "PM-KISAN requires the applicant to be a landholding farmer family.",
        "how_to_obtain": "Check your land records (Khasra-Khatauni) from the Patwari office.",
        "priority": "High",
    },
    "education_level": {
        "label": "Education Level",
        "why_needed": "PMEGP mandates a minimum educational qualification (Class VIII or above).",
        "how_to_obtain": "Select the highest level of education you have completed.",
        "priority": "High",
    },
    "student_status": {
        "label": "Student Status",
        "why_needed": "PM-USP CSSS is available only to regular (full-time) students.",
        "how_to_obtain": "Select whether you are a regular or part-time student.",
        "priority": "High",
    },
    "class12_percentile": {
        "label": "Class XII Percentile",
        "why_needed": "PM-USP CSSS requires a minimum 80th percentile in Class XII.",
        "how_to_obtain": "Find your percentile on your Class XII mark sheet or board result.",
        "priority": "High",
    },
    "existing_business": {
        "label": "Existing Business",
        "why_needed": "PMEGP is only for new enterprises; existing business owners are not eligible.",
        "how_to_obtain": "Indicate whether you currently own or operate a business.",
        "priority": "High",
    },
    "other_scholarship": {
        "label": "Other Scholarship",
        "why_needed": "PM-USP CSSS cannot be combined with another central-government scholarship.",
        "how_to_obtain": "Indicate whether you currently receive any other government scholarship.",
        "priority": "High",
    },
}


# Standard guidance for common Indian government documents
_STANDARD_DOCUMENT_GUIDE: dict[str, dict[str, str]] = {
    "aadhaar": {
        "why_needed": "Mandatory identity and biometric proof required across all DBT government schemes.",
        "how_to_obtain": "Visit your nearest Aadhaar Seva Kendra, post office, or participating bank. Book an appointment online at uidai.gov.in.",
        "priority": "High"
    },
    "pan": {
        "why_needed": "Required for financial transactions, subsidy loans, bank account verification, and tax audits.",
        "how_to_obtain": "Apply online at onlineservices.nsdl.com (Protean) or utiitsl.com. e-PAN can be generated instantly via incometax.gov.in using Aadhaar e-KYC.",
        "priority": "High"
    },
    "bank": {
        "why_needed": "Direct Benefit Transfer (DBT) requires a verified, active savings bank account linked to Aadhaar.",
        "how_to_obtain": "Open a zero-balance Jan Dhan or regular savings account at any nationalized/commercial bank branch or post office.",
        "priority": "High"
    },
    "income": {
        "why_needed": "Verifies that your family/annual household income falls below the scheme ceiling.",
        "how_to_obtain": "Apply through your State's e-District portal or visit your local Revenue Office / Tehsildar / Taluk office with salary slips or ration card.",
        "priority": "High"
    },
    "caste": {
        "why_needed": "Required for SC / ST / OBC applicants to access reserved quota subsidies, scholarships, and fee waivers.",
        "how_to_obtain": "Apply via your State e-District portal or Tehsildar/SDM office with parents' school leaving certificates and domicile proof.",
        "priority": "High"
    },
    "land": {
        "why_needed": "Verifies cultivable agricultural landownership and prevents ineligible applicants from receiving farmer subsidies.",
        "how_to_obtain": "Download computerized RoR / Khasra-Khatauni / Patta copy from your State Land Records portal (e.g. Bhulekh, AnyRoR, Bhoomi) or village Patwari.",
        "priority": "High"
    },
    "education": {
        "why_needed": "Confirms prerequisite educational qualification or percentile criteria.",
        "how_to_obtain": "Obtain from your school, university, or state education board. You can also fetch certified digital copies from DigiLocker.",
        "priority": "High"
    },
    "mark sheet": {
        "why_needed": "Proves academic scores and percentage thresholds required for merit scholarships.",
        "how_to_obtain": "Issued by your examination board (CBSE/ICSE/State Board) or download directly from DigiLocker.",
        "priority": "High"
    },
    "ration": {
        "why_needed": "Proves household economic status (BPL / AAY) for subsidized food grains and targeted welfare.",
        "how_to_obtain": "Apply through your State Food & Civil Supplies portal or Gram Panchayat / Block Development Office (BDO).",
        "priority": "High"
    },
    "residence": {
        "why_needed": "Proves state domicile or local residency for state-specific welfare benefits.",
        "how_to_obtain": "Apply on your State e-District portal or Tehsildar office with electricity bill, voter ID, or property tax receipt.",
        "priority": "Medium"
    },
    "photo": {
        "why_needed": "Required for beneficiary identity verification and identity card generation.",
        "how_to_obtain": "Keep 2–4 recent passport-size color photographs with a clean white/light background.",
        "priority": "Medium"
    },
    "business": {
        "why_needed": "Outlines business viability, cost estimates, and employment potential for loan approval.",
        "how_to_obtain": "Prepare with your District Industries Centre (DIC), KVIC nodal office, or a certified Chartered Accountant (CA).",
        "priority": "High"
    },
    "vending": {
        "why_needed": "Mandatory for street vendor loans to prove urban street vending activity.",
        "how_to_obtain": "Issued by your Urban Local Body (Municipality/Corporation) or Town Vending Committee (TVC).",
        "priority": "High"
    }
}


def get_required_documents(scheme: Scheme) -> list[DocumentDetail]:
    """
    Return rich document details for the given scheme.
    Matches scheme-specific details or maps standard documents with step-by-step guidance on how to obtain them.
    """
    # Try scheme-specific rich data first
    details = _SCHEME_DOCUMENT_DETAILS.get(scheme.name)
    if details:
        return details

    # Fallback: parse the plain text documents column and attach rich guidance
    fallback: list[DocumentDetail] = []
    for doc_name in clean_list(scheme.documents):
        doc_lower = doc_name.lower()
        matched_guide = None

        for key, guide in _STANDARD_DOCUMENT_GUIDE.items():
            if key in doc_lower:
                matched_guide = guide
                break

        if matched_guide:
            fallback.append({
                "name": doc_name,
                "why_needed": matched_guide["why_needed"],
                "how_to_obtain": matched_guide["how_to_obtain"],
                "priority": matched_guide["priority"],
            })
        else:
            fallback.append({
                "name": doc_name,
                "why_needed": "Mandatory document for application verification.",
                "how_to_obtain": "Obtain through the issuing government authority, CSC centre, or official state portal.",
                "priority": "High",
            })
    return fallback


# ============================================================
# MAIN FUNCTION
# ============================================================

def analyze_missing_information(
    user: User,
    scheme: Scheme,
    eligibility_result: dict,
) -> DocumentAnalysis:
    """
    Analyze what information and documents are missing for the
    given user-scheme pair, using the pre-computed
    eligibility_result so we never duplicate the check.
    """

    # --------------------------------------------------------
    # MISSING PROFILE INFORMATION
    # --------------------------------------------------------

    raw_missing: list[str] = list(
        eligibility_result.get("missing_information", [])
    )

    information_details: list[InformationDetail] = []

    for field in raw_missing:
        meta = _FIELD_METADATA.get(field, {})
        information_details.append({
            "field": field,
            "label": meta.get("label", field.replace("_", " ").title()),
            "why_needed": meta.get(
                "why_needed",
                "Required to complete the eligibility check.",
            ),
            "how_to_obtain": meta.get(
                "how_to_obtain",
                "Update your profile with the relevant information.",
            ),
            "priority": meta.get("priority", "High"),
        })

    missing_information_labels: list[str] = [
        d["label"] for d in information_details
    ]

    # --------------------------------------------------------
    # REQUIRED DOCUMENTS
    # --------------------------------------------------------

    document_details = get_required_documents(scheme)

    required_documents: list[str] = [
        d["name"] for d in document_details
    ]

    # --------------------------------------------------------
    # COMPLETENESS SCORE
    # --------------------------------------------------------

    total_items = len(information_details) + len(document_details)

    if total_items == 0:
        completeness_score = 100
    else:
        missing_count = len(information_details)
        completeness_score = max(
            0,
            int(((total_items - missing_count) / total_items) * 100),
        )

    # --------------------------------------------------------
    # STATUS & SUMMARY
    # --------------------------------------------------------

    status = eligibility_result.get("status", "information_required")

    if status == "eligible":
        summary = (
            "All required profile information is available. "
            "Collect the listed documents to begin your application."
        )
    elif status == "not_eligible":
        summary = (
            "You do not currently meet one or more eligibility "
            "conditions for this scheme."
        )
    else:
        summary = (
            f"{len(information_details)} piece(s) of profile "
            "information are missing. Please complete your profile "
            "so GovGuide can determine your eligibility accurately."
        )

    # --------------------------------------------------------
    # NEXT STEP
    # --------------------------------------------------------

    if information_details:
        next_step = (
            "Complete the missing profile fields listed above "
            "so GovGuide can finish the eligibility check."
        )
    elif status == "eligible" and document_details:
        next_step = (
            "Collect the required documents listed above "
            "and submit your application."
        )
    elif scheme.official_url:
        next_step = (
            "Review the official programme details to confirm "
            "the current document requirements."
        )
    else:
        next_step = (
            "Contact the programme administrator to confirm "
            "current document requirements."
        )

    # --------------------------------------------------------
    # RETURN
    # --------------------------------------------------------

    return {
        "status": status,
        "summary": summary,
        "completeness_score": completeness_score,
        "missing_information": missing_information_labels,
        "required_documents": required_documents,
        "information_details": information_details,
        "document_details": document_details,
        "total_missing_information": len(information_details),
        "total_required_documents": len(document_details),
        "next_step": next_step,
    }
