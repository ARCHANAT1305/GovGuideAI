import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Landmark, Eye, EyeOff, Globe } from "lucide-react";
import { translations } from "../utils/translations";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem("govguide_lang") || "en");

  const t = translations[lang] || translations.en;
  const navigate = useNavigate();

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    localStorage.setItem("govguide_lang", newLang);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError(
        lang === "ta"
          ? "கடவுச்சொற்கள் பொருந்தவில்லை. சரியாக மீண்டும் உள்ளிடவும்."
          : "Passwords do not match. Please re-enter your password correctly."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        lang === "ta"
          ? "கடவுச்சொல் குறைந்தது 6 எழுத்துக்கள் இருக்க வேண்டும்."
          : "Password must be at least 6 characters long."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          lang === "ta"
            ? "பதிவு வெற்றிகரமாக முடிந்தது! உள்நுழைவு பக்கத்திற்கு திருப்பிவிடப்படுகிறது…"
            : "Registration successful! Redirecting to login page…"
        );
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(
          data.detail ||
            (lang === "ta"
              ? "பதிவு தோல்வியடைந்தது. உங்கள் விவரங்களை சரிபார்க்கவும்."
              : "Registration failed. Please check your details.")
        );
      }
    } catch (err) {
      console.error(err);
      setError(
        lang === "ta"
          ? "சர்வரில் இணைக்க முடியவில்லை."
          : "Could not connect to the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Language Selector — top right corner */}
      <div className="auth-lang-bar">
        <Globe size={14} className="auth-lang-icon" />
        <select
          className="auth-lang-select"
          value={lang}
          onChange={handleLangChange}
          aria-label="Select Language"
        >
          <option value="en">English</option>
          <option value="ta">தமிழ் (Tamil)</option>
        </select>
      </div>

      <div className="register-left">
        <div className="register-brand">
          <span className="brand-icon">
            <Landmark aria-hidden="true" size={21} strokeWidth={1.7} />
          </span>
          <span>GovGuide</span>
        </div>

        <div className="register-content">
          <span className="eyebrow eyebrow-light">{t.registerEyebrow}</span>
          <h1>{t.registerHero}</h1>
          <p>{t.registerHeroDesc}</p>

          <div className="register-features">
            <div>
              <span><Check aria-hidden="true" size={15} strokeWidth={2} /></span>
              {t.registerFeature1}
            </div>
            <div>
              <span><Check aria-hidden="true" size={15} strokeWidth={2} /></span>
              {t.registerFeature2}
            </div>
            <div>
              <span><Check aria-hidden="true" size={15} strokeWidth={2} /></span>
              {t.registerFeature3}
            </div>
          </div>
        </div>
      </div>

      <div className="register-right">
        <div className="register-card">
          <div className="register-heading">
            <h2>{t.registerTitle}</h2>
            <p>{t.registerSubtitle}</p>
          </div>

          {error && <div className="register-error-msg">{error}</div>}
          {success && <div className="register-success-msg">{success}</div>}

          <form className="register-form" onSubmit={handleRegister}>
            <div>
              <label>{t.registerName}</label>
              <input
                type="text"
                placeholder={t.registerNamePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label>{t.registerEmail}</label>
              <input
                type="email"
                placeholder={t.registerEmailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label>{t.registerPassword}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t.registerPasswordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label>{t.registerConfirmPassword}</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t.registerConfirmPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="register-button" disabled={loading}>
              {loading ? t.registerCreating : t.registerBtn}
            </button>
          </form>

          <p className="register-link">
            {t.registerHaveAccount} <Link to="/login">{t.registerSignIn}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
