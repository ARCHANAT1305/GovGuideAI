'use client';

import React, { useState } from 'react';
import { SupportedLanguage, UserProfile, Scheme, EligibilityEvaluation } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { SCHEMES_DATABASE } from '@/data/schemes';
import { evaluateEligibility } from '@/lib/matcher';
import { CheckCircle2, XCircle, ArrowRight, FileText, SlidersHorizontal, Award, Sparkles } from 'lucide-react';

interface EligibilityCheckerProps {
  currentLang: SupportedLanguage;
  onSelectScheme: (scheme: Scheme) => void;
  onSelectChecklist: (scheme: Scheme) => void;
}

export default function EligibilityChecker({ currentLang, onSelectScheme, onSelectChecklist }: EligibilityCheckerProps) {
  const t = TRANSLATIONS[currentLang];

  const [profile, setProfile] = useState<UserProfile>({
    age: 26,
    annualIncome: 180000,
    occupation: 'Farmer',
    gender: 'Female',
    state: 'Maharashtra',
    categoryGroup: 'OBC',
    isFarmer: true,
    isStudent: false
  });

  const [hasCalculated, setHasCalculated] = useState(true);

  const statesList = [
    'All India / Central', 'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 
    'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 
    'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  const occupationsList = [
    { label: 'Farmer / Agricultural Landholder', value: 'Farmer', isFarmer: true },
    { label: 'Student / Enrolled Scholar', value: 'Student', isStudent: true },
    { label: 'Small Business Owner / Artisan / MSME', value: 'Entrepreneur' },
    { label: 'Salaried Employee (Private / Informal)', value: 'Salaried' },
    { label: 'Daily Wage / Construction / Unorganized Worker', value: 'Unorganized' },
    { label: 'Homemaker', value: 'Homemaker' },
    { label: 'Senior Citizen / Retired', value: 'Senior' }
  ];

  const handleOccupationChange = (val: string) => {
    const isFarm = val === 'Farmer';
    const isStud = val === 'Student';
    setProfile(prev => ({
      ...prev,
      occupation: val,
      isFarmer: isFarm,
      isStudent: isStud
    }));
  };

  // Run evaluations
  const evaluations: EligibilityEvaluation[] = SCHEMES_DATABASE.map(scheme => {
    return evaluateEligibility(profile, scheme);
  }).sort((a, b) => b.matchScore - a.matchScore);

  const eligibleCount = evaluations.filter(e => e.isEligible).length;

  return (
    <section id="eligibility" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart Match Algorithm</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            {t.eligibilityCheckerTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.eligibilityCheckerSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Filter Panel */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <SlidersHorizontal className="w-5 h-5 text-gov-blue" />
                <span>Your Citizen Profile</span>
              </div>
              <button
                onClick={() => {
                  setProfile({
                    age: 28,
                    annualIncome: 200000,
                    occupation: 'Farmer',
                    gender: 'Female',
                    state: 'All India / Central',
                    categoryGroup: 'General',
                    isFarmer: true,
                    isStudent: false
                  });
                }}
                className="text-xs font-semibold text-slate-500 hover:text-gov-blue"
              >
                {t.resetButton}
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Age */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.ageLabel}: <span className="text-gov-blue font-bold text-base">{profile.age}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  className="w-full accent-gov-blue cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>0 yr (Infant)</span>
                  <span>60 yr (Senior)</span>
                  <span>100 yr</span>
                </div>
              </div>

              {/* Annual Household Income */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.incomeLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">₹</span>
                  <input
                    type="number"
                    step="10000"
                    value={profile.annualIncome}
                    onChange={(e) => setProfile({ ...profile, annualIncome: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-gov-blue font-semibold"
                  />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  ₹{Number(profile.annualIncome).toLocaleString('en-IN')} / year (~ ₹{Math.round(profile.annualIncome / 12).toLocaleString('en-IN')} / month)
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.genderLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Female', 'Male', 'Other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setProfile({ ...profile, gender: g })}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        profile.gender === g
                          ? 'bg-gov-blue text-white border-gov-blue shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occupation */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.occupationLabel}
                </label>
                <select
                  value={profile.occupation}
                  onChange={(e) => handleOccupationChange(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:border-gov-blue text-xs sm:text-sm font-medium"
                >
                  {occupationsList.map((occ) => (
                    <option key={occ.value} value={occ.value}>
                      {occ.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Social Category */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.categoryLabel}
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {['General', 'OBC', 'SC', 'ST', 'EWS'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setProfile({ ...profile, categoryGroup: c })}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        profile.categoryGroup === c
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.stateLabel}
                </label>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 bg-white focus:outline-none focus:border-gov-blue text-xs sm:text-sm"
                >
                  {statesList.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="bg-emerald-50 rounded-xl p-3 text-emerald-900 flex items-center justify-between">
                <span className="text-xs font-semibold">Matched Programs:</span>
                <span className="font-extrabold text-base text-emerald-700">{eligibleCount} Schemes Eligible</span>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-slate-900">
                Evaluation Results ({evaluations.length} Analyzed)
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Ranked by Eligibility Score
              </span>
            </div>

            {evaluations.map(({ scheme, isEligible, matchScore, criteriaMet, criteriaMissing }) => {
              const isHigh = matchScore >= 75;
              const isMedium = matchScore >= 50 && matchScore < 75;

              return (
                <div
                  key={scheme.id}
                  className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
                    isEligible
                      ? 'border-emerald-300 hover:border-emerald-400 ring-1 ring-emerald-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-gov-blue">
                          {scheme.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {scheme.ministry}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 hover:text-gov-blue cursor-pointer" onClick={() => onSelectScheme(scheme)}>
                        {scheme.name}
                      </h4>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0">
                      <div className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                        isHigh
                          ? 'bg-emerald-600 text-white'
                          : isMedium
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        <Award className="w-3.5 h-3.5" />
                        <span>{matchScore}% Match</span>
                      </div>
                      <span className={`text-[11px] font-semibold ${isEligible ? 'text-emerald-700' : 'text-slate-500'}`}>
                        {isEligible ? 'Eligible to Apply' : 'Partially Matched'}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {scheme.description}
                  </p>

                  {/* Highlights of criteria */}
                  <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs space-y-1.5 border border-slate-100">
                    {criteriaMet.slice(0, 2).map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                    {criteriaMissing.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-rose-700">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs font-semibold">
                    <div className="text-slate-500">
                      <span className="font-bold text-slate-700">{scheme.requiredDocuments.length}</span> Documents Required
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectChecklist(scheme)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Document Checklist</span>
                      </button>
                      <button
                        onClick={() => onSelectScheme(scheme)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gov-blue hover:bg-blue-700 text-white transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
