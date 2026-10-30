import React, { useState, useRef } from "react";
import {
  RotateCw,
  ShieldCheck,
  QrCode,
  Printer,
  Sparkles,
  CreditCard,
  Landmark,
  CheckCircle2,
} from "lucide-react";
import { tr } from "../utils/contentTranslations";

export default function DigitalBeneficiaryCard({
  user,
  profile,
  eligibleCount = 0,
  activeAppsCount = 0,
  lang = "en",
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({});
  const cardRef = useRef(null);

  // Formatted beneficiary name
  const citizenName =
    user?.full_name ||
    user?.name ||
    (profile?.gender === "Female" ? "Ms. Citizen" : "Mr. Citizen");

  // Synthetic ID based on user ID or timestamp
  const rawId = String(user?.id || "1024").padStart(4, "0");
  const beneficiaryId = `GG-IN-2026-${rawId}`;

  // Handle 3D Mouse Parallax Tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within card
    const y = e.clientY - rect.top; // y position within card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max rotation in degrees
    const maxRotate = 14;
    const rotateX = ((y - centerY) / centerY) * -maxRotate;
    const rotateY = ((x - centerX) / centerX) * maxRotate;

    // Glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: "transform 0.08s ease-out",
    });

    setGlareStyle({
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.42) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 70%)`,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
    });
    setGlareStyle({
      opacity: 0,
      transition: "opacity 0.5s ease",
    });
  };

  const toggleFlip = (e) => {
    e?.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  const handlePrint = (e) => {
    e?.stopPropagation();
    window.print();
  };

  return (
    <div className="beneficiary-card-wrapper">
      <div className="beneficiary-card-top-bar">
        <div className="card-top-label">
          <CreditCard size={17} className="text-gold" />
          <span>
            {lang === "ta"
              ? "3D ஸ்மார்ட் பயனாளி அட்டை (Interactive 3D Citizen Pass)"
              : "Digital Beneficiary Card (Interactive 3D Smart Pass)"}
          </span>
          <span className="card-motion-hint">
            <Sparkles size={13} />
            {lang === "ta" ? "3D சுழற்சி & திருப்புதல்" : "3D Parallax & Flip"}
          </span>
        </div>

        <div className="card-top-actions">
          <button
            type="button"
            className="card-action-btn flip-btn"
            onClick={toggleFlip}
            title="Flip to back / அட்டையை திருப்பவும்"
          >
            <RotateCw size={14} />
            <span>{lang === "ta" ? "அட்டையை திருப்புக" : "Flip Card"}</span>
          </button>

          <button
            type="button"
            className="card-action-btn print-btn"
            onClick={handlePrint}
            title="Print card"
          >
            <Printer size={14} />
            <span>{lang === "ta" ? "அச்சிடு" : "Print"}</span>
          </button>
        </div>
      </div>

      {/* 3D PERSPECTIVE CONTAINER */}
      <div
        className="card-3d-scene"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={toggleFlip}
        role="button"
        tabIndex={0}
        aria-label="Click to flip 3D card"
      >
        <div
          ref={cardRef}
          className={`card-3d-object ${isFlipped ? "flipped" : ""}`}
          style={tiltStyle}
        >
          {/* Dynamic Light Glare */}
          <div className="card-glare" style={glareStyle} />

          {/* FRONT FACE */}
          <div className="card-face card-front">
            {/* Top Row: Emblems and National Header */}
            <div className="card-front-header">
              <div className="card-emblem-box">
                <div className="card-ashoka-seal">
                  <Landmark size={20} />
                </div>
                <div className="card-issuer-text">
                  <span className="issuer-sub">
                    {lang === "ta" ? "இந்திய அரசு" : "GOVERNMENT OF INDIA"}
                  </span>
                  <span className="issuer-title">
                    {lang === "ta"
                      ? "தேசிய நலத்திட்ட வழிகாட்டி அட்டை"
                      : "GOVGUIDE BENEFICIARY SMART PASS"}
                  </span>
                </div>
              </div>

              <div className="card-badge-verified">
                <ShieldCheck size={14} />
                <span>{lang === "ta" ? "சரிபார்க்கப்பட்டது" : "VERIFIED"}</span>
              </div>
            </div>

            {/* Smart Microchip & Hologram Row */}
            <div className="card-chip-row">
              <div className="card-emv-chip" title="Smart Chip Security">
                <div className="chip-line horizontal"></div>
                <div className="chip-line vertical"></div>
                <div className="chip-core"></div>
              </div>

              <div className="card-hologram">
                <span className="holo-shimmer"></span>
                <span className="holo-text">DBT ENABLED</span>
              </div>
            </div>

            {/* Beneficiary ID Number */}
            <div className="card-id-number">{beneficiaryId}</div>

            {/* Citizen Details Row */}
            <div className="card-details-grid">
              <div className="card-detail-item">
                <span className="detail-label">
                  {lang === "ta" ? "பயனாளி பெயர்" : "BENEFICIARY NAME"}
                </span>
                <span className="detail-value citizen-name">{citizenName}</span>
              </div>

              <div className="card-detail-item">
                <span className="detail-label">
                  {lang === "ta" ? "மாநிலம் / இருப்பிடம்" : "STATE / DOMICILE"}
                </span>
                <span className="detail-value">
                  {profile?.state ? tr(profile.state, lang) : "All India"}
                </span>
              </div>

              <div className="card-detail-item">
                <span className="detail-label">
                  {lang === "ta" ? "பிரிவு & தொழில்" : "CATEGORY / OCCUPATION"}
                </span>
                <span className="detail-value">
                  {profile?.category || "General"} •{" "}
                  {profile?.occupation ? tr(profile.occupation, lang) : "Citizen"}
                </span>
              </div>

              <div className="card-detail-item right-align">
                <span className="detail-label">
                  {lang === "ta" ? "தகுதிபெற்ற திட்டங்கள்" : "ELIGIBLE SCHEMES"}
                </span>
                <span className="detail-value highlight-schemes">
                  <CheckCircle2 size={13} className="text-green" />
                  {eligibleCount > 0
                    ? `${eligibleCount} ${lang === "ta" ? "திட்டங்கள்" : "Active"}`
                    : "Ready"}
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="card-front-footer">
              <span>CIVIC DIRECT BENEFIT TRANSFER ID</span>
              <span>VALID THROUGHOUT INDIA</span>
            </div>
          </div>

          {/* BACK FACE */}
          <div className="card-face card-back">
            {/* Magnetic Stripe */}
            <div className="card-magstripe"></div>

            {/* Security Barcode & QR Box */}
            <div className="card-back-body">
              <div className="card-barcode-box">
                <div className="card-barcode">
                  <span className="barcode-line w-2"></span>
                  <span className="barcode-line w-1"></span>
                  <span className="barcode-line w-3"></span>
                  <span className="barcode-line w-1"></span>
                  <span className="barcode-line w-4"></span>
                  <span className="barcode-line w-2"></span>
                  <span className="barcode-line w-1"></span>
                  <span className="barcode-line w-3"></span>
                  <span className="barcode-line w-2"></span>
                  <span className="barcode-line w-4"></span>
                  <span className="barcode-line w-1"></span>
                  <span className="barcode-line w-2"></span>
                  <span className="barcode-line w-3"></span>
                  <span className="barcode-line w-1"></span>
                  <span className="barcode-line w-2"></span>
                  <span className="barcode-line w-4"></span>
                  <span className="barcode-line w-1"></span>
                  <span className="barcode-line w-3"></span>
                  <span className="barcode-line w-2"></span>
                </div>
                <span className="barcode-num">
                  SEC-{rawId}-2026-GOVGUIDE-VERIFIED
                </span>
              </div>

              <div className="card-qr-box" title="Scan to verify eligibility status">
                <svg
                  className="card-svg-qr"
                  viewBox="0 0 29 29"
                  width="64"
                  height="64"
                >
                  <path
                    fill="#18302c"
                    d="M0,0 h7 v7 h-7 z M2,2 h3 v3 h-3 z M9,0 h2 v3 h-2 z M13,0 h3 v2 h-3 z M18,0 h4 v1 h-4 z M22,0 h7 v7 h-7 z M24,2 h3 v3 h-3 z M0,9 h3 v2 h-3 z M5,9 h2 v4 h-2 z M9,9 h5 v2 h-5 z M16,9 h3 v2 h-3 z M21,9 h2 v3 h-2 z M25,9 h4 v2 h-4 z M0,13 h2 v3 h-2 z M9,13 h3 v4 h-3 z M14,13 h4 v2 h-4 z M20,13 h3 v3 h-3 z M25,13 h4 v4 h-4 z M0,18 h1 v4 h-1 z M3,18 h4 v2 h-4 z M9,18 h2 v4 h-2 z M13,18 h5 v1 h-5 z M20,18 h2 v3 h-2 z M24,18 h5 v1 h-5 z M0,22 h7 v7 h-7 z M2,24 h3 v3 h-3 z M9,24 h4 v5 h-4 z M15,24 h3 v2 h-3 z M20,24 h2 v5 h-2 z M24,24 h5 v5 h-5 z"
                  />
                </svg>
                <span className="qr-hint">SCAN TO VERIFY</span>
              </div>
            </div>

            {/* Back Details & Emergency Help */}
            <div className="card-back-info">
              <div className="back-info-row">
                <strong>{lang === "ta" ? "உதவி எண்கள்" : "National Helplines"}:</strong>
                <span>Kisan / Agriculture: 1800-180-1551</span>
                <span>NSP Scholarships: 0120-6619540</span>
              </div>

              <div className="back-info-disclaimer">
                {lang === "ta"
                  ? "இந்த அட்டை கோவ்கைடு போர்டல் மூலம் சரிபார்க்கப்பட்ட டிஜிட்டல் பாஸ் ஆகும். அரசு இ-சேவை மற்றும் வங்கி விண்ணப்பங்களுக்கு பயன்படுத்தலாம்."
                  : "This pass confirms eligibility based on registered criteria. Official disbursement is subject to eKYC & concerned state/central ministry verification."}
              </div>
            </div>

            {/* Back Footer */}
            <div className="card-back-footer">
              <span>GovGuide AI Digital Governance</span>
              <span>Click to flip back 🔄</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
