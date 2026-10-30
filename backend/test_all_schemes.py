from app.database import SessionLocal
from app.models import User, Scheme
from app.agents.eligibility_agent import evaluate_eligibility
from app.agents.document_agent import analyze_missing_information
from app.agents.opportunity_gap_agent import analyze_opportunity_gap
from app.agents.action_plan_agent import generate_action_plan
from app.agents.application_agent import prepare_application
from app.agents.reminder_agent import generate_reminders

db = SessionLocal()
schemes = {s.name: s for s in db.query(Scheme).all()}
print("Loaded schemes:", list(schemes.keys()))

def get_scheme(query):
    for name, s in schemes.items():
        if query.lower() in name.lower():
            return s
    return None

def run_test(case_name, user_attrs, scheme_query):
    print(f"\n==========================================")
    print(f"CASE: {case_name} -> {scheme_query}")
    print(f"==========================================")
    u = User(id=999, name="Test User", email="test@example.com", **user_attrs)
    s = get_scheme(scheme_query)
    if not s:
        print(f"ERROR: Scheme '{scheme_query}' not found!")
        return

    el = evaluate_eligibility(u, s)
    doc = analyze_missing_information(u, s, el)
    opp = analyze_opportunity_gap(u, s, el, doc)
    plan = generate_action_plan(u, s, el, doc)
    app_res = prepare_application(u, s, el, doc)
    rem = generate_reminders(s, plan["steps"], doc["required_documents"])

    print(f"Status: {el['status'].upper()} (Score: {el['score']}%)")
    print(f"Reasons / Matched Checks: {el['reasons']}")
    print(f"Failed Conditions: {el['failed_conditions']}")
    print(f"Missing Information: {el['missing_information']}")
    print(f"Opportunity Title: {opp['title']}")
    print(f"Opportunity Message: {opp['message']}")
    print(f"Opportunity Gaps: {opp['gaps']}")
    print(f"Future Opportunity?: {opp['future_opportunity']}")
    print(f"Action Plan Steps Count: {len(plan['steps'])}")
    for step in plan['steps']:
        print(f"  Step {step['step']}: [{step['priority']}] {step['title']} ({step['type']})")
    print(f"Reminders Count: {len(rem['reminders'])}")
    for r in rem['reminders']:
        print(f"  [{r['type'].upper()}] {r['title']}")
    print(f"Application Status: {app_res['application_status']}")

# Case 1: PM-KISAN eligible
run_test(
    "Step 1: Farmer Eligible",
    {
        "age": 40, "gender": "Male", "state": "Tamil Nadu",
        "occupation": "Farmer", "annual_income": 50000,
        "category": "General", "requirement": "Agriculture",
        "land_holding": 1.5
    },
    "PM-KISAN"
)

# Case 2: PM-KISAN not eligible (Student with no land)
run_test(
    "Step 2: Student Ineligible for PM-KISAN",
    {
        "age": 21, "gender": "Male", "state": "Tamil Nadu",
        "occupation": "Student", "annual_income": 50000,
        "category": "General", "requirement": "Education",
        "land_holding": None
    },
    "PM-KISAN"
)

# Case 3: PMEGP applicant
run_test(
    "Step 3: PMEGP Entrepreneur",
    {
        "age": 25, "gender": "Male", "state": "Tamil Nadu",
        "occupation": "Self Employed", "annual_income": 50000,
        "category": "General", "requirement": "Business",
        "existing_business": "No", "education_level": "Undergraduate"
    },
    "PMEGP"
)

# Case 4: PM-USP student
run_test(
    "Step 4: PM-USP Student Eligible",
    {
        "age": 21, "gender": "Female", "state": "Tamil Nadu",
        "occupation": "Student", "annual_income": 50000,
        "category": "General", "requirement": "Education",
        "education_level": "12th", "student_status": "Regular course",
        "class12_percentile": 90.0, "other_scholarship": "No"
    },
    "PM-USP"
)
