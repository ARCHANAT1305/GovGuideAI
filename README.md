# 🏛️ GovGuide AI (Government Guide AI)

**GovGuide AI** is an intelligent citizen empowerment portal built to help individuals and families navigate public welfare schemes, check real-time eligibility, generate customized document checklists, and query schemes using multi-language conversational AI.

---

## 🌟 Key Features

1. **⚡ Instant Eligibility Evaluator**
   - Evaluates citizen profiles against national and state criteria (Age, Household Income, Occupation, Gender, Social Category, and Location).
   - Generates Match Scores (%) and highlights met criteria vs. disqualifying factors.

2. **📄 Document Readiness & Checklist Generator**
   - Breaks down mandatory vs. optional paperwork for each scheme.
   - Shows acceptable alternatives (e.g. NFSA / Ration Card alternatives, Land record equivalents).
   - Dynamic **Application Readiness Meter** with single-click print support.

3. **🤖 Intelligent Conversational AI Assistant**
   - Natural language scheme search, eligibility queries, and step-by-step application advice.
   - **Zero-Dependency Smart Fallback Engine**: Works right out of the box with built-in RAG semantic matching without requiring paid API keys.
   - **Cloud LLM Support**: Seamlessly connects to Google Gemini (`GEMINI_API_KEY`) or OpenAI (`OPENAI_API_KEY`) when supplied in `.env.local`.

4. **🌐 Multi-Language Localization**
   - Instant language switching across **English**, **हिंदी (Hindi)**, **தமிழ் (Tamil)**, **తెలుగు (Telugu)**, **বাংলা (Bengali)**, **मराठी (Marathi)**, and **Español**.

5. **🔍 Comprehensive Welfare Directory**
   - Categorized by **Agriculture**, **Healthcare**, **Education**, **Housing**, **Business & MSME**, **Social Welfare**, and **Women & Child**.
   - Direct links to official government portals (`pmkisan.gov.in`, `beneficiary.nha.gov.in`, `scholarships.gov.in`, `udyamimitra.in`, etc.) and verified toll-free helplines.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **AI / RAG**: Built-in Scheme Matching Engine + Google Gemini / OpenAI API integration
- **State & Storage**: Client-side reactive state & Next.js API Routes

---

## 📁 Project Structure

```text
GOVGUIDEAI/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts            # AI Chat endpoint (Gemini / OpenAI / Smart Engine)
│   ├── globals.css                 # Tailwind directives & print styles
│   ├── layout.tsx                  # Root layout & SEO metadata
│   └── page.tsx                    # Main portal page
├── components/
│   ├── Navbar.tsx                  # Header with language switcher & chat trigger
│   ├── Hero.tsx                    # Hero banner with fast search & metrics
│   ├── EligibilityChecker.tsx      # Interactive citizen profile calculator
│   ├── SchemeCatalog.tsx           # Filterable scheme directory
│   ├── DocumentChecklist.tsx       # Document verification & readiness meter
│   ├── SchemeModal.tsx             # Detail popup modal with steps & helpline
│   ├── ChatAssistant.tsx           # Floating AI drawer with quick questions
│   └── Footer.tsx                  # Government portal style footer & helplines
├── data/
│   └── schemes.ts                  # Schemes database with criteria, documents & steps
├── lib/
│   ├── matcher.ts                  # Eligibility evaluator & search algorithms
│   ├── translations.ts             # Multi-language dictionary
│   └── types.ts                    # TypeScript domain definitions
├── .env.example                    # Sample environment variables
├── package.json                    # Project dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind theme extensions
└── README.md                       # Documentation
```

---

## 🚀 Getting Started

### 1. Install Dependencies
Open PowerShell or your preferred terminal in the project directory:
```bash
npm install
```

### 2. Configure Environment Variables (Optional)
If you want to use Google Gemini or OpenAI for AI chat, copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your API key (if blank, the system automatically uses the high-precision built-in RAG engine):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start the Development Server
```bash
npm run dev
```

Open your browser and visit:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 💡 How to Add New Schemes

Open [`data/schemes.ts`](file:///c:/Users/admin/Desktop/GOVGUIDEAI/data/schemes.ts) and add a new entry to `SCHEMES_DATABASE`:

```typescript
{
  id: 'scheme-id',
  name: 'Scheme Full Name',
  shortName: 'Short Name',
  category: 'Agriculture', // or Healthcare, Education, Housing, etc.
  ministry: 'Name of Ministry',
  description: 'Detailed description...',
  targetAudience: ['Farmer'],
  benefits: ['Benefit 1', 'Benefit 2'],
  maxIncomeLimit: 250000,
  minAge: 18,
  requiredDocuments: [
    { id: 'aadhaar', name: 'Aadhaar Card', purpose: 'Identity proof', mandatory: true }
  ],
  stepsToApply: ['Step 1...', 'Step 2...'],
  portalUrl: 'https://official-portal.gov.in',
  helpline: '1800-XXX-XXXX',
  tags: ['keyword1', 'keyword2'],
  processingTime: '15-30 days'
}
```

The eligibility checker, search filter, and document checklist generator will automatically pick up the new scheme without any extra code changes!
