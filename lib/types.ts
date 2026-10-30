export type Category = 
  | 'All'
  | 'Agriculture'
  | 'Healthcare'
  | 'Education'
  | 'Housing'
  | 'Business & MSME'
  | 'Social Welfare'
  | 'Women & Child';

export type TargetAudience = 
  | 'Farmer'
  | 'Student'
  | 'Women'
  | 'Senior Citizen'
  | 'Youth'
  | 'Entrepreneur'
  | 'Low Income Family'
  | 'General';

export interface Scheme {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  ministry: string;
  description: string;
  targetAudience: TargetAudience[];
  benefits: string[];
  maxIncomeLimit?: number; // In INR per year, undefined = no limit
  minAge?: number;
  maxAge?: number;
  genderEligibility?: 'All' | 'Female' | 'Male';
  requiredDocuments: {
    id: string;
    name: string;
    purpose: string;
    mandatory: boolean;
    alternatives?: string[];
  }[];
  stepsToApply: string[];
  portalUrl: string;
  helpline: string;
  tags: string[];
  processingTime: string;
}

export interface UserProfile {
  age: number;
  annualIncome: number;
  occupation: string;
  gender: string;
  state: string;
  categoryGroup: string; // General, OBC, SC, ST, EWS
  isStudent?: boolean;
  isFarmer?: boolean;
}

export interface EligibilityEvaluation {
  scheme: Scheme;
  isEligible: boolean;
  matchScore: number; // 0 to 100
  criteriaMet: string[];
  criteriaMissing: string[];
  recommendationLevel: 'High' | 'Medium' | 'Low';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  schemesSuggested?: Scheme[];
  quickActions?: {
    label: string;
    query: string;
  }[];
}

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'es';
