'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EligibilityChecker from '@/components/EligibilityChecker';
import SchemeCatalog from '@/components/SchemeCatalog';
import DocumentChecklist from '@/components/DocumentChecklist';
import SchemeModal from '@/components/SchemeModal';
import ChatAssistant from '@/components/ChatAssistant';
import Footer from '@/components/Footer';
import { SupportedLanguage, Scheme } from '@/lib/types';
import { SCHEMES_DATABASE } from '@/data/schemes';
import { Bot, HelpCircle } from 'lucide-react';

export default function Home() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [checklistScheme, setChecklistScheme] = useState<Scheme>(SCHEMES_DATABASE[0]);
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchFromHero = (term: string) => {
    setCatalogSearch(term);
    handleScrollTo('schemes');
  };

  const handleOpenChecklist = (scheme: Scheme) => {
    setChecklistScheme(scheme);
    handleScrollTo('checklist');
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* Top Navigation */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenChat={() => setIsChatOpen(true)}
        onScrollTo={handleScrollTo}
      />

      {/* Hero Section with Quick Search */}
      <Hero
        currentLang={currentLang}
        onSearch={handleSearchFromHero}
        onCheckEligibility={() => handleScrollTo('eligibility')}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Instant Eligibility Calculator Section */}
      <EligibilityChecker
        currentLang={currentLang}
        onSelectScheme={(scheme) => setSelectedScheme(scheme)}
        onSelectChecklist={handleOpenChecklist}
      />

      {/* Comprehensive Schemes Directory */}
      <SchemeCatalog
        currentLang={currentLang}
        searchFilter={catalogSearch}
        onSelectScheme={(scheme) => setSelectedScheme(scheme)}
        onSelectChecklist={handleOpenChecklist}
      />

      {/* Document Checklist & Readiness Generator */}
      <DocumentChecklist
        currentLang={currentLang}
        selectedScheme={checklistScheme}
        onSchemeChange={setChecklistScheme}
      />

      {/* Footer */}
      <Footer currentLang={currentLang} />

      {/* Scheme Detail Popup Modal */}
      <SchemeModal
        scheme={selectedScheme}
        onClose={() => setSelectedScheme(null)}
        onOpenChecklist={handleOpenChecklist}
      />

      {/* AI Chat Assistant Drawer */}
      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentLang={currentLang}
        onSelectScheme={(scheme) => setSelectedScheme(scheme)}
      />

      {/* Persistent Floating Chat Trigger (Bottom Right) */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-gov-navy to-gov-blue hover:from-blue-900 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 flex items-center gap-2.5 transition-all transform hover:scale-105 group border-2 border-white/40"
          aria-label="Open GovGuide AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-amber-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="font-bold text-sm hidden md:inline pr-1">Ask GovGuide AI</span>
        </button>
      )}
    </main>
  );
}
