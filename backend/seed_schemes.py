from app.database import SessionLocal, engine, Base, ensure_scheme_metadata_columns
from app.models import Scheme

# Create tables if they do not exist and ensure columns exist
Base.metadata.create_all(bind=engine)
ensure_scheme_metadata_columns()

db = SessionLocal()

# Remove old schemes and replace with full list
db.query(Scheme).delete()


real_schemes = [

    # ==========================================================
    # 1. PM-KISAN
    # ==========================================================
    Scheme(
        name="PM-KISAN",
        description=(
            "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme "
            "that provides income support to eligible landholding farmer families."
        ),
        state="All India",
        category="All",
        occupation="Farmer",
        min_age=None,
        max_age=None,
        max_income=None,
        requirement="agriculture",
        eligibility_rules=(
            "Applicant should belong to an eligible landholding farmer family with "
            "cultivable land as per PM-KISAN guidelines. State/UT authorities identify "
            "eligible beneficiaries. Certain exclusion categories apply. eKYC is "
            "mandatory for registered beneficiaries."
        ),
        benefits="₹6,000 per year per eligible farmer family, provided in three equal installments of ₹2,000 each.",
        documents=(
            "Aadhaar details, mobile number, bank account details, land ownership/land "
            "record information and other documents required by the concerned authorities."
        ),
        official_url="https://pmkisan.gov.in/",
        application_process=(
            "Eligible farmers can use the official PM-KISAN portal and the registration "
            "process provided by the government. Land and beneficiary details are verified "
            "through the concerned State/UT authorities."
        ),
        eligibility_notes=(
            "Eligibility depends on landholding and exclusion conditions. Occupation as "
            "'Farmer' alone is not sufficient to establish eligibility."
        ),
        source_name="PM-KISAN Official Portal",
        source_url="https://pmkisan.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 2. PMEGP
    # ==========================================================
    Scheme(
        name="Prime Minister's Employment Generation Programme (PMEGP)",
        description=(
            "PMEGP is a credit-linked subsidy programme for setting up new micro "
            "enterprises and generating employment opportunities."
        ),
        state="All India",
        category="All",
        occupation="Entrepreneur",
        min_age=18,
        max_age=None,
        max_income=None,
        requirement="business",
        eligibility_rules=(
            "Applicant must be above 18 years of age. Aadhaar authentication is required. "
            "Only new projects are eligible. One person per family can receive assistance. "
            "No income ceiling for setting up projects. For projects above ₹10 lakh in "
            "manufacturing or above ₹5 lakh in service sector, applicant should have at "
            "least VIII standard qualification."
        ),
        benefits=(
            "Credit-linked subsidy of 15–35% of project cost for urban/rural beneficiaries. "
            "Margin money subsidy provided through KVIC/KVIB/DIC."
        ),
        documents=(
            "Aadhaar, PAN, address details, qualification details, project report and "
            "project-related information. Additional documents may be required during "
            "application and verification."
        ),
        official_url="https://www.pmegp.msme.gov.in/",
        application_process=(
            "Applicants can submit an online application through the official PMEGP portal. "
            "The application contains personal information, Aadhaar, PAN, social category, "
            "qualification, project details, financing information and other required details."
        ),
        eligibility_notes=(
            "PMEGP is intended for new eligible projects. Existing business status, project "
            "type, project cost and qualification requirements must be checked before application."
        ),
        source_name="PMEGP Official Portal",
        source_url="https://www.pmegp.msme.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 3. PM-USP CSSS (Scholarship)
    # ==========================================================
    Scheme(
        name="PM-USP Central Sector Scheme of Scholarship for College and University Students",
        description=(
            "PM-USP CSSS is a merit-cum-means scholarship scheme for meritorious students "
            "pursuing regular higher education."
        ),
        state="All India",
        category="All",
        occupation="Student",
        min_age=None,
        max_age=None,
        max_income=450000,
        requirement="education",
        eligibility_rules=(
            "For fresh applicants, the student should be above the 80th percentile of "
            "successful candidates in the relevant stream from Class XII board. The student "
            "should be pursuing a regular course (not correspondence or distance education). "
            "Family income should not exceed ₹4.5 lakh per year. The student should not be "
            "receiving another scholarship or fee reimbursement."
        ),
        benefits=(
            "₹10,000 per year for undergraduate students and ₹20,000 per year for "
            "postgraduate students. Scholarship provided for up to 5 years."
        ),
        documents=(
            "Class XII marksheet, family income certificate, category/caste certificate "
            "where applicable, bank account details and other documents required through "
            "the National Scholarship Portal."
        ),
        official_url="https://scholarships.gov.in/Students",
        application_process=(
            "Students apply through the National Scholarship Portal. One-Time Registration "
            "(OTR) is required. Applicants must provide the required academic, income and "
            "other details and complete the verification process."
        ),
        eligibility_notes=(
            "Eligibility depends on Class XII percentile, regular course status, family "
            "income and whether another scholarship or fee reimbursement is being received."
        ),
        source_name="Ministry of Education / National Scholarship Portal",
        source_url="https://scholarships.gov.in/Students",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 4. Pradhan Mantri Awas Yojana – Urban (PMAY-U)
    # ==========================================================
    Scheme(
        name="Pradhan Mantri Awas Yojana – Urban (PMAY-U)",
        description=(
            "PMAY-U provides affordable housing to urban poor including EWS, LIG and "
            "MIG categories to achieve 'Housing for All'."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=18,
        max_age=None,
        max_income=1800000,
        requirement="housing",
        eligibility_rules=(
            "Beneficiary family should not own a pucca house in any part of India. "
            "EWS annual income up to ₹3 lakh, LIG up to ₹6 lakh, MIG-I up to ₹12 lakh, "
            "MIG-II up to ₹18 lakh. The house/flat should be in the name of female head "
            "or jointly with male head. Aadhaar is mandatory."
        ),
        benefits=(
            "Interest subsidy on home loans: EWS/LIG — 6.5% for loan up to ₹6 lakh; "
            "MIG-I — 4% for loan up to ₹9 lakh; MIG-II — 3% for loan up to ₹12 lakh. "
            "Also in-situ slum rehabilitation and affordable housing in partnership."
        ),
        documents=(
            "Aadhaar card, income certificate, bank account details, address proof, "
            "photograph, affidavit of not owning pucca house, caste certificate if applicable."
        ),
        official_url="https://pmaymis.gov.in/",
        application_process=(
            "Apply through Common Service Centres (CSC), PMAY-U portal, or through "
            "participating banks/housing finance companies. Select applicable component "
            "(CLSS/AHP/BLC/ISSR) based on your category."
        ),
        eligibility_notes=(
            "Must not own a pucca house anywhere in India. Income limit depends on category. "
            "Priority given to SC/ST, OBC, minorities, persons with disabilities, senior "
            "citizens, transgenders and single women."
        ),
        source_name="PMAY-U Official Portal",
        source_url="https://pmaymis.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 5. Pradhan Mantri Awas Yojana – Gramin (PMAY-G)
    # ==========================================================
    Scheme(
        name="Pradhan Mantri Awas Yojana – Gramin (PMAY-G)",
        description=(
            "PMAY-G provides financial assistance to rural BPL households for construction "
            "of pucca houses with basic amenities."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=18,
        max_age=None,
        max_income=None,
        requirement="housing",
        eligibility_rules=(
            "Beneficiaries are identified from SECC-2011 data. Priority given to SC/ST, "
            "freed bonded labourers, minorities, persons with disabilities, widows of "
            "defence personnel, ex-servicemen, families with no male member aged 16–59, "
            "and families with disabled members."
        ),
        benefits=(
            "₹1.20 lakh in plain areas and ₹1.30 lakh in hilly states/difficult areas "
            "and IAP districts for house construction. Additional ₹12,000 for construction "
            "of household toilet under SBM."
        ),
        documents=(
            "Aadhaar, bank account, SECC data verification, BPL card/ration card, "
            "caste certificate if applicable, land records."
        ),
        official_url="https://pmayg.nic.in/",
        application_process=(
            "Beneficiaries are selected by Gram Sabhas based on SECC 2011 data. "
            "No direct application required — contact your local Gram Panchayat or "
            "Block Development Officer."
        ),
        eligibility_notes=(
            "Selection is based on SECC 2011 deprivation and exclusion criteria. "
            "Beneficiary must not already own a pucca house."
        ),
        source_name="PMAY-G Official Portal",
        source_url="https://pmayg.nic.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 6. Ayushman Bharat – PM Jan Arogya Yojana (PMJAY)
    # ==========================================================
    Scheme(
        name="Ayushman Bharat – PM Jan Arogya Yojana (PMJAY)",
        description=(
            "PMJAY provides health cover of ₹5 lakh per family per year for secondary "
            "and tertiary care hospitalisation to poor and vulnerable families."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=None,
        max_age=None,
        max_income=None,
        requirement="health",
        eligibility_rules=(
            "Beneficiaries are identified based on SECC 2011 database for rural and "
            "occupational criteria for urban. No restriction on family size, age or gender. "
            "Existing illnesses are covered from day one."
        ),
        benefits=(
            "Health cover of ₹5 lakh per family per year for hospitalisation. Covers "
            "pre- and post-hospitalisation expenses, medicines, diagnostics. Cashless "
            "treatment at any empanelled public or private hospital in India."
        ),
        documents=(
            "Aadhaar or any valid ID proof, ration card, mobile number. "
            "Beneficiary verification done through PM-JAY portal or Ayushman App."
        ),
        official_url="https://pmjay.gov.in/",
        application_process=(
            "Check eligibility at pmjay.gov.in or dial 14555. If eligible, collect "
            "Ayushman Card from nearest Common Service Centre, Ayushman Mitra at "
            "hospitals or Gram Panchayat."
        ),
        eligibility_notes=(
            "Beneficiary list is fixed based on SECC 2011. If your name is not in the "
            "list, you may not be eligible unless your state has expanded the scheme."
        ),
        source_name="Ayushman Bharat Official Portal",
        source_url="https://pmjay.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 7. PM Mudra Yojana (PMMY)
    # ==========================================================
    Scheme(
        name="Pradhan Mantri Mudra Yojana (PMMY)",
        description=(
            "PMMY provides loans up to ₹10 lakh to non-corporate, non-farm small/micro "
            "enterprises through banks, MFIs and NBFCs."
        ),
        state="All India",
        category="All",
        occupation="Entrepreneur",
        min_age=18,
        max_age=None,
        max_income=None,
        requirement="business",
        eligibility_rules=(
            "Any Indian citizen who has a business plan for a non-farm income generating "
            "activity such as manufacturing, processing, trading or service sector and "
            "whose credit need is up to ₹10 lakh can apply. No collateral required for "
            "Shishu (up to ₹50,000) and Kishore (₹50,001–₹5 lakh) categories."
        ),
        benefits=(
            "Shishu: Loans up to ₹50,000. "
            "Kishore: Loans from ₹50,001 to ₹5 lakh. "
            "Tarun: Loans from ₹5 lakh to ₹10 lakh. "
            "No collateral required. Lower interest rates."
        ),
        documents=(
            "Identity proof (Aadhaar/PAN/Voter ID), address proof, business proof/plan, "
            "bank statements, passport-size photographs, SC/ST/OBC certificate if applicable."
        ),
        official_url="https://www.mudra.org.in/",
        application_process=(
            "Apply at any bank, NBFC or MFI that participates in PMMY. You can also "
            "apply online at mudra.org.in. Provide business plan and required documents."
        ),
        eligibility_notes=(
            "Loan is for non-farm business activities. The lending institution makes the "
            "final credit decision. Priority given to SC/ST/OBC entrepreneurs."
        ),
        source_name="MUDRA Official Portal",
        source_url="https://www.mudra.org.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 8. Sukanya Samriddhi Yojana (SSY)
    # ==========================================================
    Scheme(
        name="Sukanya Samriddhi Yojana (SSY)",
        description=(
            "Sukanya Samriddhi Yojana is a government savings scheme for the girl child, "
            "providing high interest rate and tax benefits."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=None,
        max_age=10,
        max_income=None,
        requirement="savings",
        eligibility_rules=(
            "Account can be opened for a girl child below 10 years of age. Account "
            "is opened in the name of the girl child by parent or legal guardian. "
            "Maximum two accounts per family (one per girl child). Triplets/twins "
            "allowed as exception."
        ),
        benefits=(
            "Current interest rate: 8.2% per annum (compounded annually). "
            "Minimum deposit ₹250, maximum ₹1.5 lakh per year. "
            "Tax deduction under Section 80C. Maturity after 21 years from opening."
        ),
        documents=(
            "Birth certificate of the girl child, identity and address proof of guardian "
            "(Aadhaar/PAN), photograph."
        ),
        official_url="https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=89",
        application_process=(
            "Account can be opened at any post office or authorised bank branch. "
            "Submit account opening form with required documents and initial deposit."
        ),
        eligibility_notes=(
            "Girl child must be below 10 years of age at account opening. The account "
            "matures when the girl turns 21 or upon her marriage after 18 years of age."
        ),
        source_name="National Savings Institute",
        source_url="https://www.nsiindia.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 9. Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)
    # ==========================================================
    Scheme(
        name="Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
        description=(
            "PMJJBY is a government-backed life insurance scheme offering ₹2 lakh "
            "cover for death due to any reason at a very low premium."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=18,
        max_age=50,
        max_income=None,
        requirement="insurance",
        eligibility_rules=(
            "Age between 18 and 50 years. Must have a bank or post office savings account. "
            "Must give consent for auto-debit of premium. Aadhar should be linked to the bank account."
        ),
        benefits=(
            "Life cover of ₹2 lakh in case of death due to any reason. "
            "Annual premium of only ₹436 (deducted automatically from bank account)."
        ),
        documents=(
            "Aadhaar card, bank account details (for auto-debit), enrollment form."
        ),
        official_url="https://jansuraksha.gov.in/",
        application_process=(
            "Enroll through your bank or post office. Fill the enrollment-cum-auto-debit "
            "form. Premium is auto-debited from your savings account every year in June."
        ),
        eligibility_notes=(
            "Must be enrolled before age 50 to continue till age 55. Coverage lapses if "
            "auto-debit fails or account has insufficient balance."
        ),
        source_name="Jan Suraksha Official Portal",
        source_url="https://jansuraksha.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 10. Pradhan Mantri Suraksha Bima Yojana (PMSBY)
    # ==========================================================
    Scheme(
        name="Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
        description=(
            "PMSBY is a government accident insurance scheme providing ₹2 lakh cover "
            "for accidental death or total disability at a premium of just ₹20 per year."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=18,
        max_age=70,
        max_income=None,
        requirement="insurance",
        eligibility_rules=(
            "Age between 18 and 70 years. Must have a bank or post office savings account. "
            "Aadhaar should be linked to the bank account. Auto-debit consent required."
        ),
        benefits=(
            "₹2 lakh for accidental death or total disability. "
            "₹1 lakh for partial permanent disability. "
            "Annual premium of only ₹20."
        ),
        documents=(
            "Aadhaar card, bank account details, enrollment form."
        ),
        official_url="https://jansuraksha.gov.in/",
        application_process=(
            "Enroll through your bank or post office by filling the enrollment form. "
            "Premium of ₹20 is auto-debited from your bank account every year in June."
        ),
        eligibility_notes=(
            "Covers accidental death and disability only. Not applicable for death due to "
            "illness. Coverage lapses if bank account has insufficient balance during auto-debit."
        ),
        source_name="Jan Suraksha Official Portal",
        source_url="https://jansuraksha.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 11. Atal Pension Yojana (APY)
    # ==========================================================
    Scheme(
        name="Atal Pension Yojana (APY)",
        description=(
            "APY is a government pension scheme for unorganised sector workers, "
            "guaranteeing a minimum monthly pension of ₹1,000 to ₹5,000 after age 60."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=18,
        max_age=40,
        max_income=None,
        requirement="pension",
        eligibility_rules=(
            "Age between 18 and 40 years. Must have a savings bank account or post office "
            "savings account. Must not be an income tax payer (as of Oct 2022 rule update). "
            "Must not be a beneficiary of any statutory social security scheme."
        ),
        benefits=(
            "Guaranteed monthly pension of ₹1,000 / ₹2,000 / ₹3,000 / ₹4,000 / ₹5,000 "
            "at age 60 depending on contribution. Government co-contributed 50% of "
            "subscriber's contribution or ₹1,000 per year (whichever is lower) for "
            "eligible subscribers who joined before March 2016."
        ),
        documents=(
            "Aadhaar card, mobile number, savings bank account, subscriber registration form."
        ),
        official_url="https://npscra.nsdl.co.in/nps-lite-atal-pension-yojna.php",
        application_process=(
            "Visit your bank branch or use internet banking. Fill APY subscription form. "
            "Auto-debit of monthly contribution set up from savings account."
        ),
        eligibility_notes=(
            "Income tax payers are not eligible (from October 2022). Minimum contribution "
            "period is 20 years. Pension starts at age 60."
        ),
        source_name="NPS Trust / PFRDA",
        source_url="https://npscra.nsdl.co.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 12. National Social Assistance Programme (NSAP) – Old Age
    # ==========================================================
    Scheme(
        name="National Social Assistance Programme – Indira Gandhi National Old Age Pension (IGNOAPS)",
        description=(
            "IGNOAPS under NSAP provides monthly pension to destitute elderly persons "
            "belonging to BPL households."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=60,
        max_age=None,
        max_income=None,
        requirement="pension",
        eligibility_rules=(
            "Age 60 years and above. Must belong to a BPL (Below Poverty Line) household "
            "as per state BPL list. Must be destitute with little or no regular means of "
            "subsistence from own source of income or through financial support from family "
            "members or other sources."
        ),
        benefits=(
            "Central contribution: ₹300/month for 60–79 years, ₹500/month for 80+ years. "
            "States may add additional amounts above the central contribution."
        ),
        documents=(
            "Age proof (birth certificate/school certificate/Aadhaar), BPL card/ration card, "
            "bank account details, Aadhaar, photograph, income declaration."
        ),
        official_url="https://nsap.nic.in/",
        application_process=(
            "Apply at local Gram Panchayat, Block Development Office or Municipal Office. "
            "Submit application form with required documents. State authorities verify and "
            "approve the application."
        ),
        eligibility_notes=(
            "Eligibility and pension amount may vary by state as states supplement the "
            "central contribution. Priority given to oldest and most destitute applicants."
        ),
        source_name="NSAP Official Portal",
        source_url="https://nsap.nic.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 13. PM Kaushal Vikas Yojana (PMKVY)
    # ==========================================================
    Scheme(
        name="Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
        description=(
            "PMKVY is the flagship skill development scheme providing free short-term "
            "skill training and certification to Indian youth."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=15,
        max_age=45,
        max_income=None,
        requirement="skill development",
        eligibility_rules=(
            "Indian nationals aged 15–45 years. Should be unemployed or school/college "
            "dropout. Priority given to candidates from rural areas, SC/ST/OBC, differently "
            "abled, women, minorities and candidates from North-East."
        ),
        benefits=(
            "Free skill training in 250+ job roles across sectors. "
            "Monetary reward after successful assessment and certification. "
            "Placement assistance and job fair participation. "
            "Recognition of Prior Learning (RPL) for those with existing skills."
        ),
        documents=(
            "Aadhaar card, bank account details, educational certificates, photograph, "
            "caste certificate if applicable."
        ),
        official_url="https://www.pmkvyofficial.org/",
        application_process=(
            "Register at pmkvyofficial.org or visit nearest PMKVY Training Centre. "
            "Select your preferred sector and job role. Complete training, appear for "
            "assessment and receive certification."
        ),
        eligibility_notes=(
            "Training is free of cost. After successful completion and assessment, "
            "candidates receive certification from sector skill councils."
        ),
        source_name="PMKVY Official Portal",
        source_url="https://www.pmkvyofficial.org/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 14. National Scholarship Portal – Pre-Matric Scholarship (SC/ST/OBC)
    # ==========================================================
    Scheme(
        name="Pre-Matric Scholarship for SC/ST/OBC Students (National Scholarship Portal)",
        description=(
            "Central government pre-matric scholarships for SC, ST, and OBC students "
            "studying in Classes 1 to 10 to prevent dropout and promote education."
        ),
        state="All India",
        category="SC/ST/OBC",
        occupation="Student",
        min_age=None,
        max_age=None,
        max_income=250000,
        requirement="education",
        eligibility_rules=(
            "Student must belong to SC, ST or OBC category. Must be studying in Class 1–10 "
            "in a government or government-aided school. Family income should not exceed "
            "₹2 lakh per year for SC/ST and ₹1 lakh per year for OBC (may vary by scheme). "
            "Must not be receiving any other scholarship."
        ),
        benefits=(
            "Day scholar rates: ₹150–₹350/month depending on class. "
            "Hostel rates: ₹350–₹750/month depending on class. "
            "Ad hoc grant for books and study material also provided."
        ),
        documents=(
            "Aadhaar, caste/community certificate, income certificate from competent "
            "authority, school enrollment proof, previous class marksheet, bank account "
            "details, passport photograph."
        ),
        official_url="https://scholarships.gov.in/",
        application_process=(
            "Apply through the National Scholarship Portal (scholarships.gov.in). "
            "Complete One-Time Registration (OTR), fill application form with required "
            "details and submit for institution verification."
        ),
        eligibility_notes=(
            "Income ceiling and scholarship amounts may vary slightly based on the specific "
            "pre-matric scheme. Student must not be receiving any other scholarship."
        ),
        source_name="National Scholarship Portal",
        source_url="https://scholarships.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 15. Post-Matric Scholarship for SC Students
    # ==========================================================
    Scheme(
        name="Post-Matric Scholarship for SC Students",
        description=(
            "The Post-Matric Scholarship scheme for SC students provides financial "
            "assistance to SC students pursuing education at post-matric level."
        ),
        state="All India",
        category="SC",
        occupation="Student",
        min_age=None,
        max_age=None,
        max_income=250000,
        requirement="education",
        eligibility_rules=(
            "Applicant must belong to Scheduled Caste (SC). Must be studying at post-matric "
            "level (Class 11 and above, including graduation, post-graduation, and professional "
            "courses). Annual family income should not exceed ₹2.5 lakh. Must be studying in "
            "a recognised institution and should not be receiving any other scholarship."
        ),
        benefits=(
            "Maintenance allowance ranging from ₹230 to ₹1,200 per month depending on "
            "course level and day scholar/hostel status. Additional allowances for study "
            "tour, thesis, book bank facilities for professional courses."
        ),
        documents=(
            "Aadhaar, SC caste certificate issued by competent authority, income certificate, "
            "marksheet of previous qualifying examination, institution verification, bank "
            "account details."
        ),
        official_url="https://scholarships.gov.in/",
        application_process=(
            "Apply through National Scholarship Portal. Complete OTR, fill form, upload "
            "required documents. Application verified by institution and state/UT."
        ),
        eligibility_notes=(
            "Income limit is ₹2.5 lakh per annum. Cannot receive another scholarship "
            "simultaneously. Course must be from a recognised institution."
        ),
        source_name="National Scholarship Portal",
        source_url="https://scholarships.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 16. Stand-Up India Scheme
    # ==========================================================
    Scheme(
        name="Stand-Up India Scheme",
        description=(
            "Stand-Up India facilitates bank loans between ₹10 lakh and ₹1 crore to "
            "at least one SC or ST borrower and one woman borrower per bank branch for "
            "setting up a greenfield enterprise."
        ),
        state="All India",
        category="SC/ST",
        occupation="Entrepreneur",
        min_age=18,
        max_age=None,
        max_income=None,
        requirement="business",
        eligibility_rules=(
            "Borrower must be SC/ST and/or woman entrepreneur. Must be above 18 years. "
            "Loan for greenfield enterprise (first-time venture) in manufacturing, "
            "services or trading sector. In case of non-individual enterprise, 51% "
            "shareholding and controlling stake held by SC/ST or woman entrepreneur. "
            "Borrower should not be in default to any bank or financial institution."
        ),
        benefits=(
            "Composite loan of ₹10 lakh to ₹1 crore covering 75% of project cost. "
            "Repayment period up to 7 years with maximum moratorium period of 18 months. "
            "Working capital limit through overdraft."
        ),
        documents=(
            "Aadhaar, PAN, caste certificate (for SC/ST), project report, identity and "
            "address proof, proof of no default from any bank."
        ),
        official_url="https://www.standupmitra.in/",
        application_process=(
            "Apply through standupmitra.in portal, visit nearest branch of any scheduled "
            "commercial bank, or through SIDBI/NABARD. Submit project report and "
            "required documents."
        ),
        eligibility_notes=(
            "Must be a greenfield (new) enterprise. SC/ST borrowers must belong to "
            "Scheduled Castes or Scheduled Tribes as defined in the Constitution of India."
        ),
        source_name="Stand-Up India Portal",
        source_url="https://www.standupmitra.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 17. Pradhan Mantri Matru Vandana Yojana (PMMVY)
    # ==========================================================
    Scheme(
        name="Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        description=(
            "PMMVY is a maternity benefit programme providing cash incentives to pregnant "
            "and lactating mothers to partially compensate for wage loss and improve "
            "health and nutrition."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=19,
        max_age=None,
        max_income=None,
        requirement="health",
        eligibility_rules=(
            "All pregnant women and lactating mothers (PW&LM) except those who are in "
            "regular employment with the central or state government or public sector "
            "undertakings and are entitled to get maternity benefit. Benefit for first "
            "living child. Age 19 years or above."
        ),
        benefits=(
            "₹5,000 in three instalments for first living child. "
            "Under new guidelines (2022): ₹5,000 for first child and ₹6,000 for second "
            "child if it is a girl. Payment directly to bank account."
        ),
        documents=(
            "Aadhaar of mother and father, MCP card (Mother and Child Protection Card), "
            "bank account details, mobile number."
        ),
        official_url="https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
        application_process=(
            "Register at nearest Anganwadi Centre (AWC) or health facility. "
            "Fill PMMVY application form and submit required documents. Benefits "
            "are credited in three instalments during pregnancy and after delivery."
        ),
        eligibility_notes=(
            "Applicable for first living child (and second child if girl under revised scheme). "
            "Women employed in regular government/PSU jobs are not eligible."
        ),
        source_name="Ministry of Women and Child Development",
        source_url="https://wcd.nic.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 18. National Rural Livelihood Mission (DAY-NRLM)
    # ==========================================================
    Scheme(
        name="Deendayal Antyodaya Yojana – National Rural Livelihoods Mission (DAY-NRLM)",
        description=(
            "DAY-NRLM mobilises rural poor women into Self Help Groups (SHGs) and provides "
            "them credit, skill development, livelihood and social empowerment."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=18,
        max_age=None,
        max_income=None,
        requirement="livelihood",
        eligibility_rules=(
            "Rural women from poor households. Priority to Scheduled Castes, Scheduled "
            "Tribes, disabled persons, migrant labour households and minorities. "
            "Household must belong to below poverty line or have specific deprivation criteria."
        ),
        benefits=(
            "SHG formation and bank linkage. Interest subvention on SHG loans (7% per annum "
            "for prompt repayers). Revolving Fund of ₹10,000–₹15,000 per SHG. Capital "
            "subsidy under various sub-schemes. Skill training and placement support."
        ),
        documents=(
            "Aadhaar, bank account, proof of rural residence, SHG membership certificate "
            "if applicable."
        ),
        official_url="https://aajeevika.gov.in/",
        application_process=(
            "Contact your nearest Anganwadi worker, block mission management unit or "
            "Gram Panchayat. Rural women can also form or join existing SHGs in their village."
        ),
        eligibility_notes=(
            "Primarily targets rural women. Implementation varies by state under SRLM "
            "(State Rural Livelihoods Mission)."
        ),
        source_name="DAY-NRLM / Aajeevika Portal",
        source_url="https://aajeevika.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 19. National Apprenticeship Promotion Scheme (NAPS)
    # ==========================================================
    Scheme(
        name="National Apprenticeship Promotion Scheme (NAPS)",
        description=(
            "NAPS promotes apprenticeship training by sharing the cost of basic training "
            "and providing stipend support to apprentices and employers."
        ),
        state="All India",
        category="All",
        occupation="Student",
        min_age=14,
        max_age=None,
        max_income=None,
        requirement="skill development",
        eligibility_rules=(
            "Minimum age 14 years. Must have passed Class 5 or above (qualification "
            "requirement depends on trade). Indian national. Must be enrolled or willing "
            "to enroll as apprentice at an establishment under the Apprentices Act."
        ),
        benefits=(
            "Government shares 25% of stipend (up to ₹1,500/month) with employer. "
            "₹7,500 per apprentice paid to basic training providers. "
            "Apprentice gains industry experience and certification."
        ),
        documents=(
            "Aadhaar, educational certificate, bank account details, photograph."
        ),
        official_url="https://www.apprenticeshipindia.gov.in/",
        application_process=(
            "Register at apprenticeshipindia.gov.in as apprentice. Search and apply "
            "for apprenticeship opportunities with registered establishments."
        ),
        eligibility_notes=(
            "Different trades have different minimum educational qualification requirements. "
            "Minimum age is 14 years for most trades."
        ),
        source_name="Apprenticeship India Portal",
        source_url="https://www.apprenticeshipindia.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 20. Antyodaya Anna Yojana (AAY)
    # ==========================================================
    Scheme(
        name="Antyodaya Anna Yojana (AAY)",
        description=(
            "AAY provides highly subsidised food grains to the poorest of the poor "
            "households at ₹3/kg for rice and ₹2/kg for wheat."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=None,
        max_age=None,
        max_income=None,
        requirement="food",
        eligibility_rules=(
            "Identified as the poorest of the poor among BPL households by state/UT. "
            "Priority given to: landless agricultural labourers, marginal farmers, "
            "rural artisans/craftsmen with very low income, slum dwellers, persons "
            "earning their livelihood on daily basis in informal sector, destitute/widows "
            "with no assured income, elderly/disabled without support."
        ),
        benefits=(
            "35 kg of food grains per family per month. "
            "Rice at ₹3/kg and wheat at ₹2/kg. "
            "(Under NFSA 2013, food grains are now provided at even lower rates.)"
        ),
        documents=(
            "Aadhaar, BPL ration card or AAY card, family identity proof, state-issued "
            "eligibility certificate."
        ),
        official_url="https://dfpd.gov.in/",
        application_process=(
            "Contact your nearest Gram Panchayat, Block Office or Food and Civil "
            "Supplies Department. AAY cards are issued by state governments based on "
            "BPL survey identification."
        ),
        eligibility_notes=(
            "Identification of beneficiaries is done by state governments. Cannot apply "
            "directly — must be included in the state BPL/AAY list."
        ),
        source_name="Department of Food and Public Distribution",
        source_url="https://dfpd.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 21. Startup India Seed Fund Scheme
    # ==========================================================
    Scheme(
        name="Startup India Seed Fund Scheme (SISFS)",
        description=(
            "SISFS provides financial assistance to startups for proof of concept, "
            "prototype development, product trials, market entry and commercialisation."
        ),
        state="All India",
        category="All",
        occupation="Entrepreneur",
        min_age=18,
        max_age=None,
        max_income=None,
        requirement="business",
        eligibility_rules=(
            "Startup must be recognized by DPIIT. Startup should not have received more "
            "than ₹10 lakh of monetary support under any other Central or State government "
            "scheme. Founders must be Indian citizens. Must be incorporated as a private "
            "limited company, partnership or LLP. Startup must use technology in its core "
            "product/service/process."
        ),
        benefits=(
            "Up to ₹20 lakh as grants for validation of proof of concept, prototype "
            "development or product trials. Up to ₹50 lakh as investments for "
            "market entry, commercialisation or scaling up."
        ),
        documents=(
            "DPIIT recognition certificate, incorporation certificate, PAN, pitch deck, "
            "financial projections, details of the innovation/technology."
        ),
        official_url="https://seedfund.startupindia.gov.in/",
        application_process=(
            "Apply through the Startup India Seed Fund portal. Select incubator, "
            "submit application with all required details about the startup and "
            "fund utilization plan."
        ),
        eligibility_notes=(
            "Must be DPIIT-recognised startup. Cannot have received more than ₹10 lakh "
            "from other central/state government schemes."
        ),
        source_name="Startup India Seed Fund Portal",
        source_url="https://seedfund.startupindia.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),

    # ==========================================================
    # 22. PM SVANidhi (Street Vendor Loan)
    # ==========================================================
    Scheme(
        name="PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
        description=(
            "PM SVANidhi provides affordable working capital loans to street vendors "
            "to help them resume livelihoods impacted by COVID-19 and grow their business."
        ),
        state="All India",
        category="All",
        occupation="All",
        min_age=18,
        max_age=None,
        max_income=None,
        requirement="business",
        eligibility_rules=(
            "Street vendors who were vending in urban areas on or before March 24, 2020 "
            "and possess a vending certificate or identity card issued by ULB, or "
            "have a letter of recommendation from the Town Vending Committee, or "
            "vend in peri-urban or rural areas around cities."
        ),
        benefits=(
            "Working capital loan of ₹10,000 (initial), ₹20,000 (second term), "
            "₹50,000 (third term) for timely repayment. "
            "7% interest subsidy per annum. "
            "Reward for digital transactions. Collateral-free loan."
        ),
        documents=(
            "Aadhaar, vending certificate/identity card from ULB, bank account details, "
            "photograph."
        ),
        official_url="https://pmsvanidhi.mohua.gov.in/",
        application_process=(
            "Apply through PM SVANidhi portal, CSC centres, or through participating "
            "banks/MFIs/NBFCs. Submit application with vending certificate and Aadhaar."
        ),
        eligibility_notes=(
            "Must be an urban street vendor with ULB-issued certificate or TVC "
            "recommendation. Loan is for working capital only."
        ),
        source_name="PM SVANidhi Official Portal",
        source_url="https://pmsvanidhi.mohua.gov.in/",
        verified_on="2026-09",
        verification_status="Official government source"
    ),
]


# Add all schemes
db.add_all(real_schemes)
# Collect names before closing session
scheme_names = [s.name for s in real_schemes]

db.commit()
db.close()

print(f"Done! Successfully added {len(scheme_names)} government schemes to the database!")
print("\nSchemes added:")
for i, name in enumerate(scheme_names, 1):
    print(f"  {i:2}. {name[:70]}")
