import { NextRequest, NextResponse } from 'next/server';
import { SCHEMES_DATABASE } from '@/data/schemes';
import { Scheme } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { message, language = 'en', userProfile } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const lowerQuery = message.toLowerCase();

    // Check for configured external LLM keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        const response = await callGemini(geminiKey, message, language, userProfile);
        if (response) {
          return NextResponse.json(response);
        }
      } catch (err) {
        console.error('Gemini API call failed, falling back to local engine:', err);
      }
    } else if (openaiKey) {
      try {
        const response = await callOpenAI(openaiKey, message, language, userProfile);
        if (response) {
          return NextResponse.json(response);
        }
      } catch (err) {
        console.error('OpenAI API call failed, falling back to local engine:', err);
      }
    }

    // Default: Built-in GovGuide Smart Engine (Context-aware, zero-dependency fallback)
    const localResult = generateSmartGovResponse(lowerQuery, language, userProfile);
    return NextResponse.json(localResult);

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        content: 'I apologize, but I encountered an unexpected error processing your request. Please try asking again.',
        schemesSuggested: [] 
      },
      { status: 500 }
    );
  }
}

// Built-in RAG response engine
function generateSmartGovResponse(query: string, language: string, profile?: any) {
  // Find matching schemes based on user query
  const matchedSchemes: Scheme[] = [];

  for (const s of SCHEMES_DATABASE) {
    let score = 0;
    if (query.includes(s.shortName.toLowerCase())) score += 5;
    if (query.includes(s.name.toLowerCase())) score += 4;
    if (query.includes(s.category.toLowerCase())) score += 3;
    for (const tag of s.tags) {
      if (query.includes(tag.toLowerCase())) score += 2;
    }
    for (const aud of s.targetAudience) {
      if (query.includes(aud.toLowerCase())) score += 2;
    }

    if (score >= 2) {
      matchedSchemes.push(s);
    }
  }

  // Handle specific question types
  const isDocumentQuery = query.includes('document') || query.includes('doc') || query.includes('paper') || query.includes('certificate') || query.includes('दस्तावेज') || query.includes('ஆவண');
  const isEligibilityQuery = query.includes('eligible') || query.includes('eligibility') || query.includes('can i apply') || query.includes('पात्र') || query.includes('தகுதி');
  const isApplicationQuery = query.includes('apply') || query.includes('how to') || query.includes('portal') || query.includes('process') || query.includes('आवेदन');

  if (matchedSchemes.length > 0) {
    const primary = matchedSchemes[0];

    if (isDocumentQuery) {
      const docList = primary.requiredDocuments
        .map(d => `• **${d.name}** (${d.mandatory ? 'Mandatory' : 'Optional'}): ${d.purpose}${d.alternatives ? ` [Acceptable Alternative: ${d.alternatives.join(', ')}]` : ''}`)
        .join('\n');

      return {
        content: `Here are the essential documents needed for **${primary.name}**:\n\n${docList}\n\n💡 **Tip:** Ensure your Aadhaar is linked with your active mobile number and bank account for smooth direct benefit transfer (DBT).`,
        schemesSuggested: [primary],
        quickActions: [
          { label: `View Steps to Apply for ${primary.shortName}`, query: `How to apply for ${primary.shortName}?` },
          { label: 'Check My Eligibility', query: `Am I eligible for ${primary.shortName}?` }
        ]
      };
    }

    if (isEligibilityQuery) {
      let incomeLimit = primary.maxIncomeLimit ? `Up to ₹${primary.maxIncomeLimit.toLocaleString()} per year` : 'No income ceiling';
      let ageLimit = (primary.minAge || primary.maxAge) ? `${primary.minAge || 0} to ${primary.maxAge || 'No limit'} years` : 'No specific age barrier';

      return {
        content: `### Eligibility Criteria for **${primary.name}**\n\n` +
          `• **Target Groups:** ${primary.targetAudience.join(', ')}\n` +
          `• **Age Criteria:** ${ageLimit}\n` +
          `• **Annual Income Threshold:** ${incomeLimit}\n` +
          `• **Gender Restrictions:** ${primary.genderEligibility || 'All'}\n\n` +
          `**Key Benefits Provided:**\n` +
          primary.benefits.map(b => `• ${b}`).join('\n') + `\n\n` +
          `You can use our interactive **Instant Eligibility Checker** below for a detailed personal check!`,
        schemesSuggested: [primary],
        quickActions: [
          { label: `What documents are needed?`, query: `Documents required for ${primary.shortName}` },
          { label: `Official Portal Link`, query: `Official website and helpline for ${primary.shortName}` }
        ]
      };
    }

    if (isApplicationQuery) {
      return {
        content: `### Step-by-Step Application Guide for **${primary.name}**\n\n` +
          primary.stepsToApply.map((step, idx) => `**Step ${idx + 1}:** ${step}`).join('\n\n') + `\n\n` +
          `🌐 **Official Portal:** [${primary.portalUrl}](${primary.portalUrl})\n` +
          `📞 **Toll-Free Helpline:** ${primary.helpline}\n` +
          `⏱️ **Estimated Processing Time:** ${primary.processingTime}`,
        schemesSuggested: [primary],
        quickActions: [
          { label: 'Document Checklist', query: `Documents required for ${primary.shortName}` },
          { label: 'Find Similar Schemes', query: `Similar schemes to ${primary.category}` }
        ]
      };
    }

    // General scheme overview
    return {
      content: `### ${primary.name} (${primary.shortName})\n\n` +
        `**Ministry:** ${primary.ministry}\n\n` +
        `${primary.description}\n\n` +
        `**Key Benefits:**\n` +
        primary.benefits.map(b => `• ${b}`).join('\n') + `\n\n` +
        `🌐 **Official Portal:** [${primary.portalUrl}](${primary.portalUrl})\n` +
        `📞 **National Helpline:** ${primary.helpline}`,
      schemesSuggested: matchedSchemes.slice(0, 3),
      quickActions: [
        { label: `Check Eligibility for ${primary.shortName}`, query: `Eligibility for ${primary.shortName}` },
        { label: `Required Documents`, query: `Documents for ${primary.shortName}` },
        { label: `How to Apply`, query: `How to apply for ${primary.shortName}` }
      ]
    };
  }

  // Generic guidance
  return {
    content: `GovGuide AI has access to major national and state welfare schemes across **Agriculture, Healthcare, Education, Housing, Small Business & MSME, and Social Security**.\n\n` +
      `Here is what you can ask me:\n` +
      `• *"Am I eligible for farmer subsidies?"*\n` +
      `• *"What are the documents needed for Ayushman Bharat health card?"*\n` +
      `• *"How can I get an interest-free Mudra loan for my small business?"*\n` +
      `• *"What scholarships exist for students with family income under 2.5 Lakhs?"*\n\n` +
      `You can also use the **Eligibility Calculator** form on this page to enter your age and income for instant matching.`,
    schemesSuggested: SCHEMES_DATABASE.slice(0, 3),
    quickActions: [
      { label: 'PM-KISAN ₹6,000 Subsidy', query: 'Tell me about PM-KISAN' },
      { label: 'Ayushman Bharat Health Cover', query: 'Tell me about Ayushman Bharat' },
      { label: 'Mudra Loan for Business', query: 'Tell me about Mudra Loan' },
      { label: 'National Scholarships', query: 'Tell me about National Scholarships' }
    ]
  };
}

// Call Google Gemini API
async function callGemini(apiKey: string, query: string, language: string, profile: any) {
  const context = JSON.stringify(SCHEMES_DATABASE.map(s => ({
    name: s.name,
    category: s.category,
    ministry: s.ministry,
    benefits: s.benefits,
    incomeLimit: s.maxIncomeLimit,
    ageLimits: { min: s.minAge, max: s.maxAge },
    documents: s.requiredDocuments.map(d => d.name),
    portal: s.portalUrl,
    helpline: s.helpline
  })));

  const systemInstruction = `You are GovGuide AI, an empathetic, highly knowledgeable digital guide helping citizens discover government schemes, check eligibility, prepare documents, and navigate application processes.
Answer in the user's preferred language (Language code: ${language}).
Base your scheme recommendations on the provided database context:
${context}
When appropriate, specify whether the citizen qualifies, list mandatory documents clearly, and mention the official portal or helpline. Keep answers formatted nicely with bullet points and bold headers.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: ${query}\nUser Profile (if provided): ${JSON.stringify(profile || {})}` }]
        }
      ]
    })
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.statusText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  return {
    content: text,
    schemesSuggested: SCHEMES_DATABASE.filter(s => query.toLowerCase().includes(s.shortName.toLowerCase())).slice(0, 2)
  };
}

// Call OpenAI API
async function callOpenAI(apiKey: string, query: string, language: string, profile: any) {
  const context = JSON.stringify(SCHEMES_DATABASE);
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are GovGuide AI. Use this scheme database: ${context}. Answer clearly in language: ${language}.`
        },
        {
          role: 'user',
          content: `User query: ${query}. User profile: ${JSON.stringify(profile || {})}`
        }
      ]
    })
  });

  if (!res.ok) return null;
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  return {
    content,
    schemesSuggested: SCHEMES_DATABASE.filter(s => query.toLowerCase().includes(s.shortName.toLowerCase())).slice(0, 2)
  };
}
