'use client';

import React, { useState } from 'react';
import { SupportedLanguage } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { Search, Sparkles, CheckCircle, ArrowRight, ShieldCheck, HeartPulse, GraduationCap, Building2 } from 'lucide-react';

interface HeroProps {
  currentLang: SupportedLanguage;
  onSearch: (term: string) => void;
  onCheckEligibility: () => void;
  onOpenChat: () => void;
}

export default function Hero({ currentLang, onSearch, onCheckEligibility, onOpenChat }: HeroProps) {
  const t = TRANSLATIONS[currentLang];
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const quickPills = [
    { label: 'Farmer ₹6,000 Subsidy', query: 'PM-KISAN' },
    { label: '₹5 Lakh Health Cover', query: 'Ayushman' },
    { label: 'Post-Matric Scholarship', query: 'Scholarship' },
    { label: 'Zero Collateral Loan', query: 'Mudra' },
    { label: 'Housing Grants', query: 'Awas' },
  ];

  return (
    <div id="hero" className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white pt-12 pb-16 border-b border-slate-200">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-gov-blue" />
            <span>AI-Powered Citizen Guidance & Verification Engine</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none mb-6">
            {t.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto font-normal leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Main Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-6">
            <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border-2 border-slate-300 focus-within:border-gov-blue bg-white transition-all">
              <Search className="w-6 h-6 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full py-4 px-4 text-slate-900 placeholder-slate-400 focus:outline-none text-base"
              />
              <button
                type="submit"
                className="bg-gov-blue hover:bg-blue-700 text-white font-semibold px-6 py-4 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs text-slate-600">
            <span className="font-semibold text-slate-500">Popular:</span>
            {quickPills.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setSearchTerm(p.query);
                  onSearch(p.query);
                }}
                className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-full font-medium shadow-2xs transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onCheckEligibility}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-emerald-700/20 transition-all transform hover:-translate-y-0.5"
            >
              <CheckCircle className="w-5 h-5" />
              {t.checkEligibilityBtn}
            </button>
            <button
              onClick={onOpenChat}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gov-navy hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-slate-900/20 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              {t.askAssistantBtn}
            </button>
          </div>
        </div>

        {/* Highlight Grid / Key Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">₹5,00,000</div>
              <div className="text-xs text-slate-500 font-medium">Free Health Coverage / Family</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">₹6,000 / Year</div>
              <div className="text-xs text-slate-500 font-medium">Direct Farmer DBT Support</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">Up to ₹20 Lakh</div>
              <div className="text-xs text-slate-500 font-medium">Zero Collateral MSME Loans</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3.5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">100% Free</div>
              <div className="text-xs text-slate-500 font-medium">Student Scholarship Portals</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
