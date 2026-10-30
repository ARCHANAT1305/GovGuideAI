import React, { useState, useMemo } from "react";
import { Calculator, Sparkles, TrendingUp, HelpCircle, CheckCircle2, ChevronRight, X } from "lucide-react";
import { tr } from "../utils/contentTranslations";

export default function SubsidyCalculator({
  lang = "en",
  initialScheme = "pmegp",
  onClose,
  embedded = false,
}) {
  const [selectedScheme, setSelectedScheme] = useState(initialScheme);
  const [projectCost, setProjectCost] = useState(500000); // 5 Lakhs default
  const [area, setArea] = useState("rural"); // 'rural' | 'urban'
  const [category, setCategory] = useState("special"); // 'special' (SC/ST/OBC/Women) | 'general'
  const [sector, setSector] = useState("manufacturing"); // 'manufacturing' | 'service'
  const [tenureYears, setTenureYears] = useState(5); // 5 years default
  const [interestRate, setInterestRate] = useState(9.5); // 9.5% p.a.

  // Schemes available in the calculator
  const schemesList = [
    {
      id: "pmegp",
      nameEn: "PMEGP Business Subsidy",
      nameTa: "PMEGP தொழில் மானிய திட்டம்",
      maxAmount: 2500000,
      minAmount: 50000,
      step: 25000,
      presets: [100000, 200000, 500000, 1000000, 2000000],
    },
    {
      id: "mudra",
      nameEn: "Pradhan Mantri MUDRA Loan",
      nameTa: "பிரதமர் முத்ரா தொழில் கடன்",
      maxAmount: 1000000,
      minAmount: 20000,
      step: 10000,
      presets: [50000, 100000, 300000, 500000, 1000000],
    },
    {
      id: "pmay",
      nameEn: "PMAY Housing Subsidy",
      nameTa: "பிரதமர் வீட்டு வசதி மானியம் (PMAY)",
      maxAmount: 1800000,
      minAmount: 100000,
      step: 50000,
      presets: [300000, 600000, 900000, 1200000, 1800000],
    },
    {
      id: "pm_svanidhi",
      nameEn: "PM SVANidhi (Street Vendors)",
      nameTa: "PM சுவநிதி தெருவோர வியாபாரிகள் கடன்",
      maxAmount: 50000,
      minAmount: 10000,
      step: 5000,
      presets: [10000, 20000, 50000],
    },
  ];

  // Adjust max / min when switching schemes
  const currentSchemeConfig = schemesList.find((s) => s.id === selectedScheme) || schemesList[0];

  const handleSchemeChange = (id) => {
    setSelectedScheme(id);
    if (id === "pm_svanidhi") {
      setProjectCost(10000);
      setTenureYears(1);
    } else if (id === "mudra") {
      setProjectCost(200000);
      setTenureYears(3);
    } else if (id === "pmay") {
      setProjectCost(600000);
      setTenureYears(15);
    } else {
      setProjectCost(500000);
      setTenureYears(5);
    }
  };

  // Calculations
  const calculation = useMemo(() => {
    let subsidyPct = 0;
    let ownContributionPct = 0;
    let subsidyAmount = 0;
    let ownContribution = 0;
    let loanAmount = 0;
    let notes = "";

    if (selectedScheme === "pmegp") {
      // PMEGP Rules:
      // Special category (SC/ST/OBC/Women/Minorities/Ex-servicemen):
      // Rural: 35% subsidy, 5% own contribution.
      // Urban: 25% subsidy, 5% own contribution.
      // General:
      // Rural: 25% subsidy, 10% own contribution.
      // Urban: 15% subsidy, 10% own contribution.
      if (category === "special") {
        ownContributionPct = 5;
        subsidyPct = area === "rural" ? 35 : 25;
      } else {
        ownContributionPct = 10;
        subsidyPct = area === "rural" ? 25 : 15;
      }

      subsidyAmount = Math.round((projectCost * subsidyPct) / 100);
      ownContribution = Math.round((projectCost * ownContributionPct) / 100);
      loanAmount = projectCost - ownContribution; // bank initially sanctions loan, subsidy adjusts margin money

      notes =
        lang === "ta"
          ? `அரசு தரும் ரூ. ${subsidyAmount.toLocaleString(
              "en-IN"
            )} மானியம் திருப்பிச் செலுத்தத் தேவையில்லை (Free Govt Grant). நீங்கள் ரூ. ${ownContribution.toLocaleString(
              "en-IN"
            )} மட்டுமே முதலீடு செய்ய வேண்டும்.`
          : `Govt grant of ₹${subsidyAmount.toLocaleString(
              "en-IN"
            )} is non-repayable. You only need to invest ₹${ownContribution.toLocaleString(
              "en-IN"
            )} from your own funds.`;
    } else if (selectedScheme === "mudra") {
      // Mudra: Collateral free
      // Shishu: up to 50k (0% own), Kishor: 50k-5L (up to 10% own), Tarun: 5L-10L (10-15% own)
      if (projectCost <= 50000) {
        ownContributionPct = 0;
      } else if (projectCost <= 500000) {
        ownContributionPct = 5;
      } else {
        ownContributionPct = 10;
      }
      subsidyPct = 0; // Mudra has no capital subsidy, but collateral-free & subsidized processing
      subsidyAmount = 0;
      ownContribution = Math.round((projectCost * ownContributionPct) / 100);
      loanAmount = projectCost - ownContribution;

      const mudraCategory =
        projectCost <= 50000 ? "Shishu" : projectCost <= 500000 ? "Kishor" : "Tarun";

      notes =
        lang === "ta"
          ? `முத்ரா வகை: ${mudraCategory}. எந்த சொத்துப் பிணையமும் (No Collateral) தேவையில்லை. வங்கி மூலமாக நேரடியாக கடன் பெறலாம்.`
          : `MUDRA Category: ${mudraCategory}. 100% collateral-free bank loan with zero processing fee.`;
    } else if (selectedScheme === "pmay") {
      // PMAY Interest Subsidy (CLSS)
      // Up to 6L loan: 6.5% interest subsidy (approx ₹2.67 Lakhs max subsidy)
      const eligibleLoanForSubsidy = Math.min(projectCost, 600000);
      subsidyAmount = Math.round(eligibleLoanForSubsidy * 0.35); // Approx upfront NPV of 6.5% subsidy
      ownContributionPct = 10;
      ownContribution = Math.round((projectCost * ownContributionPct) / 100);
      loanAmount = projectCost - ownContribution;
      subsidyPct = Math.round((subsidyAmount / projectCost) * 100);

      notes =
        lang === "ta"
          ? `வீட்டுக் கடன் வட்டி மானியமாக சுமார் ரூ. ${subsidyAmount.toLocaleString(
              "en-IN"
            )} உங்கள் கடன் கணக்கில் நேரடியாக வரவு வைக்கப்படும்.`
          : `Interest subsidy of approx ₹${subsidyAmount.toLocaleString(
              "en-IN"
            )} credited upfront to your home loan account.`;
    } else if (selectedScheme === "pm_svanidhi") {
      // PM SVANidhi: 7% interest subsidy
      ownContributionPct = 0;
      ownContribution = 0;
      loanAmount = projectCost;
      subsidyAmount = Math.round(projectCost * 0.07); // 7% interest rebate
      subsidyPct = 7;

      notes =
        lang === "ta"
          ? `தெருவோர வியாபாரிகளுக்கு பிணையில்லா கடன். சரியான தவணையில் திருப்பிச் செலுத்தினால் 7% வட்டி மானியம் & டிஜிட்டல் கேஷ்பேக் உண்டு.`
          : `Collateral-free working capital loan for street vendors. 7% interest cashback credited to your bank account upon timely repayment.`;
    }

    // Monthly EMI Calculation
    // Formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const principal = selectedScheme === "pmegp" ? loanAmount - subsidyAmount : loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;

    let emi = 0;
    if (principal > 0 && monthlyRate > 0 && totalMonths > 0) {
      emi = Math.round(
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
      );
    }

    return {
      subsidyPct,
      ownContributionPct,
      subsidyAmount,
      ownContribution,
      loanAmount,
      netLoanPayable: principal,
      emi,
      notes,
    };
  }, [selectedScheme, projectCost, area, category, sector, tenureYears, interestRate, lang]);

  return (
    <div className={`subsidy-calc-card ${embedded ? "embedded" : ""}`}>
      {/* Header */}
      <div className="subsidy-calc-header">
        <div className="calc-title-box">
          <div className="calc-icon-badge">
            <Calculator size={20} />
          </div>
          <div>
            <h3>
              {lang === "ta"
                ? "அரசு மானியம் & மாதாந்திர தவணை கணக்கீட்டுக் கருவி"
                : "Government Subsidy & EMI Calculator"}
            </h3>
            <p className="calc-subtitle">
              {lang === "ta"
                ? "தொழில் கடன், திட்ட மானியம் மற்றும் தவணையை நேரலையாக கணக்கிடுங்கள்"
                : "Simulate real-time government subsidies, loan sanctions, and monthly EMI"}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            className="calc-close-btn"
            onClick={onClose}
            aria-label="Close calculator"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Scheme Selector Tabs */}
      <div className="calc-scheme-tabs">
        {schemesList.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`calc-scheme-tab ${selectedScheme === s.id ? "active" : ""}`}
            onClick={() => handleSchemeChange(s.id)}
          >
            {lang === "ta" ? s.nameTa : s.nameEn}
          </button>
        ))}
      </div>

      {/* Grid: Inputs on Left, Visual Results on Right */}
      <div className="calc-body-grid">
        {/* Left: Input Controls */}
        <div className="calc-controls-col">
          {/* Project Cost Slider */}
          <div className="calc-control-group">
            <div className="control-label-row">
              <label>
                {lang === "ta"
                  ? "திட்ட மதிப்பு / தேவையான கடன் தொகை"
                  : "Project Cost / Loan Amount"}
              </label>
              <span className="control-val-badge">
                ₹{projectCost.toLocaleString("en-IN")}
              </span>
            </div>

            <input
              type="range"
              min={currentSchemeConfig.minAmount}
              max={currentSchemeConfig.maxAmount}
              step={currentSchemeConfig.step}
              value={projectCost}
              onChange={(e) => setProjectCost(Number(e.target.value))}
              className="calc-range-slider"
            />

            {/* Quick preset chips */}
            <div className="calc-preset-chips">
              {currentSchemeConfig.presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`calc-chip ${projectCost === preset ? "selected" : ""}`}
                  onClick={() => setProjectCost(preset)}
                >
                  ₹{(preset / 100000).toFixed(preset >= 100000 ? 1 : 2).replace(".0", "")}{" "}
                  {preset >= 100000 ? (lang === "ta" ? "லட்சம்" : "Lakh") : "k"}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Category Selectors (Relevant for PMEGP & PMAY) */}
          {selectedScheme === "pmegp" && (
            <div className="calc-row-2col">
              <div className="calc-control-group">
                <label>{lang === "ta" ? "பகுதி (இருப்பிடம்)" : "Location / Area"}</label>
                <div className="calc-toggle-btn-group">
                  <button
                    type="button"
                    className={`toggle-btn ${area === "rural" ? "active" : ""}`}
                    onClick={() => setArea("rural")}
                  >
                    {lang === "ta" ? "கிராமப்புறம் (Rural)" : "Rural (Village)"}
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${area === "urban" ? "active" : ""}`}
                    onClick={() => setArea("urban")}
                  >
                    {lang === "ta" ? "நகர்ப்புறம் (Urban)" : "Urban (City)"}
                  </button>
                </div>
              </div>

              <div className="calc-control-group">
                <label>{lang === "ta" ? "பிரிவு (வகைப்பாடு)" : "Category"}</label>
                <div className="calc-toggle-btn-group">
                  <button
                    type="button"
                    className={`toggle-btn ${category === "special" ? "active" : ""}`}
                    onClick={() => setCategory("special")}
                    title="SC/ST/OBC/Women/Minority"
                  >
                    {lang === "ta" ? "சிறப்பு / பெண்கள்" : "Special / Women"}
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${category === "general" ? "active" : ""}`}
                    onClick={() => setCategory("general")}
                  >
                    {lang === "ta" ? "பொது (General)" : "General"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tenure Slider */}
          <div className="calc-control-group">
            <div className="control-label-row">
              <label>
                {lang === "ta" ? "கடன் திருப்பிச் செலுத்தும் காலம்" : "Loan Repayment Tenure"}
              </label>
              <span className="control-val-badge">
                {tenureYears} {lang === "ta" ? "ஆண்டுகள்" : "Years"} ({tenureYears * 12} mo)
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={selectedScheme === "pmay" ? 20 : 7}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="calc-range-slider"
            />
          </div>
        </div>

        {/* Right: Dynamic Financial Outputs */}
        <div className="calc-results-col">
          {/* Key Output Metrics Cards */}
          <div className="calc-metrics-grid">
            {/* 1. Subsidy Card */}
            <div className="calc-metric-card subsidy-metric">
              <span className="metric-tag">
                {lang === "ta" ? "அரசு தரும் இலவச மானியம்" : "Govt Grant / Subsidy"}
              </span>
              <div className="metric-val text-green">
                ₹{calculation.subsidyAmount.toLocaleString("en-IN")}
              </div>
              <span className="metric-sub">
                {calculation.subsidyPct > 0 ? (
                  <>
                    <strong>{calculation.subsidyPct}%</strong>{" "}
                    {lang === "ta" ? "அரசு சலுகை" : "of project cost"}
                  </>
                ) : (
                  lang === "ta" ? "வட்டிச் சலுகை" : "Subsidized Interest"
                )}
              </span>
            </div>

            {/* 2. Own Contribution Card */}
            <div className="calc-metric-card own-metric">
              <span className="metric-tag">
                {lang === "ta" ? "உங்கள் சொந்த முதலீடு" : "Your Own Investment"}
              </span>
              <div className="metric-val text-blue">
                ₹{calculation.ownContribution.toLocaleString("en-IN")}
              </div>
              <span className="metric-sub">
                <strong>{calculation.ownContributionPct}%</strong>{" "}
                {lang === "ta" ? "தொடக்க மூலதனம்" : "margin money"}
              </span>
            </div>

            {/* 3. Monthly EMI Card */}
            <div className="calc-metric-card emi-metric">
              <span className="metric-tag">
                {lang === "ta" ? "மதிப்பிடப்பட்ட மாதாந்திர தவணை" : "Estimated Monthly EMI"}
              </span>
              <div className="metric-val text-indigo">
                ₹{calculation.emi.toLocaleString("en-IN")}{" "}
                <small>{lang === "ta" ? "/மாதம்" : "/mo"}</small>
              </div>
              <span className="metric-sub">
                @ {interestRate}% p.a. • {tenureYears} yrs
              </span>
            </div>
          </div>

          {/* Visual Breakdown Bar */}
          <div className="calc-breakdown-box">
            <div className="breakdown-labels">
              <span>{lang === "ta" ? "நிதி பங்கீடு விகிதம்" : "Funding Breakdown Ratio"}:</span>
              <span className="breakdown-legend">
                <span className="legend-dot green"></span> {lang === "ta" ? "மானியம்" : "Subsidy"}{" "}
                ({calculation.subsidyPct}%)
                <span className="legend-dot blue"></span> {lang === "ta" ? "முதலீடு" : "Self"}{" "}
                ({calculation.ownContributionPct}%)
                <span className="legend-dot indigo"></span> {lang === "ta" ? "வங்கி கடன்" : "Loan"}
              </span>
            </div>

            <div className="stacked-progress-bar">
              {calculation.subsidyPct > 0 && (
                <div
                  className="progress-slice slice-subsidy"
                  style={{ width: `${calculation.subsidyPct}%` }}
                  title={`Subsidy: ₹${calculation.subsidyAmount.toLocaleString("en-IN")}`}
                />
              )}
              {calculation.ownContributionPct > 0 && (
                <div
                  className="progress-slice slice-own"
                  style={{ width: `${calculation.ownContributionPct}%` }}
                  title={`Self: ₹${calculation.ownContribution.toLocaleString("en-IN")}`}
                />
              )}
              <div
                className="progress-slice slice-loan"
                style={{
                  width: `${Math.max(
                    0,
                    100 - calculation.subsidyPct - calculation.ownContributionPct
                  )}%`,
                }}
                title={`Bank Loan: ₹${calculation.loanAmount.toLocaleString("en-IN")}`}
              />
            </div>
          </div>

          {/* Smart Policy Summary */}
          <div className="calc-policy-note">
            <CheckCircle2 size={16} className="policy-icon" />
            <p>{calculation.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
