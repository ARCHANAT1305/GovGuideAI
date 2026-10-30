import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Landmark, Globe } from "lucide-react";
import { translations } from "../utils/translations";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [lang, setLang] = useState(() => localStorage.getItem("govguide_lang") || "en");

  const t = translations[lang] || translations.en;
  const navigate = useNavigate();

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    localStorage.setItem("govguide_lang", newLang);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(lang === "ta" ? "உள்நுழைவு வெற்றிகரமாக முடிந்தது!" : "Login successful!");
        localStorage.setItem("user", JSON.stringify(data));
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setError(data.detail || (lang === "ta" ? "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது" : "Invalid email or password"));
      }
    } catch (err) {
      console.error(err);
      setError(lang === "ta" ? "சர்வரில் இணைக்க முடியவில்லை" : "Could not connect to the backend");
    }
  };

  return (
    <div className="login-page">
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

      <div className="login-left">
        <div className="login-brand">
          <span className="brand-icon">
            <Landmark aria-hidden="true" size={21} strokeWidth={1.7} />
          </span>
          <span>GovGuide</span>
        </div>

        <div className="login-content">
          <span className="eyebrow eyebrow-light">{t.loginSecureAccess}</span>
          <h1>{t.loginWelcome}</h1>
          <p>{t.loginWelcomeDesc}</p>

          <div className="login-features">
            <div>
              <span><Check aria-hidden="true" size={15} strokeWidth={2} /></span>
              {t.loginFeature1}
            </div>
            <div>
              <span><Check aria-hidden="true" size={15} strokeWidth={2} /></span>
              {t.loginFeature2}
            </div>
            <div>
              <span><Check aria-hidden="true" size={15} strokeWidth={2} /></span>
              {t.loginFeature3}
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-heading">
            <h2>{t.loginTitle}</h2>
            <p>{t.loginSubtitle}</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>{t.loginEmail}</label>
              <input
                type="email"
                placeholder={t.loginEmailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label>{t.loginPassword}</label>
                <span>{t.loginForgot}</span>
              </div>
              <input
                type="password"
                placeholder={t.loginPasswordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="remember-row">
              <label className="checkbox-wrap">
                <input type="checkbox" />
                <span>{t.loginRemember}</span>
              </label>
            </div>

            <button type="submit" className="login-button">
              {t.loginBtn}
            </button>
          </form>

          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="divider">
            <span>{t.loginOr}</span>
          </div>

          <p className="register-link">
            {t.loginNoAccount} <Link to="/register">{t.loginCreateAccount}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
