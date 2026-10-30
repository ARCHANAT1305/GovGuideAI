'use client';

import React, { useState } from 'react';
import { SupportedLanguage, Scheme } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { SCHEMES_DATABASE } from '@/data/schemes';
import { CheckSquare, Square, AlertCircle, Printer, FileCheck, ArrowUpRight, HelpCircle } from 'lucide-react';

interface DocumentChecklistProps {
  currentLang: SupportedLanguage;
  selectedScheme?: Scheme;
  onSchemeChange: (scheme: Scheme) => void;
}

export default function DocumentChecklist({ currentLang, selectedScheme, onSchemeChange }: DocumentChecklistProps) {
  const t = TRANSLATIONS[currentLang];
  const activeScheme = selectedScheme || SCHEMES_DATABASE[0];

  // Map of checked documents by scheme id and document id
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleCheck = (docId: string) => {
    const key = `${activeScheme.id}_${docId}`;
    setCheckedDocs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const mandatoryDocs = activeScheme.requiredDocuments.filter(d => d.mandatory);
  const optionalDocs = activeScheme.requiredDocuments.filter(d => !d.mandatory);

  const mandatoryChecked = mandatoryDocs.filter(d => checkedDocs[`${activeScheme.id}_${d.id}`]).length;
  const readinessPercent = mandatoryDocs.length > 0 
    ? Math.round((mandatoryChecked / mandatoryDocs.length) * 100) 
    : 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="checklist" className="py-16 bg-slate-100/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
            <FileCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Document Readiness System</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            {t.documentsTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Never get your application rejected due to missing paperwork. Check off your available documents and see official acceptable alternatives.
          </p>
        </div>

        {/* Scheme Selector bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 mb-8 max-w-4xl mx-auto">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select Government Scheme to Generate Checklist:
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <select
              value={activeScheme.id}
              onChange={(e) => {
                const found = SCHEMES_DATABASE.find(s => s.id === e.target.value);
                if (found) onSchemeChange(found);
              }}
              className="w-full sm:flex-1 p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:border-gov-blue"
            >
              {SCHEMES_DATABASE.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Checklist</span>
            </button>
          </div>
        </div>

        {/* Checklist Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Readiness Meter Banner */}
          <div className="bg-gradient-to-r from-gov-navy to-slate-900 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  {activeScheme.shortName} Verification Desk
                </span>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  Application Readiness: {readinessPercent}%
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {mandatoryChecked} of {mandatoryDocs.length} mandatory documents verified ready.
                </p>
              </div>

              {/* Visual meter bar */}
              <div className="w-full sm:w-64 bg-slate-700/60 rounded-full h-4 overflow-hidden p-0.5 border border-slate-600">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    readinessPercent === 100
                      ? 'bg-emerald-400'
                      : readinessPercent >= 50
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Mandatory Docs */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h4 className="font-bold text-base text-slate-900">
                  {t.mandatoryDocs} ({mandatoryDocs.length})
                </h4>
              </div>

              <div className="space-y-3">
                {mandatoryDocs.map((doc) => {
                  const isChecked = !!checkedDocs[`${activeScheme.id}_${doc.id}`];

                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleCheck(doc.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-200'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="pt-0.5 text-slate-600">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`font-bold text-sm ${isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                              {doc.name}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                              Mandatory
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mt-1">
                            <span className="font-medium text-slate-700">Purpose:</span> {doc.purpose}
                          </p>

                          {doc.alternatives && doc.alternatives.length > 0 && (
                            <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5">
                              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <span>
                                <span className="font-semibold">Acceptable Alternative:</span> {doc.alternatives.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional Docs */}
            {optionalDocs.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <h4 className="font-bold text-base text-slate-900">
                    {t.optionalDocs} ({optionalDocs.length})
                  </h4>
                </div>

                <div className="space-y-3">
                  {optionalDocs.map((doc) => {
                    const isChecked = !!checkedDocs[`${activeScheme.id}_${doc.id}`];

                    return (
                      <div
                        key={doc.id}
                        onClick={() => toggleCheck(doc.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-200'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="pt-0.5 text-slate-600">
                            {isChecked ? (
                              <CheckSquare className="w-5 h-5 text-gov-blue" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-400" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className={`font-bold text-sm ${isChecked ? 'text-blue-950' : 'text-slate-900'}`}>
                                {doc.name}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                Optional / Specific Cases
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 mt-1">
                              <span className="font-medium text-slate-700">Purpose:</span> {doc.purpose}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Practical Advice Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-950">
              <AlertCircle className="w-5 h-5 text-gov-blue shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Official Document Advisory:</span> Ensure that your Name, Date of Birth, and Father's/Spouse's Name are spelt identically across your Aadhaar card and Bank passbook. Mismatched spellings are the #1 cause of DBT rejection.
              </div>
            </div>

            {/* Portal Link */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Helpline: <span className="font-bold text-slate-800">{activeScheme.helpline}</span>
              </span>
              <a
                href={activeScheme.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-gov-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>Visit {activeScheme.shortName} Portal</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
