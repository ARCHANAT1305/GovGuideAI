import { Scheme } from '@/lib/types';

export const SCHEMES_DATABASE: Scheme[] = [
  {
    id: 'pm-kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    shortName: 'PM-KISAN',
    category: 'Agriculture',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Direct financial income support of ₹6,000 per year transferred in three equal installments of ₹2,000 directly into the bank accounts of all landholding farmer families.',
    targetAudience: ['Farmer'],
    benefits: [
      '₹6,000 per year in 3 installments of ₹2,000 directly into Aadhaar-seeded bank account',
      '100% centrally funded welfare scheme',
      'Assistance for purchasing agricultural inputs, seeds, and fertilizers'
    ],
    minAge: 18,
    genderEligibility: 'All',
    requiredDocuments: [
      { id: 'aadhaar', name: 'Aadhaar Card', purpose: 'Identity verification & direct DBT transfer', mandatory: true },
      { id: 'land_records', name: 'Land Ownership Records (RoR / Khatauni / Khasra)', purpose: 'Proof of cultivable landholding', mandatory: true },
      { id: 'bank_passbook', name: 'Aadhaar-Linked Bank Account Passbook', purpose: 'Direct bank transfer receiving account', mandatory: true },
      { id: 'mobile_no', name: 'Aadhaar Registered Mobile Number', purpose: 'eKYC verification via OTP', mandatory: true }
    ],
    stepsToApply: [
      'Visit the official PM-KISAN portal (pmkisan.gov.in) and click on "New Farmer Registration".',
      'Enter Aadhaar number and registered mobile number, select State and enter the OTP received.',
      'Fill in landholding details (survey number, khasra number, district, sub-district, village).',
      'Upload scanned land ownership certificate and bank account passbook.',
      'Complete biometric or OTP-based e-KYC.'
    ],
    portalUrl: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606',
    tags: ['agriculture', 'farmers', 'income support', 'dbt', 'kisan'],
    processingTime: '15 to 30 days after state verification'
  },
  {
    id: 'ayushman-bharat',
    name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    shortName: 'Ayushman Bharat',
    category: 'Healthcare',
    ministry: 'National Health Authority, Ministry of Health & Family Welfare',
    description: 'The world\'s largest government-funded healthcare assurance scheme offering secondary and tertiary health cover up to ₹5,00,000 per family per year across empaneled hospitals.',
    targetAudience: ['Low Income Family', 'Senior Citizen', 'General'],
    benefits: [
      'Free cashless inpatient hospital treatment up to ₹5,00,000 per family per year',
      'Covers pre-existing illnesses from day one',
      'Over 27,000 public and private empaneled hospitals across India'
    ],
    maxIncomeLimit: 300000,
    genderEligibility: 'All',
    requiredDocuments: [
      { id: 'aadhaar', name: 'Aadhaar Card', purpose: 'Identification of family members', mandatory: true },
      { id: 'ration_card', name: 'Ration Card / NFSA Card', purpose: 'Proof of family structure and low-income inclusion', mandatory: true, alternatives: ['PMJAY Family Verification Letter'] },
      { id: 'income_cert', name: 'Income Certificate', purpose: 'Proof of low annual income', mandatory: false },
      { id: 'mobile_no', name: 'Active Mobile Number', purpose: 'Digital Ayushman card verification', mandatory: true }
    ],
    stepsToApply: [
      'Visit beneficiary.nha.gov.in or nearest Common Service Center (CSC).',
      'Log in with mobile OTP and search for your name using Ration card or Aadhaar number.',
      'Check if your family is listed in the SECC or state NFSA database.',
      'Submit Aadhaar e-KYC (biometric or mobile OTP).',
      'Download the digital Golden Ayushman Card instantly upon approval.'
    ],
    portalUrl: 'https://beneficiary.nha.gov.in',
    helpline: '14555 / 1800-111-565',
    tags: ['health', 'hospitalization', 'insurance', 'medical', 'ayushman', 'pmjay'],
    processingTime: 'Instant upon CSC / online e-KYC verification'
  },
  {
    id: 'pm-awas-yojana',
    name: 'Pradhan Mantri Awas Yojana - Urban & Gramin (PMAY)',
    shortName: 'PMAY Housing',
    category: 'Housing',
    ministry: 'Ministry of Housing and Urban Affairs & Ministry of Rural Development',
    description: 'Financial assistance and interest subsidies for eligible urban and rural families who do not own a pucca (permanent) house in India.',
    targetAudience: ['Low Income Family', 'Women', 'General'],
    benefits: [
      'Direct grant of up to ₹1,20,000 - ₹1,30,000 for rural construction',
      'Credit-Linked Subsidy Scheme (CLSS) interest subsidy up to ₹2.67 Lakh for home loans',
      'Mandatory joint home ownership with female head of the family'
    ],
    maxIncomeLimit: 600000,
    minAge: 21,
    genderEligibility: 'All',
    requiredDocuments: [
      { id: 'aadhaar', name: 'Aadhaar Card', purpose: 'Identity & deduplication', mandatory: true },
      { id: 'income_proof', name: 'Salary Slip / Income Certificate / ITR', purpose: 'Assessment of income category (EWS/LIG)', mandatory: true },
      { id: 'pan_card', name: 'PAN Card', purpose: 'Financial and loan verification', mandatory: true },
      { id: 'land_affidavit', name: 'Affidavit of Non-Ownership of Pucca House', purpose: 'Certification that applicant has no permanent home', mandatory: true },
      { id: 'bank_statement', name: 'Bank Statement (Last 6 months)', purpose: 'Loan subsidy transfer', mandatory: true }
    ],
    stepsToApply: [
      'Navigate to pmaymis.gov.in (for Urban) or pmayg.nic.in (for Gramin).',
      'Select "Citizen Assessment" and choose relevant category (Slum Redevelopment, Credit Linked Subsidy, Affordable Housing).',
      'Verify 12-digit Aadhaar number.',
      'Complete the detailed application form with family income and current shelter status.',
      'Save the generated Application Number for tracking status.'
    ],
    portalUrl: 'https://pmaymis.gov.in',
    helpline: '1800-11-6163 / 1800-11-3377',
    tags: ['housing', 'home loan', 'shelter', 'subsidy', 'pmay'],
    processingTime: '30 to 60 days depending on local municipal / gram panchayat survey'
  },
  {
    id: 'nsp-post-matric-scholarship',
    name: 'National Scholarship Scheme - Post-Matric & Higher Education',
    shortName: 'NSP Scholarships',
    category: 'Education',
    ministry: 'Ministry of Minority Affairs / Social Justice & Empowerment',
    description: 'Scholarships covering tuition fees and maintenance allowances for meritorious students from low-income, minority, SC, ST, and OBC backgrounds pursuing Class 11 to PhD studies.',
    targetAudience: ['Student', 'Youth'],
    benefits: [
      'Full or partial reimbursement of course tuition fees',
      'Monthly maintenance allowance ranging from ₹500 to ₹1,500/month',
      'Disbursed directly into student Aadhaar-seeded bank account'
    ],
    maxIncomeLimit: 250000,
    minAge: 15,
    maxAge: 32,
    genderEligibility: 'All',
    requiredDocuments: [
      { id: 'student_aadhaar', name: 'Student Aadhaar Card', purpose: 'Biometric deduplication', mandatory: true },
      { id: 'marksheet', name: 'Previous Academic Year Marksheet', purpose: 'Academic performance verification (minimum 50% or passing criteria)', mandatory: true },
      { id: 'income_cert', name: 'Competent Authority Income Certificate', purpose: 'Income eligibility verification', mandatory: true },
      { id: 'caste_cert', name: 'Caste / Community Certificate', purpose: 'Category verification (if applying under SC/ST/OBC/Minority)', mandatory: false },
      { id: 'bonafide_cert', name: 'Bonafide Student Certificate from College/Institute', purpose: 'Proof of current regular enrollment', mandatory: true },
      { id: 'fee_receipt', name: 'Current Year Fee Receipt', purpose: 'Tuition fee claim estimation', mandatory: true }
    ],
    stepsToApply: [
      'Register on National Scholarship Portal (scholarships.gov.in) with student mobile number.',
      'Generate OTR (One Time Registration) via Aadhaar eKYC / Face Auth.',
      'Select scheme under state or central quota based on course and family income.',
      'Upload marksheets, institute bonafide, and fee receipt.',
      'Submit form; your institution will verify and forward to District Nodal Officer.'
    ],
    portalUrl: 'https://scholarships.gov.in',
    helpline: '0120-6619540',
    tags: ['education', 'scholarship', 'students', 'college', 'tuition fees', 'minority', 'sc', 'st'],
    processingTime: 'Disbursed annually post-academic verification cycle'
  },
  {
    id: 'pm-mudra-yojana',
    name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
    shortName: 'MUDRA Loan',
    category: 'Business & MSME',
    ministry: 'Department of Financial Services, Ministry of Finance',
    description: 'Collateral-free micro-credit loans up to ₹20,00,000 for non-corporate, non-farm small and micro enterprises across Shishu, Kishore, and Tarun categories.',
    targetAudience: ['Entrepreneur', 'Women', 'Youth'],
    benefits: [
      'No collateral or third-party guarantee required',
      'Shishu loan: Up to ₹50,000 for new starters',
      'Kishore loan: ₹50,000 to ₹5,00,000 for established small businesses',
      'Tarun & Tarun Plus: ₹5,00,000 to ₹20,00,000 for expansion',
      'Low processing charges and competitive interest rates'
    ],
    minAge: 18,
    genderEligibility: 'All',
    requiredDocuments: [
      { id: 'id_proof', name: 'Identity Proof (Aadhaar / Voter ID / Passport)', purpose: 'KYC proof', mandatory: true },
      { id: 'address_proof', name: 'Residence Proof (Electricity Bill / Rent Agreement)', purpose: 'Address verification', mandatory: true },
      { id: 'business_id', name: 'Business Proof (Udyam Registration / Trade License / GST)', purpose: 'Proof of business entity', mandatory: true },
      { id: 'bank_statement', name: 'Bank Account Statements (Past 12 Months)', purpose: 'Creditworthiness appraisal', mandatory: true },
      { id: 'project_report', name: 'Detailed Project Report (For loans > ₹2 Lakhs)', purpose: 'Business plan & revenue projections', mandatory: false }
    ],
    stepsToApply: [
      'Log into the Udyamimitra portal (udyamimitra.in) or visit any commercial bank/NBFC.',
      'Prepare business quotation for machinery, inventory, or working capital requirements.',
      'Submit standard PMMY application form along with business registration.',
      'Undergo bank evaluation and sanctioning letter generation.',
      'Receive Mudra Card for seamless withdrawal of working capital.'
    ],
    portalUrl: 'https://udyamimitra.in',
    helpline: '1800-180-1111 / 1800-11-0001',
    tags: ['business', 'loan', 'msme', 'startup', 'finance', 'entrepreneur'],
    processingTime: '7 to 14 business days from document submission'
  },
  {
    id: 'sukanya-samriddhi-yojana',
    name: 'Sukanya Samriddhi Yojana (SSY)',
    shortName: 'Sukanya Samriddhi',
    category: 'Women & Child',
    ministry: 'Ministry of Finance & Ministry of Women and Child Development',
    description: 'Small deposit savings scheme for girl children offering one of the highest government guaranteed interest rates (8.2%) with triple tax exemptions under Section 80C.',
    targetAudience: ['Women', 'Low Income Family', 'General'],
    benefits: [
      'High guaranteed interest rate (8.2% p.a. compounded yearly)',
      'EEE (Exempt-Exempt-Exempt) tax benefit: Investment, interest, and maturity are completely tax-free',
      'Maturity on completion of 21 years from account opening or upon girl reaching 18 years for marriage/higher studies',
      'Minimum deposit of only ₹250 per financial year'
    ],
    maxAge: 10,
    genderEligibility: 'Female',
    requiredDocuments: [
      { id: 'birth_cert', name: 'Girl Child Birth Certificate', purpose: 'Age proof and relationship confirmation', mandatory: true },
      { id: 'parent_aadhaar', name: 'Parent / Legal Guardian Aadhaar Card', purpose: 'KYC identity proof', mandatory: true },
      { id: 'parent_pan', name: 'Parent / Legal Guardian PAN Card', purpose: 'Tax reporting & banking compliance', mandatory: true },
      { id: 'address_proof', name: 'Proof of Residence (Utility Bill / Passport)', purpose: 'Address record', mandatory: true },
      { id: 'photos', name: 'Recent Passport Size Photographs of Child & Guardian', purpose: 'Account record', mandatory: true }
    ],
    stepsToApply: [
      'Visit any Post Office or authorized branch of Public/Private sector banks.',
      'Obtain and fill the SSY Account Opening Form (Form-1).',
      'Attach copy of the child\'s birth certificate and guardian KYC documents.',
      'Deposit the initial amount (minimum ₹250 in cash/cheque/DD).',
      'Collect the SSY Passbook documenting account number and deposits.'
    ],
    portalUrl: 'https://www.indiapost.gov.in',
    helpline: '1800-266-6868',
    tags: ['girl child', 'savings', 'tax free', 'education', 'women', 'ssy'],
    processingTime: 'Same day account opening at Post Office / Bank'
  },
  {
    id: 'atal-pension-yojana',
    name: 'Atal Pension Yojana (APY)',
    shortName: 'Atal Pension',
    category: 'Social Welfare',
    ministry: 'Pension Fund Regulatory and Development Authority (PFRDA)',
    description: 'Guaranteed monthly pension of ₹1,000 to ₹5,000 after the age of 60 for unorganized sector workers and Indian citizens based on contribution amount.',
    targetAudience: ['Low Income Family', 'Senior Citizen', 'Youth', 'General'],
    benefits: [
      'Guaranteed monthly pension from ₹1,000 up to ₹5,000 from age 60',
      'On subscriber demise, 100% pension continues to spouse for life',
      'On demise of both subscriber and spouse, accumulated pension wealth returned to nominee',
      'Income tax benefits under Section 80CCD(1B)'
    ],
    minAge: 18,
    maxAge: 40,
    genderEligibility: 'All',
    requiredDocuments: [
      { id: 'savings_bank', name: 'Active Savings Bank Account', purpose: 'Monthly auto-debit of contribution', mandatory: true },
      { id: 'aadhaar', name: 'Aadhaar Card', purpose: 'Primary identity & nominee mapping', mandatory: true },
      { id: 'mobile_no', name: 'Aadhaar Registered Mobile Number', purpose: 'SMS alerts and e-PRAN generation', mandatory: true }
    ],
    stepsToApply: [
      'Access internet banking of your savings bank account or visit your home branch.',
      'Navigate to Social Security Schemes / Atal Pension Yojana section.',
      'Select desired pension amount (₹1,000 / ₹2,000 / ₹3,000 / ₹4,000 / ₹5,000).',
      'Provide nominee details and authorize monthly auto-debit.',
      'Download e-PRAN acknowledgment card.'
    ],
    portalUrl: 'https://enps.nsdl.com',
    helpline: '1800-110-069',
    tags: ['pension', 'senior citizen', 'retirement', 'unorganized worker', 'apy'],
    processingTime: '1 to 3 banking days'
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    shortName: 'PM Vishwakarma',
    category: 'Business & MSME',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    description: 'Holistic support for traditional artisans and craftspeople including PM Vishwakarma certification, skill training stipend, ₹15,000 toolkit incentive, and collateral-free enterprise credit up to ₹3 Lakh at 5% interest.',
    targetAudience: ['Entrepreneur', 'Youth', 'General'],
    benefits: [
      'Official PM Vishwakarma Certificate and ID Card recognition',
      'Free skill training with ₹500/day stipend during basic & advanced training',
      '₹15,000 grant for modern toolkit purchase',
      'Collateral-free loan: ₹1 Lakh (1st tranche) and ₹2 Lakh (2nd tranche) at concessional 5% interest',
      'Digital transaction incentive up to ₹100 per month'
    ],
    minAge: 18,
    genderEligibility: 'All',
    requiredDocuments: [
      { id: 'aadhaar', name: 'Aadhaar Card', purpose: 'Artisan identity verification', mandatory: true },
      { id: 'mobile_no', name: 'Aadhaar Linked Mobile Number', purpose: 'OTP authorization', mandatory: true },
      { id: 'bank_details', name: 'Active Bank Account Passbook / Statement', purpose: 'Toolkit grant and loan credit', mandatory: true },
      { id: 'ration_card', name: 'Ration Card / Family Composition Document', purpose: 'Verification of family artisan tradition', mandatory: true }
    ],
    stepsToApply: [
      'Visit nearest Common Service Center (CSC) with Aadhaar and bank details.',
      'Select registered trade from the 18 eligible traditional crafts (Carpenter, Blacksmith, Potter, Tailor, Sculptor, etc.).',
      'Complete biometric e-KYC and trade registration.',
      'Application is verified through 3 levels: Gram Panchayat / ULB, District Implementation Committee, and Screening Committee.',
      'Upon approval, attend 5-7 days basic skill training and receive certificate.'
    ],
    portalUrl: 'https://pmvishwakarma.gov.in',
    helpline: '1800-267-7777 / 011-23061574',
    tags: ['artisans', 'craftsmen', 'toolkit', 'msme', 'loan', 'vishwakarma'],
    processingTime: '20 to 30 days for 3-tier validation'
  }
];
