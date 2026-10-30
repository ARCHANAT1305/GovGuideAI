import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Landmark, Globe } from "lucide-react";
import { translations } from "../utils/translations";
import "../styles/Home.css";

function Home() {
  const [lang, setLang] = useState(() => localStorage.getItem("govguide_lang") || "en");
  const t = translations[lang] || translations.en;

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    localStorage.setItem("govguide_lang", newLang);
  };

  return (
    <div className="home-page">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">
            <Landmark aria-hidden="true" size={21} strokeWidth={1.7} />
          </div>
          <span className="brand-name">GovGuide</span>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/">{t.homeNavHome}</Link>
          <Link to="/login">{t.homeNavLogin}</Link>
          <Link to="/register">{t.homeNavRegister}</Link>

          {/* Language Selector */}
          <div className="home-lang-wrapper">
            <Globe size={14} className="home-lang-icon" />
            <select
              className="home-lang-select"
              value={lang}
              onChange={handleLangChange}
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>
        </nav>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">{t.homeEyebrow}</span>
            <h1>{t.homeHero}</h1>
            <p>{t.homeHeroDesc}</p>

            <div className="hero-actions">
              <Link to="/dashboard" className="primary-button">
                {t.homeFindSchemes}
                <ArrowRight aria-hidden="true" size={17} strokeWidth={1.8} />
              </Link>
              <Link to="/login" className="secondary-button">
                {t.homeSignIn}
              </Link>
            </div>

            <div className="hero-stats" aria-label="Key platform metrics">
              <div>
                <strong>120+</strong>
                <span>{t.homeStatPrograms}</span>
              </div>
              <div>
                <strong>4.9/5</strong>
                <span>{t.homeStatRating}</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>{t.homeStatSupport}</span>
              </div>
            </div>
          </div>

          <div className="hero-panel" aria-label={t.homePanelEligibility}>
            <div className="panel-header">
              <span className="status-dot" />
              {t.homePanelEligibility}
            </div>

            <div className="panel-card">
              <div className="mini-label">{t.homePanelRecommended}</div>
              <h3>{t.homePanelCategory}</h3>
              <ul>
                <li>{t.homePanelLi1}</li>
                <li>{t.homePanelLi2}</li>
                <li>{t.homePanelLi3}</li>
              </ul>
            </div>

            <div className="panel-row">
              <div>
                <small>{t.homePanelMatch}</small>
                <strong>92%</strong>
              </div>
              <div>
                <small>{t.homePanelDocs}</small>
                <strong>{t.homePanelPending}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Trust highlights">
          <div>{t.homeTrust1}</div>
          <div>{t.homeTrust2}</div>
          <div>{t.homeTrust3}</div>
          <div>{t.homeTrust4}</div>
        </section>

        <section className="process-section">
          <div className="section-heading">
            <span className="eyebrow eyebrow-alt">{t.homeHowItWorks}</span>
            <h2>{t.homeHowSub}</h2>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">1</span>
              <h3>{t.homeStep1Title}</h3>
              <p>{t.homeStep1Desc}</p>
            </article>

            <article className="step-card">
              <span className="step-number">2</span>
              <h3>{t.homeStep2Title}</h3>
              <p>{t.homeStep2Desc}</p>
            </article>

            <article className="step-card">
              <span className="step-number">3</span>
              <h3>{t.homeStep3Title}</h3>
              <p>{t.homeStep3Desc}</p>
            </article>

            <article className="step-card">
              <span className="step-number">4</span>
              <h3>{t.homeStep4Title}</h3>
              <p>{t.homeStep4Desc}</p>
            </article>
          </div>
        </section>

        <section className="feature-showcase">
          <div className="showcase-copy">
            <span className="eyebrow eyebrow-alt">{t.homeBuiltFor}</span>
            <h2>{t.homeBuiltTitle}</h2>
            <p>{t.homeBuiltDesc}</p>
            <ul>
              <li>{t.homeFeature1}</li>
              <li>{t.homeFeature2}</li>
              <li>{t.homeFeature3}</li>
            </ul>
          </div>

          <div className="showcase-card">
            <div className="card-header">
              <span className="card-pill">{t.homeAppProgress}</span>
            </div>
            <div className="progress-list">
              <div className="progress-item complete">
                <span>{t.homeProgressDone}</span>
                <strong>{t.homeProgressDoneLabel}</strong>
              </div>
              <div className="progress-item active">
                <span>{t.homeProgressActive}</span>
                <strong>{t.homeProgressActiveLabel}</strong>
              </div>
              <div className="progress-item">
                <span>{t.homeProgressDocs}</span>
                <strong>{t.homeProgressDocsLabel}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>{t.homeFooter1}</p>
        <p>{t.homeFooter2}</p>
      </footer>
    </div>
  );
}

export default Home;
