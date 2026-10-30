import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  ExternalLink,
  FileText,
  Landmark,
  LoaderCircle,
  LogOut,
  MessageCircle,
  Search,
  SearchCheck,
  AlertCircle,
  CircleCheck,
  CircleX,
  Globe,
  Calculator,
} from "lucide-react";
import { translations } from "../utils/translations";
import { tr } from "../utils/contentTranslations";
import AudioReaderButton from "../components/AudioReaderButton";
import SubsidyCalculator from "../components/SubsidyCalculator";
import DigitalBeneficiaryCard from "../components/DigitalBeneficiaryCard";
import EligibilityExplainerCard from "../components/EligibilityExplainerCard";
import "./Dashboard.css";

const API_BASE_URL = "http://127.0.0.1:8000";

const emptyProfile = {
  age: "",
  gender: "",
  state: "",
  occupation: "",
  annual_income: "",
  category: "",
  requirement: "",
  land_holding: "",
  education_level: "",
  student_status: "",
  class12_percentile: "",
  existing_business: "",
  other_scholarship: "",
};

const incomeRangeToNumber = (income) => {
  switch (income) {
    case "Below ₹1 Lakh":
      return "50000";
    case "₹1 - ₹2.5 Lakhs":
      return "175000";
    case "₹2.5 - ₹5 Lakhs":
      return "375000";
    case "₹5 - ₹10 Lakhs":
      return "750000";
    case "Above ₹10 Lakhs":
      return "1000001";
    default:
      return income || "";
  }
};

const numberToIncomeRange = (income) => {
  if (income === null || income === undefined || income === "") {
    return "";
  }

  const value = Number(income);

  if (!Number.isFinite(value)) {
    return income || "";
  }

  if (value < 100000) {
    return "Below ₹1 Lakh";
  }

  if (value <= 250000) {
    return "₹1 - ₹2.5 Lakhs";
  }

  if (value <= 500000) {
    return "₹2.5 - ₹5 Lakhs";
  }

  if (value <= 1000000) {
    return "₹5 - ₹10 Lakhs";
  }

  return "Above ₹10 Lakhs";
};

const toProfileForm = (profile) => ({
  age: profile.age ?? "",
  gender: profile.gender ?? "",
  state: profile.state ?? "",
  occupation: profile.occupation ?? "",
  annual_income: numberToIncomeRange(profile.annual_income),
  category: profile.category ?? "",
  requirement: profile.requirement ?? "",
  land_holding: profile.land_holding ?? "",
  education_level: profile.education_level ?? "",
  student_status: profile.student_status ?? "",
  class12_percentile: profile.class12_percentile ?? "",
  existing_business: profile.existing_business ?? "",
  other_scholarship: profile.other_scholarship ?? "",
});

function Dashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  const [profile, setProfile] = useState(emptyProfile);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [matchSummary, setMatchSummary] = useState(null);
  const [expandedScheme, setExpandedScheme] = useState(null);

  const [applications, setApplications] = useState({});
  const [updatingAppSchemeId, setUpdatingAppSchemeId] = useState(null);
  const [refInputs, setRefInputs] = useState({});

  // Interactive Subsidy & Benefit Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInitialScheme, setCalcInitialScheme] = useState("pmegp");

  // Language state (en / ta)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("govguide_lang") || "en";
  });

  const t = translations[lang] || translations.en;

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem("govguide_lang", newLang);
  };

  // Chat assistant state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: t.chatGreeting,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Completed reminders state with localStorage persistence
  const [completedReminders, setCompletedReminders] = useState(() => {
    try {
      const saved = localStorage.getItem("govguide_completed_reminders");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleReminder = (reminderKey) => {
    setCompletedReminders((prev) => {
      const updated = { ...prev, [reminderKey]: !prev[reminderKey] };
      try {
        localStorage.setItem("govguide_completed_reminders", JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
  };

  useEffect(() => {
    if (!user?.id) {
      navigate("/login", { replace: true });
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/users/${user.id}/profile`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Could not load your saved profile."
          );
        }

        if (!cancelled) {
          setProfile(toProfileForm(data));
        }
      } catch (error) {
        if (!cancelled) {
          setRequestError(
            error.message || "Could not connect to the service."
          );
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    };

    const loadApplications = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/applications/user/${user.id}`
        );

        if (response.ok) {
          const data = await response.json();
          if (!cancelled && Array.isArray(data)) {
            const appMap = {};
            data.forEach((app) => {
              appMap[app.scheme_id] = app;
            });
            setApplications(appMap);
          }
        }
      } catch (error) {
        console.error("Could not load user applications:", error);
      }
    };

    loadProfile();
    loadApplications();

    return () => {
      cancelled = true;
    };
  }, [navigate, user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((currentProfile) => ({
      ...currentProfile,
      [name]: value,
    }));
  };

  const handleUpdateApplicationStatus = async (schemeId, nextStatus, reference) => {
    if (!user?.id) return;
    setUpdatingAppSchemeId(schemeId);

    try {
      let currentApp = applications[schemeId];

      if (!currentApp) {
        // Initialize application first
        const createRes = await fetch(`${API_BASE_URL}/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            scheme_id: schemeId,
            application_reference: reference || null,
          }),
        });

        if (!createRes.ok) {
          throw new Error("Could not start application tracking.");
        }
        currentApp = await createRes.json();
      }

      // Update status or reference
      const payload = {
        status: nextStatus,
        notes: `Application marked as ${nextStatus.replace('_', ' ')}.`,
      };

      if (reference !== undefined) {
        payload.application_reference = reference;
      } else if (currentApp.application_reference) {
        payload.application_reference = currentApp.application_reference;
      }

      const updateRes = await fetch(
        `${API_BASE_URL}/applications/${currentApp.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!updateRes.ok) {
        throw new Error("Could not update application status.");
      }

      const updated = await updateRes.json();
      setApplications((prev) => ({
        ...prev,
        [schemeId]: updated,
      }));
    } catch (err) {
      console.error("Application status update error:", err);
    } finally {
      setUpdatingAppSchemeId(null);
    }
  };

  const handleChatSend = async (messageText) => {
    const text = (messageText || chatInput).trim();
    if (!text) return;

    setChatMessages((prev) => [...prev, { role: "user", text }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, user_id: user?.id || null }),
      });

      const data = await res.json();
      const reply = data.message || data.response || "Sorry, I couldn't understand that.";
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't connect to the assistant right now." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  const handleFindSchemes = async (event) => {
    event.preventDefault();

    if (
      !String(profile.age).trim() ||
      !profile.gender.trim() ||
      !profile.state.trim() ||
      !profile.occupation.trim() ||
      !profile.annual_income.trim() ||
      !profile.category.trim() ||
      !profile.requirement.trim()
    ) {
      setRequestError(
        "Please complete all required profile information before checking eligibility."
      );
      return;
    }

    setRequestError("");
    setMatchSummary(null);
    setExpandedScheme(null);
    setIsSearching(true);

    try {
      const profileResponse = await fetch(
        `${API_BASE_URL}/users/${user.id}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...profile,
            age: Number(profile.age),
            annual_income: incomeRangeToNumber(profile.annual_income),
          }),
        }
      );

      const savedProfile = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(
          savedProfile.detail || "Could not save your profile."
        );
      }

      setProfile(toProfileForm(savedProfile));

      const matchesResponse = await fetch(
        `${API_BASE_URL}/schemes/match/${user.id}`
      );

      const summary = await matchesResponse.json();

      if (!matchesResponse.ok) {
        throw new Error(
          summary.detail || "Could not find matching programs."
        );
      }

      if (
        !Array.isArray(summary.matched_schemes) ||
        !Array.isArray(summary.analyzed_schemes)
      ) {
        throw new Error(
          "The matching service returned an invalid response."
        );
      }

      setMatchSummary(summary);

      // Open the first result automatically.
      const firstScheme =
        summary.matched_schemes[0] ||
        summary.analyzed_schemes[0];

      if (firstScheme) {
        setExpandedScheme(firstScheme.scheme_id);
      }

      // Move the user directly to the result area.
      setTimeout(() => {
        document
          .getElementById("eligibility-results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (error) {
      setRequestError(
        error.message || "Could not connect to the service."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const analyzedSchemes = matchSummary?.analyzed_schemes ?? [];

  const displaySchemes =
    analyzedSchemes.length > 0
      ? analyzedSchemes
      : matchSummary?.matched_schemes ?? [];

  const eligibleCount = displaySchemes.filter(
    (scheme) => scheme.eligible
  ).length;

  const informationRequiredCount = displaySchemes.filter(
    (scheme) =>
      scheme.status === "information_required" ||
      scheme.opportunity_status === "information_required"
  ).length;

  const notEligibleCount = displaySchemes.filter(
    (scheme) =>
      !scheme.eligible &&
      scheme.status !== "information_required" &&
      scheme.opportunity_status !== "information_required"
  ).length;

  const programsWithDocuments = displaySchemes.filter(
    (scheme) => scheme.required_documents?.length > 0
  ).length;

  const activeAppsCount = Object.values(applications).filter(
    (app) => app?.status && app.status !== "ready_to_apply"
  ).length;

  const totalActionSteps = displaySchemes
    .filter((scheme) => scheme.eligible)
    .reduce((acc, scheme) => {
      const steps = scheme.action_plan?.steps || [];
      return acc + (Array.isArray(steps) ? steps.length : 0);
    }, 0);

  const requiredFieldsFilled =
    String(profile.age).trim() !== "" &&
    profile.gender.trim() !== "" &&
    profile.state.trim() !== "" &&
    profile.occupation.trim() !== "" &&
    profile.annual_income.trim() !== "" &&
    profile.category.trim() !== "" &&
    profile.requirement.trim() !== "";

  const getStatus = (scheme) => {
    if (scheme.eligible) {
      return {
        type: "eligible",
        label: t.eligibleLegend,
        icon: CircleCheck,
      };
    }

    if (
      scheme.status === "information_required" ||
      scheme.opportunity_status === "information_required"
    ) {
      return {
        type: "information",
        label: t.infoNeededLegend,
        icon: AlertCircle,
      };
    }

    return {
      type: "not-eligible",
      label: t.notEligibleLegend,
      icon: CircleX,
    };
  };

  const toggleScheme = (schemeId) => {
    setExpandedScheme((current) =>
      current === schemeId ? null : schemeId
    );
  };

  return (
    <div className="dashboard-page">
      {/* NAVBAR */}

      <nav className="dashboard-navbar">
        <div className="dashboard-logo">
          <span className="dashboard-logo-icon">
            <Landmark
              aria-hidden="true"
              size={21}
              strokeWidth={1.7}
            />
          </span>

          <span>GovGuide</span>
        </div>

        <div className="dashboard-nav-right">
          {/* LANGUAGE SELECTOR */}
          <div className="lang-select-wrapper" title={t.langToggle}>
            <Globe size={15} className="lang-icon" />
            <select
              className="lang-select"
              value={lang}
              onChange={(e) => handleLangChange(e.target.value)}
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          <span className="welcome-text">
            {t.welcome}, {user?.name || "User"}
          </span>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut
              aria-hidden="true"
              size={16}
              strokeWidth={1.8}
            />
            {t.logout}
          </button>
        </div>
      </nav>

      <main className="dashboard-container">
        {/* HERO */}

        <section className="dashboard-hero">
          <p className="dashboard-label">
            {t.heroLabel}
          </p>

          <h1>
            {t.heroTitle}
          </h1>

          <p className="dashboard-description">
            {t.heroDesc}
          </p>
        </section>

        {/* OVERVIEW */}

        <section
          className="overview-grid"
          aria-label="Summary overview"
        >
          <article className="overview-card">
            <span className="overview-label">
              {t.eligibleSchemes}
            </span>

            <strong>
              {matchSummary === null ? "—" : eligibleCount}
            </strong>

            <small>
              {matchSummary === null
                ? t.eligibleDescPending
                : t.eligibleDescReady}
            </small>
          </article>

          <article className="overview-card">
            <span className="overview-label">
              {t.activeTracking}
            </span>

            <strong>
              {activeAppsCount > 0 ? activeAppsCount : "0"}
            </strong>

            <small>
              {activeAppsCount > 0
                ? t.activeTrackingSubActive
                : t.activeTrackingSubEmpty}
            </small>
          </article>

          <article className="overview-card">
            <span className="overview-label">
              {t.actionPlanSteps}
            </span>

            <strong>
              {matchSummary === null ? "—" : totalActionSteps}
            </strong>

            <small>
              {matchSummary === null
                ? t.actionStepsPending
                : t.actionStepsReady}
            </small>
          </article>

          <article className="overview-card">
            <span className="overview-label">
              {t.schemesAnalyzed}
            </span>

            <strong>
              {matchSummary === null
                ? "22"
                : displaySchemes.length}
            </strong>

            <small>
              {t.schemesAnalyzedDesc}
            </small>
          </article>
        </section>

        {/* ANALYTICS VISUAL BREAKDOWN BAR */}
        {matchSummary !== null && displaySchemes.length > 0 && (
          <section className="overview-breakdown" aria-label="Eligibility breakdown bar">
            <div className="breakdown-bar">
              <div
                className="bar-segment segment-eligible"
                style={{ width: `${(eligibleCount / displaySchemes.length) * 100}%` }}
                title={`${t.eligibleLegend}: ${eligibleCount}`}
              />
              <div
                className="bar-segment segment-info"
                style={{ width: `${(informationRequiredCount / displaySchemes.length) * 100}%` }}
                title={`${t.infoNeededLegend}: ${informationRequiredCount}`}
              />
              <div
                className="bar-segment segment-not-eligible"
                style={{ width: `${(notEligibleCount / displaySchemes.length) * 100}%` }}
                title={`${t.notEligibleLegend}: ${notEligibleCount}`}
              />
            </div>
            <div className="breakdown-legend">
              <span className="legend-item">
                <span className="legend-dot dot-eligible" />
                {t.eligibleLegend} ({eligibleCount})
              </span>
              <span className="legend-item">
                <span className="legend-dot dot-info" />
                {t.infoNeededLegend} ({informationRequiredCount})
              </span>
              <span className="legend-item">
                <span className="legend-dot dot-not-eligible" />
                {t.notEligibleLegend} ({notEligibleCount})
              </span>
            </div>
          </section>
        )}

        {/* 3D DIGITAL BENEFICIARY SMART CARD */}
        <DigitalBeneficiaryCard
          user={user}
          profile={profile}
          eligibleCount={eligibleCount}
          activeAppsCount={activeAppsCount}
          lang={lang}
        />

        {/* PROFILE */}

        <section
          className="profile-card"
          id="profile-section"
        >
          <div className="section-header">
            <div>
              <p className="section-eyebrow">
                {t.step1}
              </p>

              <h2>
                {t.profileTitle}
              </h2>

              <p>
                {t.profileDesc}
              </p>
            </div>
          </div>

          <form
            className="profile-form"
            onSubmit={handleFindSchemes}
            aria-busy={
              profileLoading || isSearching
            }
          >
            <fieldset
              className="profile-fields"
              disabled={
                profileLoading || isSearching
              }
            >
              <div className="form-row">
                <div className="dashboard-form-group">
                  <label htmlFor="profile-age">
                    {t.ageLabel}
                  </label>

                  <input
                    id="profile-age"
                    name="age"
                    type="number"
                    placeholder={t.agePlaceholder}
                    min="1"
                    max="120"
                    value={profile.age}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="dashboard-form-group">
                  <label htmlFor="profile-gender">
                    {t.genderLabel}
                  </label>

                  <select
                    id="profile-gender"
                    name="gender"
                    value={profile.gender}
                    onChange={handleProfileChange}
                    required
                  >
                    <option value="">
                      {t.selectGender}
                    </option>
                    <option value="Male">
                      {t.male}
                    </option>
                    <option value="Female">
                      {t.female}
                    </option>
                    <option value="Other">
                      {t.other}
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="dashboard-form-group">
                  <label htmlFor="profile-state">
                    {t.stateLabel}
                  </label>

                  <select
                    id="profile-state"
                    name="state"
                    value={profile.state}
                    onChange={handleProfileChange}
                    required
                  >
                    <option value="">
                      {t.selectState}
                    </option>
                    <option value="Tamil Nadu">Tamil Nadu (தமிழ்நாடு)</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Other">{t.other}</option>
                  </select>
                </div>

                <div className="dashboard-form-group">
                  <label htmlFor="profile-occupation">
                    {t.occupationLabel}
                  </label>

                  <select
                    id="profile-occupation"
                    name="occupation"
                    value={profile.occupation}
                    onChange={handleProfileChange}
                    required
                  >
                    <option value="">
                      {t.selectOccupation}
                    </option>
                    <option value="Student">{t.student}</option>
                    <option value="Farmer">{t.farmer}</option>
                    <option value="Self Employed">{t.selfEmployed}</option>
                    <option value="Private Employee">{t.privateEmployee}</option>
                    <option value="Government Employee">{t.govtEmployee}</option>
                    <option value="Unemployed">{t.unemployed}</option>
                    <option value="Other">{t.other}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="dashboard-form-group">
                  <label htmlFor="profile-income">
                    {t.incomeLabel}
                  </label>

                  <select
                    id="profile-income"
                    name="annual_income"
                    value={profile.annual_income}
                    onChange={handleProfileChange}
                    required
                  >
                    <option value="">
                      {t.selectIncome}
                    </option>
                    <option value="Below ₹1 Lakh">
                      {t.incomeBelow1L}
                    </option>
                    <option value="₹1 - ₹2.5 Lakhs">
                      {t.income1to2_5L}
                    </option>
                    <option value="₹2.5 - ₹5 Lakhs">
                      {t.income2_5to5L}
                    </option>
                    <option value="₹5 - ₹10 Lakhs">
                      {t.income5to10L}
                    </option>
                    <option value="Above ₹10 Lakhs">
                      {t.incomeAbove10L}
                    </option>
                  </select>
                </div>

                <div className="dashboard-form-group">
                  <label htmlFor="profile-category">
                    {t.categoryLabel}
                  </label>

                  <select
                    id="profile-category"
                    name="category"
                    value={profile.category}
                    onChange={handleProfileChange}
                    required
                  >
                    <option value="">
                      {t.selectCategory}
                    </option>
                    <option value="General">{t.general}</option>
                    <option value="OBC">{t.obc}</option>
                    <option value="BC">{t.bc}</option>
                    <option value="MBC">{t.mbc}</option>
                    <option value="DNC">{t.dnc}</option>
                    <option value="SC">{t.sc}</option>
                    <option value="ST">{t.st}</option>
                    <option value="Other">{t.other}</option>
                  </select>
                </div>
              </div>

              <div className="dashboard-form-group full-width">
                <label htmlFor="profile-requirement">
                  {t.requirementLabel}
                </label>

                <select
                  id="profile-requirement"
                  name="requirement"
                  value={profile.requirement}
                  onChange={handleProfileChange}
                  required
                >
                  <option value="">
                    {t.selectRequirement}
                  </option>
                  <option value="Education / Scholarship">
                    {t.reqEducation}
                  </option>
                  <option value="Business / Startup">
                    {t.reqBusiness}
                  </option>
                  <option value="Agriculture">
                    {t.reqAgriculture}
                  </option>
                  <option value="Employment">
                    {t.reqEmployment}
                  </option>
                  <option value="Housing">
                    {t.reqHousing}
                  </option>
                  <option value="Financial Assistance">
                    {t.reqFinance}
                  </option>
                  <option value="Other">{t.other}</option>
                </select>
              </div>

              {/* ADDITIONAL INFORMATION */}

              <div className="additional-profile-heading">
                <span>{t.additionalInfo}</span>
                <small>
                  {t.additionalInfoSub}
                </small>
              </div>

              <div className="form-row">
                <div className="dashboard-form-group">
                  <label htmlFor="profile-land-holding">
                    {t.landHoldingLabel}
                  </label>

                  <input
                    id="profile-land-holding"
                    name="land_holding"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={t.landHoldingPlaceholder}
                    value={profile.land_holding}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="dashboard-form-group">
                  <label htmlFor="profile-existing-business">
                    {t.existingBusinessLabel}
                  </label>

                  <select
                    id="profile-existing-business"
                    name="existing_business"
                    value={profile.existing_business}
                    onChange={handleProfileChange}
                  >
                    <option value="">
                      {t.selectApplicable}
                    </option>
                    <option value="Yes">{t.yes}</option>
                    <option value="No">{t.no}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="dashboard-form-group">
                  <label htmlFor="profile-education-level">
                    {t.educationLevelLabel}
                  </label>

                  <select
                    id="profile-education-level"
                    name="education_level"
                    value={profile.education_level}
                    onChange={handleProfileChange}
                  >
                    <option value="">
                      {t.selectApplicable}
                    </option>
                    <option value="Class 12 or below">{t.eduClass12}</option>
                    <option value="ITI">{t.eduITI}</option>
                    <option value="Diploma">{t.eduDiploma}</option>
                    <option value="Undergraduate">{t.eduUG}</option>
                    <option value="Postgraduate">{t.eduPG}</option>
                    <option value="PhD">{t.eduPhD}</option>
                    <option value="Other">{t.other}</option>
                  </select>
                </div>

                <div className="dashboard-form-group">
                  <label htmlFor="profile-student-status">
                    {t.studentStatusLabel}
                  </label>

                  <select
                    id="profile-student-status"
                    name="student_status"
                    value={profile.student_status}
                    onChange={handleProfileChange}
                  >
                    <option value="">
                      {t.selectApplicable}
                    </option>
                    <option value="Regular course">
                      {t.regularCourse}
                    </option>
                    <option value="Distance or part-time course">
                      {t.distanceCourse}
                    </option>
                    <option value="Not currently a student">
                      {t.notStudent}
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="dashboard-form-group">
                  <label htmlFor="profile-class12-percentile">
                    {t.class12PercentileLabel}
                  </label>

                  <input
                    id="profile-class12-percentile"
                    name="class12_percentile"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder={t.class12Placeholder}
                    value={profile.class12_percentile}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="dashboard-form-group">
                  <label htmlFor="profile-other-scholarship">
                    {t.otherScholarshipLabel}
                  </label>

                  <select
                    id="profile-other-scholarship"
                    name="other_scholarship"
                    value={profile.other_scholarship}
                    onChange={handleProfileChange}
                  >
                    <option value="">
                      {t.selectApplicable}
                    </option>
                    <option value="Yes">{t.yes}</option>
                    <option value="No">{t.no}</option>
                  </select>
                </div>
              </div>

              {/* REQUIRED FIELDS HINT */}

              {!requiredFieldsFilled && !profileLoading && (
                <p className="profile-required-message">
                  {t.requiredFieldsWarning}
                </p>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                className="find-schemes-button"
                disabled={!requiredFieldsFilled || isSearching}
              >
                {isSearching
                  ? t.saving
                  : t.saveAndCheck}

                {isSearching ? (
                  <LoaderCircle
                    className="loading-icon"
                    aria-hidden="true"
                    size={18}
                  />
                ) : (
                  <SearchCheck
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.8}
                  />
                )}
              </button>
            </fieldset>

            {profileLoading && (
              <p
                className="profile-status"
                role="status"
              >
                Loading your saved profile…
              </p>
            )}

            {requestError && (
              <p
                className="profile-error"
                role="alert"
              >
                {requestError}
              </p>
            )}
          </form>
        </section>

        {/* ELIGIBILITY RESULTS */}

        {matchSummary !== null && (
          <section
            className="eligibility-section"
            id="eligibility-results"
            aria-live="polite"
          >
            <div className="eligibility-header">
              <div>
                <p className="section-eyebrow">
                  {t.step2}
                </p>

                <h2>
                  {t.resultsTitle}
                </h2>

                <p>
                  {t.resultsDesc} (<strong>{displaySchemes.length}</strong>)
                </p>
              </div>

              <div className="results-summary">
                <span>
                  <b>{eligibleCount}</b>
                  {t.eligibleLegend}
                </span>

                <span>
                  <b>{informationRequiredCount}</b>
                  {t.infoNeededLegend}
                </span>

                <span>
                  <b>{notEligibleCount}</b>
                  {t.notEligibleLegend}
                </span>
              </div>
            </div>

            {/* INTERACTIVE ACTION BAR (SUBSIDY & EMI CALCULATOR TRIGGER) */}
            <div className="step2-action-bar" id="subsidy-calculator-anchor">
              <button
                type="button"
                className={`action-btn-calculator ${showCalculator ? "active" : ""}`}
                onClick={() => setShowCalculator((prev) => !prev)}
              >
                <Calculator size={18} />
                <span>
                  {showCalculator
                    ? (lang === "ta" ? "கணக்கீட்டுக் கருவியை மூடுக (Close Calculator)" : "Hide Subsidy Calculator")
                    : (lang === "ta" ? "🧮 அரசு மானியம் & EMI கணக்கீட்டுக் கருவி (Calculator)" : "🧮 Interactive Subsidy & EMI Calculator")}
                </span>
              </button>
            </div>

            {/* INTERACTIVE SUBSIDY CALCULATOR COMPONENT */}
            {showCalculator && (
              <SubsidyCalculator
                lang={lang}
                initialScheme={calcInitialScheme}
                onClose={() => setShowCalculator(false)}
              />
            )}

            {displaySchemes.length === 0 ? (
              <div className="scheme-empty">
                <span className="scheme-empty-icon">
                  <Search
                    aria-hidden="true"
                    size={22}
                    strokeWidth={1.7}
                  />
                </span>

                <div>
                  <h3>
                    No schemes available yet
                  </h3>

                  <p>
                    Scheme information has not been added
                    to GovGuide yet.
                  </p>
                </div>
              </div>
            ) : (
              <div className="eligibility-list">
                {displaySchemes.map((scheme) => {
                  const status = getStatus(scheme);
                  const StatusIcon = status.icon;

                  const isExpanded =
                    expandedScheme === scheme.scheme_id;

                  return (
                    <article
                      className={`eligibility-card ${status.type}`}
                      key={scheme.scheme_id}
                    >
                      {/* SUMMARY CARD */}

                      <div className="eligibility-card-main">
                        <div className="eligibility-card-title">
                          <div>
                            <span className="scheme-type">
                              {t.governmentScheme}
                            </span>

                            <div className="scheme-title-with-audio">
                              <h3>
                                {tr(scheme.name, lang)}
                              </h3>
                              <AudioReaderButton
                                text={`${tr(scheme.name, lang)}. ${scheme.description ? tr(scheme.description, lang) : ""}. ${scheme.benefits ? tr(scheme.benefits, lang) : ""}`}
                                lang={lang}
                              />
                            </div>

                            {scheme.state && (
                              <span className="scheme-location">
                                {tr(scheme.state, lang)}
                              </span>
                            )}
                          </div>

                          <div
                            className={`eligibility-status ${status.type}`}
                          >
                            <StatusIcon
                              size={17}
                              strokeWidth={2}
                            />

                            <span>
                              {status.label}
                            </span>
                          </div>
                        </div>

                        <div className="eligibility-score-row">
                          <div className="score-label">
                            {t.eligibilityMatch}
                          </div>

                          <strong>
                            {scheme.eligibility_score ?? 0}%
                          </strong>
                        </div>

                        <div className="score-bar">
                          <span
                            style={{
                              width: `${Math.min(
                                Number(
                                  scheme.eligibility_score ?? 0
                                ),
                                100
                              )}%`,
                            }}
                          />
                        </div>

                        <p className="eligibility-short-description">
                          {tr(scheme.description, lang)}
                        </p>

                        <button
                          type="button"
                          className="view-details-button"
                          onClick={() =>
                            toggleScheme(
                              scheme.scheme_id
                            )
                          }
                          aria-expanded={isExpanded}
                        >
                          {isExpanded
                            ? t.hideDetails
                            : t.viewDetails}

                          {isExpanded ? (
                            <ChevronUp size={17} />
                          ) : (
                            <ChevronDown size={17} />
                          )}
                        </button>
                      </div>

                      {/* "WHY AM I NOT ELIGIBLE?" EXPLAINER CARD */}
                      <EligibilityExplainerCard
                        scheme={scheme}
                        profile={profile}
                        lang={lang}
                      />

                      {/* EXPANDED DETAILS */}

                      {isExpanded && (
                        <div className="scheme-expanded">
                          {/* WHY */}

                          <div className="detail-grid">
                            {scheme.reasons?.length > 0 && (
                              <div className="detail-box success-box">
                                <div className="detail-box-heading">
                                  <CircleCheck
                                    size={17}
                                  />

                                  <strong>
                                    {t.criteriaMet}
                                  </strong>
                                </div>

                                <ul>
                                  {scheme.reasons.map(
                                    (reason) => (
                                      <li key={reason}>
                                        {tr(reason, lang)}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                            {(scheme.missing?.length > 0 ||
                              scheme.failed_conditions
                                ?.length > 0) && (
                              <div className="detail-box warning-box">
                                <div className="detail-box-heading">
                                  <AlertCircle
                                    size={17}
                                  />

                                  <strong>
                                    {t.infoToReview}
                                  </strong>
                                </div>

                                <ul>
                                  {(
                                    scheme.failed_conditions ||
                                    scheme.missing ||
                                    []
                                  ).map(
                                    (item) => (
                                      <li key={item}>
                                        {tr(item, lang)}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* BENEFITS */}

                          {scheme.benefits && (
                            <div className="expanded-block">
                              <div className="docs-header-with-audio">
                                <h4>
                                  <Landmark size={17} />
                                  {t.benefitsHeading}
                                </h4>
                                <AudioReaderButton
                                  text={`${t.benefitsHeading}: ${tr(scheme.benefits, lang)}`}
                                  lang={lang}
                                />
                              </div>

                              <p>
                                {tr(scheme.benefits, lang)}
                              </p>

                              {/* ONE-CLICK ACTION TO OPEN CALCULATOR PRE-CONFIGURED FOR THIS SCHEME */}
                              {["pmegp", "mudra", "pmay", "svanidhi", "loan", "subsidy", "credit", "kisan", "business"].some((keyword) =>
                                (scheme.name + " " + (scheme.benefits || "")).toLowerCase().includes(keyword)
                              ) && (
                                <button
                                  type="button"
                                  className="scheme-open-calc-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const sName = scheme.name.toLowerCase();
                                    const schemeKey = sName.includes("mudra")
                                      ? "mudra"
                                      : sName.includes("awas") || sName.includes("pmay")
                                      ? "pmay"
                                      : sName.includes("svanidhi") || sName.includes("vendor")
                                      ? "pm_svanidhi"
                                      : "pmegp";
                                    setCalcInitialScheme(schemeKey);
                                    setShowCalculator(true);
                                    const anchor = document.getElementById("subsidy-calculator-anchor");
                                    if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
                                  }}
                                >
                                  <Calculator size={15} />
                                  <span>
                                    {lang === "ta"
                                      ? "இந்த திட்டத்திற்கான மானியம் & EMI கணக்கீடு செய்ய கிளிக் செய்க (Open Calculator)"
                                      : "Calculate Subsidy, Margin & EMI for this Scheme"}
                                  </span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* MISSING INFORMATION */}

                          {scheme.missing_information
                            ?.length > 0 && (
                            <div className="expanded-block missing-information">
                              <h4>
                                <AlertCircle size={17} />
                                {t.infoToReview}
                              </h4>

                              <ul>
                                {scheme.missing_information.map(
                                  (item) => (
                                    <li key={item}>
                                      {item}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                          {/* DOCUMENTS & HOW TO OBTAIN GUIDANCE */}

                          <div className="expanded-block documents-block">
                            <div className="docs-header-with-audio">
                              <h4>
                                <FileText size={17} />
                                {t.docsHeading}
                              </h4>
                              <AudioReaderButton
                                text={`${t.docsHeading}: ${scheme.document_analysis?.document_details?.length > 0 
                                  ? scheme.document_analysis.document_details.map(d => tr(d.name, lang)).join(", ")
                                  : scheme.required_documents?.map(d => tr(d, lang)).join(", ") || ""}`}
                                lang={lang}
                              />
                            </div>

                            {scheme.document_analysis?.document_details?.length > 0 ? (
                              <div className="doc-cards-grid">
                                {scheme.document_analysis.document_details.map((doc, idx) => (
                                  <div className="doc-guidance-card" key={`${doc.name}-${idx}`}>
                                    <div className="doc-card-header">
                                      <span className="doc-name">
                                        <Check size={14} className="doc-check-icon" />
                                        {tr(doc.name, lang)}
                                      </span>
                                      {doc.priority && (
                                        <span className={`doc-priority-badge priority-${doc.priority.toLowerCase()}`}>
                                          {doc.priority}
                                        </span>
                                      )}
                                    </div>
                                    {doc.why_needed && (
                                      <p className="doc-why">
                                        <b>{t.whyRequired}:</b> {tr(doc.why_needed, lang)}
                                      </p>
                                    )}
                                    {doc.how_to_obtain && (
                                      <p className="doc-how">
                                        <b>{t.howToGet}:</b> {tr(doc.how_to_obtain, lang)}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : scheme.required_documents?.length > 0 ? (
                              <ul className="documents-list">
                                {scheme.required_documents.map((document) => (
                                  <li key={document}>
                                    <Check size={15} />
                                    {tr(document, lang)}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>
                                {t.confirmDocsNotice}
                              </p>
                            )}
                          </div>

                          {/* ELIGIBILITY NOTES */}

                          {scheme.eligibility_notes && (
                            <div className="expanded-callout">
                              <strong>
                                {t.eligibilityDetailsVerify}
                              </strong>

                              <p>
                                {tr(scheme.eligibility_notes, lang)}
                              </p>
                            </div>
                          )}

                          {/* OPPORTUNITY GAP */}

                          {scheme.opportunity_status ===
                            "not_eligible" && (
                            <div className="expanded-callout opportunity-gap">
                              <strong>
                                {t.opportunityOutlook}
                              </strong>

                              <p>
                                {tr(scheme.opportunity_message, lang)}
                              </p>

                              {scheme.opportunity_gaps
                                ?.length > 0 && (
                                <ul>
                                  {scheme.opportunity_gaps.map(
                                    (gap) => (
                                      <li key={gap}>
                                        {tr(gap, lang)}
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}

                              {typeof scheme.future_opportunity === "string" && (
                                <p>
                                  {tr(scheme.future_opportunity, lang)}
                                </p>
                              )}
                            </div>
                          )}

                          {/* NEXT STEP */}

                          {scheme.next_step && (
                            <div className="next-step-box">
                              <strong>
                                {t.recommendedNextStep}
                              </strong>

                              <p>
                                {tr(scheme.next_step, lang)}
                              </p>
                            </div>
                          )}

                          {/* ACTION PLAN */}

                          {((Array.isArray(scheme.action_plan) && scheme.action_plan.length > 0) ||
                            (scheme.action_plan?.steps?.length > 0)) && (
                            <div className="expanded-block">
                              <h4>
                                <ClipboardList
                                  size={17}
                                />
                                {t.actionPlanHeading}
                              </h4>

                              <ol className="action-plan-list">
                                {(Array.isArray(scheme.action_plan)
                                  ? scheme.action_plan
                                  : (scheme.action_plan?.steps || [])
                                ).map((step, index) => {
                                  const isObj = typeof step === "object" && step !== null;
                                  const stepNumber = isObj ? (step.step || index + 1) : index + 1;
                                  const title = isObj ? step.title : null;
                                  const description = isObj ? (step.description || "") : String(step);
                                  const priority = isObj ? step.priority : null;

                                  return (
                                    <li
                                      key={`${scheme.scheme_id}-${index}`}
                                    >
                                      <span>
                                        {stepNumber}
                                      </span>

                                      <div className="action-plan-content">
                                        {title && (
                                          <strong>
                                            {tr(title, lang)}
                                          </strong>
                                        )}

                                        <p>
                                          {tr(description, lang)}
                                        </p>

                                        {priority && (
                                          <span className="action-priority">
                                            {priority}
                                          </span>
                                        )}
                                      </div>
                                    </li>
                                  );
                                })}
                              </ol>
                            </div>
                          )}

                          {/* APPLICATION */}

                          {scheme.application && (
                            <div className="expanded-block application-block">
                              <h4>
                                <FileText
                                  size={17}
                                />
                                {t.applicationPrep}
                              </h4>

                              <p>
                                {tr(scheme.application.message, lang)}
                              </p>

                              <div className="application-mini-grid">
                                <span>
                                  <b>{t.nameHeading}</b>
                                  {scheme.application
                                    .applicant_information
                                    ?.name || "—"}
                                </span>

                                <span>
                                  <b>{t.ageHeading}</b>
                                  {scheme.application
                                    .applicant_information
                                    ?.age ?? "—"}
                                </span>

                                <span>
                                  <b>{t.stateHeading}</b>
                                  {scheme.application
                                    .applicant_information
                                    ?.state || "—"}
                                </span>

                                <span>
                                  <b>{t.occupationHeading}</b>
                                  {scheme.application
                                    .applicant_information
                                    ?.occupation ||
                                    "—"}
                                </span>
                              </div>

                              <div className="application-status">
                                {t.statusPrefix}:{" "}
                                <strong>
                                  {({
                                    ready_to_apply: t.stepReady,
                                    submitted: t.stepSubmitted,
                                    under_review: t.stepReview,
                                    approved: t.stepApproved,
                                    rejected: t.stepRejected,
                                  })[applications[scheme.scheme_id]?.status] ||
                                    (scheme.application
                                      .application_status ===
                                    "ready_for_review"
                                      ? t.stepReady
                                      : t.infoToReview)}
                                </strong>
                              </div>

                              {/* APPLICATION TRACKING LIFECYCLE */}
                              {scheme.eligible && (() => {
                                const userApp = applications[scheme.scheme_id];
                                const currentTrackStatus = userApp?.status || "ready_to_apply";
                                const isUpdating = updatingAppSchemeId === scheme.scheme_id;

                                return (
                                  <div className="application-tracking-box">
                                    <div className="tracking-header">
                                      <strong>{t.lifecycleTitle}</strong>
                                      {userApp?.applied_on && (
                                        <small className="tracking-date">
                                          {t.submittedOn}: {new Date(userApp.applied_on).toLocaleDateString()}
                                        </small>
                                      )}
                                    </div>

                                    {/* STEPPER */}
                                    <div className="tracking-stepper">
                                      <div className={`tracking-step ${['ready_to_apply', 'submitted', 'under_review', 'approved', 'rejected'].includes(currentTrackStatus) ? 'active' : ''}`}>
                                        <span className="step-circle">{['submitted', 'under_review', 'approved', 'rejected'].includes(currentTrackStatus) ? '✓' : '1'}</span>
                                        <span className="step-label">{t.stepReady}</span>
                                      </div>
                                      <span className={`tracking-line ${['submitted', 'under_review', 'approved', 'rejected'].includes(currentTrackStatus) ? 'active' : ''}`} />

                                      <div className={`tracking-step ${['submitted', 'under_review', 'approved', 'rejected'].includes(currentTrackStatus) ? 'active' : ''}`}>
                                        <span className="step-circle">{['under_review', 'approved', 'rejected'].includes(currentTrackStatus) ? '✓' : '2'}</span>
                                        <span className="step-label">{t.stepSubmitted}</span>
                                      </div>
                                      <span className={`tracking-line ${['under_review', 'approved', 'rejected'].includes(currentTrackStatus) ? 'active' : ''}`} />

                                      <div className={`tracking-step ${['under_review', 'approved', 'rejected'].includes(currentTrackStatus) ? 'active' : ''}`}>
                                        <span className="step-circle">{['approved', 'rejected'].includes(currentTrackStatus) ? '✓' : '3'}</span>
                                        <span className="step-label">{t.stepReview}</span>
                                      </div>
                                      <span className={`tracking-line ${['approved', 'rejected'].includes(currentTrackStatus) ? 'active' : ''}`} />

                                      {currentTrackStatus === 'rejected' ? (
                                        <div className="tracking-step active step-rejected">
                                          <span className="step-circle rejected-circle">✗</span>
                                          <span className="step-label">{t.stepRejected}</span>
                                        </div>
                                      ) : (
                                        <div className={`tracking-step ${currentTrackStatus === 'approved' ? 'active' : ''}`}>
                                          <span className="step-circle">{currentTrackStatus === 'approved' ? '✓' : '4'}</span>
                                          <span className="step-label">{t.stepApproved}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* REFERENCE & DETAILS INFO (IF SUBMITTED) */}
                                    {userApp?.application_reference && (
                                      <div className="tracking-details-card">
                                        <div className="tracking-detail-item">
                                          <span>{t.officialAppId}:</span>
                                          <strong>{userApp.application_reference}</strong>
                                        </div>
                                        {userApp.applied_on && (
                                          <div className="tracking-detail-item">
                                            <span>{t.submittedOn}:</span>
                                            <strong>{new Date(userApp.applied_on).toLocaleDateString()}</strong>
                                          </div>
                                        )}
                                        <div className="tracking-detail-item">
                                          <span>Status:</span>
                                          <strong className={`status-tag status-${currentTrackStatus}`}>
                                            {currentTrackStatus.replace(/_/g, ' ').toUpperCase()}
                                          </strong>
                                        </div>
                                      </div>
                                    )}

                                    {/* ACTION CONTROLS */}
                                    <div className="tracking-controls">
                                      {currentTrackStatus === "ready_to_apply" && (
                                        <div className="tracking-submit-prompt">
                                          {scheme.official_url && (
                                            <a
                                              href={scheme.official_url}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="tracking-portal-link"
                                            >
                                              {t.visitOfficialPortal} <ExternalLink size={14} />
                                            </a>
                                          )}
                                          <p>
                                            {t.completedApplicationPrompt}
                                          </p>
                                          <div className="tracking-input-row">
                                            <input
                                              type="text"
                                              className="tracking-ref-input"
                                              placeholder={t.enterRefPlaceholder}
                                              value={refInputs[scheme.scheme_id] || ""}
                                              onChange={(e) =>
                                                setRefInputs((prev) => ({
                                                  ...prev,
                                                  [scheme.scheme_id]: e.target.value,
                                                }))
                                              }
                                            />
                                            <button
                                              type="button"
                                              className="tracking-btn btn-submit-app"
                                              disabled={isUpdating || !refInputs[scheme.scheme_id]?.trim()}
                                              onClick={() =>
                                                handleUpdateApplicationStatus(
                                                  scheme.scheme_id,
                                                  "submitted",
                                                  refInputs[scheme.scheme_id]?.trim()
                                                )
                                              }
                                            >
                                              {isUpdating ? "Saving..." : t.markAsSubmitted}
                                            </button>
                                          </div>
                                        </div>
                                      )}

                                      {currentTrackStatus === "submitted" && (
                                        <div className="tracking-status-action-box">
                                          {scheme.official_url && (
                                            <a
                                              href={scheme.official_url}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="tracking-check-status-link"
                                            >
                                              {t.visitOfficialPortal} <ExternalLink size={13} />
                                            </a>
                                          )}
                                          <button
                                            type="button"
                                            className="tracking-btn btn-review-app"
                                            disabled={isUpdating}
                                            onClick={() => handleUpdateApplicationStatus(scheme.scheme_id, "under_review")}
                                          >
                                            {isUpdating ? "Updating..." : t.updateToReview}
                                          </button>
                                        </div>
                                      )}

                                      {currentTrackStatus === "under_review" && (
                                        <div className="tracking-review-actions">
                                          {scheme.official_url && (
                                            <a
                                              href={scheme.official_url}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="tracking-check-status-link"
                                            >
                                              {t.visitOfficialPortal} <ExternalLink size={13} />
                                            </a>
                                          )}
                                          <div className="tracking-btn-group">
                                            <button
                                              type="button"
                                              className="tracking-btn btn-approve-app"
                                              disabled={isUpdating}
                                              onClick={() => handleUpdateApplicationStatus(scheme.scheme_id, "approved")}
                                            >
                                              {isUpdating ? "Updating..." : t.markAsApproved}
                                            </button>
                                            <button
                                              type="button"
                                              className="tracking-btn btn-reject-app"
                                              disabled={isUpdating}
                                              onClick={() => handleUpdateApplicationStatus(scheme.scheme_id, "rejected")}
                                            >
                                              {isUpdating ? "Updating..." : t.markAsRejected}
                                            </button>
                                          </div>
                                        </div>
                                      )}


                                      {currentTrackStatus === "approved" && (
                                        <div className="tracking-approved-box">
                                          <span className="tracking-completed-badge">
                                            {t.approvedBanner}
                                          </span>
                                        </div>
                                      )}

                                      {currentTrackStatus === "rejected" && (
                                        <div className="tracking-rejected-box">
                                          <span className="tracking-rejected-badge">
                                            {t.rejectedBanner}
                                          </span>
                                          <button
                                            type="button"
                                            className="tracking-btn btn-reset-app"
                                            disabled={isUpdating}
                                            onClick={() => handleUpdateApplicationStatus(scheme.scheme_id, "ready_to_apply")}
                                          >
                                            {t.reapplyBtn}
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    <p className="tracking-disclaimer">
                                      {t.lifecycleDisclaimer}
                                    </p>
                                  </div>

                                );
                              })()}
                            </div>
                          )}

                          {/* REMINDERS */}

                          {scheme.reminders?.reminders
                            ?.length > 0 && (
                            <div className="expanded-block reminders-block">
                              <h4>
                                <Bell size={17} />
                                {t.remindersHeading}
                              </h4>

                              <div className="reminder-list">
                                {scheme.reminders.reminders.map(
                                  (
                                    reminder,
                                    index
                                  ) => {
                                    const reminderId = `reminder-${scheme.scheme_id}-${index}`;

                                    return (
                                      <label
                                        className="reminder-item"
                                        key={`${reminder.title}-${index}`}
                                        htmlFor={reminderId}
                                      >
                                        <input
                                          id={
                                            reminderId
                                          }
                                          type="checkbox"
                                          checked={!!completedReminders[scheme.scheme_id + "-" + reminder.title]}
                                          onChange={() => handleToggleReminder(scheme.scheme_id + "-" + reminder.title)}
                                        />

                                        <span>
                                          <b>
                                            {
                                              tr(reminder.title, lang)
                                            }
                                          </b>

                                          <small>
                                            {
                                              tr(reminder.description, lang)
                                            }
                                          </small>
                                        </span>
                                      </label>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}

                          {/* APPLICATION LINK */}

                          {scheme.official_url && (
                            <a
                              className="official-link"
                              href={
                                scheme.official_url
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              Visit official scheme portal
                              <ExternalLink
                                size={15}
                              />
                            </a>
                          )}

                          {/* SOURCE */}

                          {(scheme.source_url ||
                            scheme.source_name) && (
                            <div className="source-info">
                              <strong>
                                Source verification
                              </strong>

                              <span>
                                {scheme.source_name ||
                                  "Official source"}
                                {scheme.verified_on
                                  ? ` · Verified ${scheme.verified_on}`
                                  : ""}
                              </span>

                              {scheme.source_url && (
                                <a
                                  href={
                                    scheme.source_url
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  View source
                                  <ExternalLink
                                    size={13}
                                  />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* FEATURES */}

        <section className="dashboard-features">
          <div className="feature-card">
            <div className="feature-icon">
              <SearchCheck
                size={20}
                strokeWidth={1.7}
              />
            </div>

            <h3>
              Smart Matching
            </h3>

            <p>
              Compare your profile with relevant
              government scheme conditions.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FileText
                size={20}
                strokeWidth={1.7}
              />
            </div>

            <h3>
              Missing Information
            </h3>

            <p>
              Understand what information or documents
              may still be required.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <ClipboardList
                size={20}
                strokeWidth={1.7}
              />
            </div>

            <h3>
              Action Plan
            </h3>

            <p>
              Follow personalized steps instead of
              searching through complicated scheme information.
            </p>
          </div>
        </section>
      </main>

      {/* ── FLOATING CHAT BUTTON ── */}
      <button
        className="chat-fab"
        onClick={() => setIsChatOpen((o) => !o)}
        aria-label="Toggle GuideX AI Chat"
        title="GuideX AI"
      >
        {isChatOpen ? "✕" : <MessageCircle size={24} strokeWidth={1.8} />}
      </button>

      {/* ── CHAT PANEL ── */}
      {isChatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <span className="chat-header-icon">
              <MessageCircle size={20} strokeWidth={1.8} />
            </span>
            <div>
              <div className="chat-header-title">{t.chatTitle}</div>
              <div className="chat-header-sub">{t.poweredBy}</div>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setIsChatOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Quick-prompt chips */}
          <div className="chat-chips">
            {[t.chip1, t.chip2, t.chip3].map((q) => (
              <button
                key={q}
                className="chat-chip"
                onClick={() => handleChatSend(q)}
                disabled={chatLoading}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message list */}
          <div className="chat-messages">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={
                  msg.role === "user"
                    ? "chat-msg chat-msg-user"
                    : "chat-msg chat-msg-bot"
                }
              >
                {msg.role === "assistant" && (
                  <span className="chat-bot-icon">
                    <MessageCircle size={14} strokeWidth={1.8} />
                  </span>
                )}
                <span className="chat-msg-text">{msg.text}</span>
              </div>
            ))}
            {chatLoading && (
              <div className="chat-msg chat-msg-bot">
                <span className="chat-bot-icon">
                  <MessageCircle size={14} strokeWidth={1.8} />
                </span>
                <span className="chat-msg-text chat-typing">Thinking…</span>
              </div>
            )}
          </div>

          {/* Input row */}
          <div className="chat-input-row">
            <input
              type="text"
              className="chat-input"
              placeholder={t.chatPlaceholder}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
              disabled={chatLoading}
            />
            <button
              className="chat-send-btn"
              onClick={() => handleChatSend()}
              disabled={chatLoading || !chatInput.trim()}
            >
              {t.chatSend}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;