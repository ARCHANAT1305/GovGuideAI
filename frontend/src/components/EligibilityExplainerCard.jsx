import React, { useState } from "react";
import {
  XCircle,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  Info,
  Lightbulb,
} from "lucide-react";
import { tr } from "../utils/contentTranslations";

/**
 * Generates a human-readable, AI-style plain-English explanation
 * of WHY a citizen is not eligible for a scheme, based on backend data.
 */
function buildExplainerReasons(scheme, profile, lang) {
  const reasons = [];

  const failed = [
    ...(scheme.failed_conditions || []),
    ...(scheme.failed_checks || []),
  ];

  const missing = [
    ...(scheme.missing_information || []),
    ...(scheme.missing || []),
  ];

  const schemeName = scheme.name || "this scheme";
  const income = profile?.annual_income || "";
  const occupation = profile?.occupation || "";
  const age = profile?.age || "";
  const category = profile?.category || "";

  // ── INCOME CHECK ──────────────────────────────────────────────
  if (
    failed.some(
      (f) =>
        f.toLowerCase().includes("income") ||
        f.toLowerCase().includes("lakh")
    )
  ) {
    const incomeLimit =
      schemeName.toLowerCase().includes("pm-usp") ||
      schemeName.toLowerCase().includes("scholarship")
        ? "₹4.5 Lakhs"
        : schemeName.toLowerCase().includes("pmay")
        ? "₹18 Lakhs"
        : schemeName.toLowerCase().includes("pmjay")
        ? "₹5 Lakhs"
        : null;

    if (lang === "ta") {
      reasons.push({
        icon: "income",
        title: "குடும்ப வருமான வரம்பு மீறல் (Income Limit Exceeded)",
        detail: incomeLimit
          ? `இந்த திட்டத்திற்கு குடும்ப ஆண்டு வருமானம் ${incomeLimit}-க்கு உள்ளே இருக்க வேண்டும். உங்கள் வருமானம் (${income}) அதிகமாக உள்ளது.`
          : `உங்கள் குடும்ப வருமானம் (${income}) இந்த திட்டத்தின் வருமான வரம்பை தாண்டுகிறது.`,
        fix:
          "வருமான சான்றிதழ் மூலம் சரியான வருமான விவரங்களை உறுதிப்படுத்தவும், அல்லது மற்ற திட்டங்களை சரிபார்க்கவும்.",
      });
    } else {
      reasons.push({
        icon: "income",
        title: "Annual Income Exceeds the Scheme Limit",
        detail: incomeLimit
          ? `${schemeName} requires a household annual income below ${incomeLimit}. Your entered income (${income}) is above this ceiling.`
          : `Your household income (${income}) exceeds the maximum income limit for this scheme.`,
        fix: "Verify your income with an official Income Certificate or explore schemes with higher income thresholds.",
      });
    }
  }

  // ── AGE CHECK ─────────────────────────────────────────────────
  if (
    failed.some(
      (f) =>
        f.toLowerCase().includes("age") || f.toLowerCase().includes("year")
    )
  ) {
    if (lang === "ta") {
      reasons.push({
        icon: "age",
        title: "வயது தகுதி பொருந்தவில்லை (Age Mismatch)",
        detail: `உங்கள் வயது (${age}) இந்த திட்டத்தின் வயது வரம்பிற்கு பொருந்தவில்லை.`,
        fix: "வயது வரம்பு பொருந்தும் மற்ற திட்டங்களை GovGuide மூலம் கண்டறியுங்கள்.",
      });
    } else {
      reasons.push({
        icon: "age",
        title: "Age Does Not Meet the Scheme Requirement",
        detail: `Your age (${age}) does not fall within the eligible age range defined for this scheme.`,
        fix: "Check other schemes in GovGuide that are open to your age group.",
      });
    }
  }

  // ── OCCUPATION CHECK ──────────────────────────────────────────
  if (
    failed.some(
      (f) =>
        f.toLowerCase().includes("occupation") ||
        f.toLowerCase().includes("farmer") ||
        f.toLowerCase().includes("entrepreneur") ||
        f.toLowerCase().includes("student")
    )
  ) {
    const requiredOccupation = schemeName.toLowerCase().includes("kisan")
      ? lang === "ta"
        ? "விவசாயி (Farmer)"
        : "Farmer"
      : schemeName.toLowerCase().includes("pmegp")
      ? lang === "ta"
        ? "தொழில்முனைவோர் (Entrepreneur)"
        : "Entrepreneur"
      : schemeName.toLowerCase().includes("usp") ||
        schemeName.toLowerCase().includes("scholarship")
      ? lang === "ta"
        ? "மாணவர் (Student)"
        : "Student"
      : lang === "ta"
      ? "குறிப்பிட்ட தொழில்"
      : "a specific occupation";

    if (lang === "ta") {
      reasons.push({
        icon: "occupation",
        title: "தொழில் பொருந்தவில்லை (Occupation Mismatch)",
        detail: `இந்த திட்டம் ${requiredOccupation}-களுக்காக மட்டுமே. உங்கள் தொழில் (${occupation}) பொருந்தவில்லை.`,
        fix: "உங்கள் தொழிலுக்கு பொருந்தும் திட்டங்களை GovGuide மூலம் கண்டறியுங்கள்.",
      });
    } else {
      reasons.push({
        icon: "occupation",
        title: "Occupation Does Not Qualify for This Scheme",
        detail: `This scheme is exclusively for ${requiredOccupation}s. Your registered occupation (${occupation}) does not meet this requirement.`,
        fix: `Update your occupation in Step 1 if incorrect, or explore other schemes matching your profession.`,
      });
    }
  }

  // ── LAND HOLDING CHECK ────────────────────────────────────────
  if (
    failed.some(
      (f) =>
        f.toLowerCase().includes("land") ||
        f.toLowerCase().includes("hectare")
    )
  ) {
    if (lang === "ta") {
      reasons.push({
        icon: "land",
        title: "நில வரம்பு பொருந்தவில்லை (Land Holding Issue)",
        detail:
          "உங்கள் நில விவரங்கள் (Land Holding) PM-KISAN திட்டத்தின் நில வரம்பை மீறுகின்றன அல்லது சரியாக உள்ளிடப்படவில்லை.",
        fix: "Step 1-ல் சரியான நில அளவை (ஹெக்டேர்களில்) உள்ளிடவும்.",
      });
    } else {
      reasons.push({
        icon: "land",
        title: "Land Holding Does Not Meet the Requirement",
        detail:
          "Your land holding details either exceed the scheme's permitted limit or have not been entered correctly.",
        fix: "Go back to Step 1 and enter your land holding in hectares (e.g. 1.5).",
      });
    }
  }

  // ── CATEGORY / CASTE CHECK ────────────────────────────────────
  if (
    failed.some(
      (f) =>
        f.toLowerCase().includes("category") ||
        f.toLowerCase().includes("caste") ||
        f.toLowerCase().includes("sc") ||
        f.toLowerCase().includes("st") ||
        f.toLowerCase().includes("obc")
    )
  ) {
    if (lang === "ta") {
      reasons.push({
        icon: "category",
        title: "சாதி / பிரிவு தகுதி பொருந்தவில்லை (Category Mismatch)",
        detail: `உங்கள் பிரிவு (${category}) இந்த திட்டத்திற்கான குறிப்பிட்ட சமூக பிரிவு தேவைகளை பூர்த்தி செய்யவில்லை.`,
        fix: "SC/ST/OBC சான்றிதழை தயார் செய்து, பொருந்தும் திட்டங்களை சரிபார்க்கவும்.",
      });
    } else {
      reasons.push({
        icon: "category",
        title: "Social Category Does Not Match",
        detail: `Your registered category (${category}) does not meet the reserved category requirement of this scheme.`,
        fix: "Check schemes under the 'General' or your specific category. Prepare your Community Certificate if needed.",
      });
    }
  }

  // ── MISSING INFORMATION ───────────────────────────────────────
  if (missing.length > 0 && reasons.length === 0) {
    if (lang === "ta") {
      reasons.push({
        icon: "missing",
        title: "சில விவரங்கள் இன்னும் உள்ளிடப்படவில்லை (Incomplete Profile)",
        detail: `தகுதியை உறுதிப்படுத்த கீழ்க்கண்ட விவரங்கள் தேவை: ${missing.slice(0, 3).join(", ")}.`,
        fix: "Step 1-ல் சுயவிவரத்தை முழுமையாக நிரப்பி மீண்டும் தேடுங்கள்.",
      });
    } else {
      reasons.push({
        icon: "missing",
        title: "Profile Information Is Incomplete",
        detail: `GovGuide could not fully evaluate this scheme because the following details are missing: ${missing.slice(0, 3).join(", ")}.`,
        fix: "Go back to Step 1 and complete all profile fields, then search again.",
      });
    }
  }

  // ── GENERIC FALLBACK ──────────────────────────────────────────
  if (reasons.length === 0) {
    if (lang === "ta") {
      reasons.push({
        icon: "general",
        title: "தகுதி பெறவில்லை (Not Eligible)",
        detail:
          "உங்கள் சுயவிவர விவரங்கள் இந்த திட்டத்தின் ஒன்று அல்லது அதிக தகுதி நிபந்தனைகளை பூர்த்தி செய்யவில்லை.",
        fix: "Step 1-ல் உங்கள் விவரங்களை சரிபார்த்து மீண்டும் தேடுங்கள்.",
      });
    } else {
      reasons.push({
        icon: "general",
        title: "One or More Eligibility Conditions Not Met",
        detail:
          "Your profile details do not satisfy one or more specific eligibility conditions of this scheme.",
        fix: "Review your profile details in Step 1 and search again for an updated match.",
      });
    }
  }

  return reasons;
}

// Icon picker per reason type
function ReasonIcon({ type }) {
  switch (type) {
    case "income":
      return (
        <span className="explainer-reason-icon income-icon" title="Income">
          ₹
        </span>
      );
    case "age":
      return (
        <span className="explainer-reason-icon age-icon" title="Age">
          🎂
        </span>
      );
    case "occupation":
      return (
        <span
          className="explainer-reason-icon occupation-icon"
          title="Occupation"
        >
          💼
        </span>
      );
    case "land":
      return (
        <span className="explainer-reason-icon land-icon" title="Land">
          🌾
        </span>
      );
    case "category":
      return (
        <span
          className="explainer-reason-icon category-icon"
          title="Category"
        >
          🪪
        </span>
      );
    case "missing":
      return (
        <span
          className="explainer-reason-icon missing-icon"
          title="Incomplete"
        >
          📋
        </span>
      );
    default:
      return (
        <span className="explainer-reason-icon general-icon" title="General">
          ⚠️
        </span>
      );
  }
}

export default function EligibilityExplainerCard({ scheme, profile, lang = "en" }) {
  const [isOpen, setIsOpen] = useState(false);

  // Only render for not-eligible or information-required schemes
  const isNotEligible =
    !scheme.eligible ||
    scheme.status === "not_eligible" ||
    scheme.opportunity_status === "not_eligible";

  const isInfoRequired =
    scheme.status === "information_required" ||
    scheme.opportunity_status === "information_required";

  if (!isNotEligible && !isInfoRequired) return null;

  // Also skip if there are no failed conditions and no missing info
  const hasFailedData =
    (scheme.failed_conditions?.length || 0) +
      (scheme.failed_checks?.length || 0) +
      (scheme.missing_information?.length || 0) +
      (scheme.missing?.length || 0) >
    0;

  const reasons = buildExplainerReasons(scheme, profile, lang);

  const headerLabel = isInfoRequired
    ? lang === "ta"
      ? "📋 ஏன் கூடுதல் தகவல் தேவை?"
      : "📋 Why Is More Information Needed?"
    : lang === "ta"
    ? "❓ ஏன் தகுதி பெறவில்லை? (Why Not Eligible?)"
    : "❓ Why Am I Not Eligible?";

  const scoreColor =
    (scheme.eligibility_score || 0) >= 70
      ? "score-amber"
      : (scheme.eligibility_score || 0) >= 40
      ? "score-orange"
      : "score-red";

  return (
    <div className={`explainer-card ${isInfoRequired ? "explainer-info" : "explainer-not-eligible"}`}>
      {/* HEADER — always visible */}
      <button
        type="button"
        className="explainer-header"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="explainer-header-left">
          <span className="explainer-header-icon">
            {isInfoRequired ? (
              <Info size={16} />
            ) : (
              <XCircle size={16} />
            )}
          </span>
          <span className="explainer-header-label">{headerLabel}</span>
        </div>

        <div className="explainer-header-right">
          <span className={`explainer-score-pill ${scoreColor}`}>
            {lang === "ta" ? "பொருத்தம்:" : "Match:"}{" "}
            <strong>{scheme.eligibility_score ?? 0}%</strong>
          </span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* EXPANDED BODY */}
      {isOpen && (
        <div className="explainer-body">
          {/* QUICK SCORE METER */}
          <div className="explainer-score-row">
            <div className="explainer-score-bar-bg">
              <div
                className={`explainer-score-bar-fill ${scoreColor}`}
                style={{ width: `${scheme.eligibility_score ?? 0}%` }}
              />
            </div>
            <span className="explainer-score-label">
              {lang === "ta"
                ? `${scheme.eligibility_score ?? 0}% தகுதி பொருத்தம்`
                : `${scheme.eligibility_score ?? 0}% eligibility match`}
            </span>
          </div>

          {/* PASSED CHECKS — What you already meet */}
          {scheme.passed_checks?.length > 0 && (
            <div className="explainer-section passed-section">
              <div className="explainer-section-title">
                <CheckCircle2 size={14} className="text-green" />
                <span>
                  {lang === "ta"
                    ? "நீங்கள் பூர்த்தி செய்த தகுதிகள்:"
                    : "Criteria You Already Meet:"}
                </span>
              </div>
              <ul className="explainer-check-list">
                {scheme.passed_checks.slice(0, 4).map((check, i) => (
                  <li key={i} className="passed-check">
                    <CheckCircle2 size={13} />
                    <span>{tr(check, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* BLOCKING REASONS — Core explainer */}
          <div className="explainer-section reasons-section">
            <div className="explainer-section-title">
              <AlertTriangle size={14} className="text-amber" />
              <span>
                {lang === "ta"
                  ? "தகுதி பெற முடியாத காரணங்கள்:"
                  : "Specific Reasons You Are Not Eligible:"}
              </span>
            </div>

            <div className="explainer-reasons-list">
              {reasons.map((reason, i) => (
                <div className="explainer-reason-card" key={i}>
                  <ReasonIcon type={reason.icon} />
                  <div className="explainer-reason-text">
                    <strong className="reason-title">{reason.title}</strong>
                    <p className="reason-detail">{reason.detail}</p>
                    <div className="reason-fix">
                      <Lightbulb size={13} className="fix-icon" />
                      <span>
                        {lang === "ta" ? "என்ன செய்யலாம்: " : "What to do: "}
                        {reason.fix}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPPORTUNITY SECTION — Future path */}
          {scheme.opportunity_gaps?.length > 0 && (
            <div className="explainer-section opportunity-section">
              <div className="explainer-section-title">
                <TrendingUp size={14} className="text-blue" />
                <span>
                  {lang === "ta"
                    ? "எதிர்காலத்தில் தகுதி பெற:"
                    : "How to Become Eligible in the Future:"}
                </span>
              </div>
              <ul className="explainer-check-list">
                {scheme.opportunity_gaps.map((gap, i) => (
                  <li key={i} className="opportunity-gap">
                    <ArrowRight size={13} />
                    <span>{tr(gap, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ALTERNATIVE SUGGESTION */}
          <div className="explainer-alt-suggestion">
            <span>
              {lang === "ta"
                ? "💡 குறிப்பு: Step 1-ல் உங்கள் விவரங்களை சரிபார்த்து திருத்தினால், உங்கள் தகுதி மேம்படலாம். மற்ற ✅ தகுதிபெற்ற திட்டங்களை மேலே பாருங்கள்."
                : "💡 Tip: Review and correct your profile details in Step 1 — your eligibility score may improve. Also check the ✅ Eligible schemes listed above."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
