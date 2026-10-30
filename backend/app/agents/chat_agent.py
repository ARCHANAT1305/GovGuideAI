import os
import re
import json
import urllib.request
import urllib.error

def clean_text(value):
    if value is None:
        return ""
    return str(value).strip()


# Extended domain categories for all 22 central schemes
KEYWORDS_MAP = {
    "scholarship": [
        "scholarship", "student", "college", "education", "study", "university",
        "pre-matric", "post-matric", "merit", "csss", "class 12", "exam", "school",
        "கல்வி", "மாணவர்", "படிப்பு", "உதவித்தொகை", "பள்ளி", "கல்லூரி"
    ],
    "farmer": [
        "farmer", "farming", "agriculture", "agricultural", "land", "kisan",
        "crop", "cultivable", "pm-kisan", "விவசாயி", "வேளாண்மை", "விவசாய", "நிலம்"
    ],
    "business": [
        "business", "startup", "entrepreneur", "loan", "enterprise", "micro",
        "self employment", "mudra", "pmegp", "stand-up", "seed fund", "vendor",
        "street vendor", "svanidhi", "subsidy", "credit", "தொழில்", "கடன்", "வியாபாரம்"
    ],
    "housing": [
        "housing", "house", "home", "awas", "pmay", "pucca house", "shelter",
        "construction", "flat", "urban housing", "rural housing", "வீடு", "குடியிருப்பு"
    ],
    "health": [
        "health", "medical", "hospital", "hospitalisation", "ayushman", "pmjay",
        "treatment", "insurance card", "cashless", "doctor", "மருத்துவம்", "சிகிச்சை", "மருத்துவமனை"
    ],
    "insurance": [
        "insurance", "bima", "life insurance", "accident insurance", "pmjjby",
        "pmsby", "death cover", "disability", "premium", "காப்பீடு", "ஆயுள் காப்பீடு"
    ],
    "pension": [
        "pension", "old age", "senior citizen", "elderly", "atal pension", "apy",
        "ignoaps", "retirement", "monthly pension", "ஓய்வூதியம்", "முதியோர்"
    ],
    "women": [
        "women", "girl", "woman", "female", "maternity", "pregnant", "sukanya",
        "ssy", "pmmvy", "lactating", "shg", "self help group", "nrlm", "பெண்கள்", "மகளிர்", "தாய்மை"
    ],
    "skill": [
        "skill", "training", "kaushal", "pmkvy", "apprentice", "apprenticeship",
        "naps", "placement", "job training", "திறன் பயிற்சி", "வேலைவாய்ப்பு"
    ],
    "food": [
        "food", "ration", "grain", "wheat", "rice", "antyodaya", "aay",
        "bpl ration", "subsidised food", "உணவு", "ரேஷன்", "அரிசி"
    ]
}


def find_relevant_schemes(message, schemes):
    """
    Find schemes matching query terms, abbreviations, or semantic categories.
    """
    message_lower = clean_text(message).lower()
    matches = []
    matched_categories = set()

    for category, category_keywords in KEYWORDS_MAP.items():
        for keyword in category_keywords:
            if keyword in message_lower:
                matched_categories.add(category)
                break

    # Common stopwords to exclude from matching titles
    STOPWORDS = {"what", "which", "are", "available", "tell", "about", "for", "the", "and", "can", "get", "how", "scheme", "schemes", "yojana"}

    for scheme in schemes:
        scheme_name_clean = clean_text(scheme.name).lower()
        scheme_desc_clean = clean_text(scheme.description).lower()
        scheme_req_clean = clean_text(scheme.requirement).lower()
        scheme_occ_clean = clean_text(scheme.occupation).lower()
        scheme_text = f"{scheme_name_clean} {scheme_desc_clean} {scheme_req_clean} {scheme_occ_clean}"

        matched = False
        priority = 0

        # 1. Scheme abbreviation check e.g. (PMEGP), (PM-KISAN), (PMAY-U)
        if "(" in scheme.name and ")" in scheme.name:
            abbrev = scheme.name.split("(")[-1].split(")")[0].strip().lower()
            if abbrev and abbrev in message_lower:
                matched = True
                priority += 5

        # 2. Acronym or specific brand names (e.g. pmkisan, pmegp, ssy, mudra, pmay, ayushman)
        if not matched:
            for part in scheme_name_clean.replace("(", " ").replace(")", " ").split():
                if len(part) >= 3 and part not in STOPWORDS and part in message_lower:
                    matched = True
                    priority += 3
                    break

        # 3. Domain / Category match (e.g. housing, scholarship, farmer, loan)
        if matched_categories:
            for category in matched_categories:
                for kw in KEYWORDS_MAP[category]:
                    if kw in scheme_text:
                        matched = True
                        priority += 2
                        break

        if matched:
            matches.append((priority, scheme))

    # Sort matches by priority descending
    matches.sort(key=lambda x: x[0], reverse=True)
    return [item[1] for item in matches]


def build_scheme_response(scheme, user=None):
    """
    Create a detailed, grounded response with eligibility personalization if user exists.
    """
    lines = [f"### {scheme.name}"]

    if scheme.description:
        lines.append(f"{scheme.description}")

    if scheme.benefits:
        lines.append(f"\n**💡 Key Benefits:**\n{scheme.benefits}")

    if scheme.eligibility_rules:
        lines.append(f"\n**📋 Who is Eligible?**\n{scheme.eligibility_rules}")

    if scheme.documents:
        lines.append(f"\n**📄 Required Documents:**\n{scheme.documents}")

    if scheme.official_url:
        lines.append(f"\n**🔗 Official Portal:** [{scheme.official_url}]({scheme.official_url})")

    # User personalized highlight if profile is loaded
    if user:
        user_notes = []
        if scheme.occupation and scheme.occupation.lower() not in ["all", "any"]:
            if clean_text(user.occupation).lower() == scheme.occupation.lower():
                user_notes.append(f"✓ Your occupation ({user.occupation}) directly matches this scheme.")
            else:
                user_notes.append(f"ℹ This scheme targets: {scheme.occupation} (Your profile: {user.occupation or 'Not specified'}).")

        if scheme.max_income and user.annual_income:
            try:
                # Basic income check
                user_income_str = str(user.annual_income).replace(",", "")
                income_num = float(re.findall(r"\d+", user_income_str)[0])
                if income_num <= scheme.max_income:
                    user_notes.append("✓ Your income appears to be within the ceiling.")
            except Exception:
                pass

        if user_notes:
            lines.append("\n**👤 Profile Match Insight:**\n" + "\n".join(user_notes))

    lines.append("\n*Please verify final guidelines on the official portal before applying.*")
    return "\n".join(lines)


def call_llm_if_available(system_prompt, user_query):
    """
    Calls Google Gemini API or Groq API if keys are provided in environment.
    Falls back cleanly to None if no key or on network failure.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"{system_prompt}\n\nUser Question: {user_query}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 600
                }
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=8) as response:
                result = json.loads(response.read().decode("utf-8"))
                return result["candidates"][0]["content"]["parts"][0]["text"].strip()
        except Exception:
            pass

    return None


def answer_chat_message(message, schemes, user=None):
    """
    Main GuideX AI conversational RAG engine.
    """
    message_lower = clean_text(message).lower()

    if not message_lower:
        return {
            "message": "Please ask a question about government schemes, eligibility, documents, or application procedures.",
            "intent": "unknown",
            "schemes": []
        }

    # Greetings (English + Tamil)
    greetings = ["hi", "hello", "hey", "hai", "good morning", "good afternoon", "good evening", "namaste", "வணக்கம்", "vanakkam"]
    if message_lower in greetings:
        user_name = f" {user.name}" if user and user.name else ""
        if "வணக்கம்" in message_lower or "vanakkam" in message_lower:
            return {
                "message": (
                    f"வணக்கம்{user_name}! நான் GuideX AI. "
                    "22+ மத்திய அரசு நலத்திட்டங்கள், தகுதிகள், தேவையான ஆவணங்கள் "
                    "மற்றும் விண்ணப்பிக்கும் வழிமுறைகளை அறிய என்னிடம் கேட்கலாம். "
                    "உங்களுக்கு என்ன உதவி தேவை?"
                ),
                "intent": "greeting",
                "schemes": []
            }
        return {
            "message": (
                f"Hello{user_name}! I'm GuideX AI, your GovGuide assistant. "
                "I can help you explore 22+ central schemes, verify eligibility criteria, "
                "identify required documents, and guide your application steps. "
                "What kind of scheme or support are you looking for?"
            ),
            "intent": "greeting",
            "schemes": []
        }

    # Retrieve relevant schemes
    relevant_schemes = find_relevant_schemes(message, schemes)

    # 1. If LLM is available, synthesize with retrieved scheme context (RAG)
    if relevant_schemes:
        context_parts = []
        for s in relevant_schemes[:4]:
            context_parts.append(
                f"Scheme: {s.name}\n"
                f"Description: {s.description}\n"
                f"Eligibility: {s.eligibility_rules}\n"
                f"Benefits: {s.benefits}\n"
                f"Documents: {s.documents}\n"
                f"Portal: {s.official_url}"
            )
        knowledge_context = "\n\n---\n\n".join(context_parts)

        user_info = ""
        if user:
            user_info = f"User Profile: Age={user.age}, State={user.state}, Occupation={user.occupation}, Category={user.category}, Income={user.annual_income}"

        system_prompt = (
            "You are GuideX AI, the official government scheme assistant inside GovGuide. "
            "Answer the citizen's query accurately using ONLY the provided scheme knowledge context and profile details. "
            "Keep answers well-structured with clear bullet points for benefits, eligibility, and links. "
            "Do not fabricate schemes not present in the context.\n\n"
            f"{user_info}\n\n"
            f"Knowledge Base Schemes:\n{knowledge_context}"
        )

        llm_reply = call_llm_if_available(system_prompt, message)
        if llm_reply:
            return {
                "message": llm_reply,
                "intent": "scheme_information",
                "schemes": [{"id": s.id, "name": s.name} for s in relevant_schemes[:4]]
            }

        # Grounded RAG fallback when no LLM key is configured
        responses = [build_scheme_response(s, user=user) for s in relevant_schemes[:3]]
        return {
            "message": "\n\n---\n\n".join(responses),
            "intent": "scheme_information",
            "schemes": [{"id": s.id, "name": s.name} for s in relevant_schemes[:3]]
        }

    # 2. Broad questions like "Am I eligible?" or "What schemes can I get?" with user profile
    if any(q in message_lower for q in ["eligible", "eligibility", "can i apply", "what schemes", "my schemes", "which scheme"]):
        if user:
            occ = clean_text(user.occupation).lower()
            matching_for_user = []
            for s in schemes:
                s_occ = clean_text(s.occupation).lower()
                if s_occ == occ or s_occ in ["all", "any"]:
                    matching_for_user.append(s.name)

            sample_list = "\n".join([f"• **{name}**" for name in matching_for_user[:5]])
            return {
                "message": (
                    f"Based on your profile as **{user.occupation or 'Resident'}** ({user.state or 'All India'}):\n\n"
                    f"Here are top schemes potentially matching your background:\n{sample_list}\n\n"
                    f"You can check your detailed 100% eligibility score in the **Find My Schemes** section on your dashboard, or ask me about any of these schemes directly!"
                ),
                "intent": "eligibility",
                "schemes": []
            }
        else:
            return {
                "message": (
                    "To tell you exactly what you're eligible for, please complete your GovGuide profile "
                    "(occupation, age, income, and state) and click **Find My Schemes**!"
                ),
                "intent": "eligibility",
                "schemes": []
            }

    # 3. Document guidance question
    if any(k in message_lower for k in ["document", "documents", "proof", "certificate", "papers", "aadhaar"]):
        return {
            "message": (
                "I can tell you the exact document checklist for any scheme! "
                "Which scheme would you like documents for? "
                "(For example: *PM-USP*, *PMEGP*, *PMAY Housing*, *PM-KISAN*, or *Ayushman Bharat*)"
            ),
            "intent": "documents",
            "schemes": []
        }

    # 4. Application guidance question
    if any(k in message_lower for k in ["apply", "application", "how to apply", "registration", "portal"]):
        return {
            "message": (
                "To apply for a scheme, GovGuide guides you with official portal links and step-by-step preparation! "
                "Please tell me the name of the scheme you want to apply for (e.g., *PMEGP*, *PM-USP*, *Mudra loan*)."
            ),
            "intent": "application",
            "schemes": []
        }

    # Default fallback
    return {
        "message": (
            "I'm GuideX AI. You can ask me questions about any of the 22 government schemes, such as:\n"
            "• *\"What housing schemes are available?\"*\n"
            "• *\"What is Ayushman Bharat PMJAY?\"*\n"
            "• *\"What documents are needed for PMEGP?\"*\n"
            "• *\"Tell me about student scholarships\"*\n"
            "• *\"Which schemes can I get as a farmer?\"*"
        ),
        "intent": "general",
        "schemes": []
    }
