'use client';

import React from 'react';
import { SupportedLanguage } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { ShieldCheck, Globe, Bot, BookOpen, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenChat: () => void;
  onScrollTo: (id: string) => void;
}

export default function Navbar({ currentLang, onLanguageChange, onOpenChat, onScrollTo }: NavbarProps) {
  const t = TRANSLATIONS[currentLang];

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'es', label: 'Español' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo and National Emblem style mark */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onScrollTo('hero')}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-gov-navy to-gov-blue flex items-center justify-center text-white shadow-md shadow-blue-900/20">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                Gov<span className="text-gov-blue">Guide</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                AI 2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              Citizen Public Welfare & Schemes Portal
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-slate-700">
          <button 
            onClick={() => onScrollTo('eligibility')} 
            className="flex items-center gap-1.5 hover:text-gov-blue transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {t.checkEligibilityBtn}
          </button>
          <button 
            onClick={() => onScrollTo('schemes')} 
            className="flex items-center gap-1.5 hover:text-gov-blue transition-colors"
          >
            <BookOpen className="w-4 h-4 text-gov-blue" />
            {t.browseSchemesBtn}
          </button>
          <button 
            onClick={() => onScrollTo('checklist')} 
            className="flex items-center gap-1.5 hover:text-gov-blue transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            {t.checklistButton}
          </button>
        </nav>

        {/* Right Controls: Language Selector & AI Assistant Trigger */}
        <div className="flex items-center space-x-3">
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-200">
            <Globe className="w-4 h-4 text-slate-600 mr-1.5" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="text-slate-900 bg-white">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* AI Chat button */}
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 bg-gradient-to-r from-gov-navy to-gov-blue text-white px-4 py-2 rounded-lg font-medium text-sm shadow hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">{t.askAssistantBtn}</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>
      </div>
    </header>
  );
}
