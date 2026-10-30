'use client';

import React from 'react';
import { Scheme } from '@/lib/types';
import { X, ExternalLink, CheckCircle, Clock, Phone, AlertCircle, FileText, ArrowRight } from 'lucide-react';

interface SchemeModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  onOpenChecklist: (scheme: Scheme) => void;
}

export default function SchemeModal({ scheme, onClose, onOpenChecklist }: SchemeModalProps) {
  if (!scheme) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-gov-blue">
              {scheme.category}
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              {scheme.ministry}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Title */}
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
              {scheme.name}
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {scheme.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Income Ceiling</span>
              <span className="font-bold text-slate-900 text-sm">
                {scheme.maxIncomeLimit ? `Up to ₹${scheme.maxIncomeLimit.toLocaleString()}/yr` : 'No Limit'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Age Eligibility</span>
              <span className="font-bold text-slate-900 text-sm">
                {(scheme.minAge || scheme.maxAge) ? `${scheme.minAge || 0} - ${scheme.maxAge || 'Any'} yrs` : 'All Ages'}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block font-medium">Gender Group</span>
              <span className="font-bold text-slate-900 text-sm">
                {scheme.genderEligibility || 'All Genders'}
              </span>
            </div>
          </div>

          {/* Key Benefits */}
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Program Benefits & Support</span>
            </h3>
            <div className="space-y-2">
              {scheme.benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Application Guide */}
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gov-blue" />
              <span>Step-by-Step Application Process</span>
            </h3>
            <div className="space-y-3">
              {scheme.stepsToApply.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-gov-blue font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                    {idx + 1}
                  </div>
                  <div className="flex-1 pt-0.5">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Time & Helpline */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-100 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Processing: <strong className="text-slate-900">{scheme.processingTime}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>Toll-Free Helpline: <strong className="text-slate-900">{scheme.helpline}</strong></span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenChecklist(scheme);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-semibold transition-colors"
          >
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Open Document Checklist</span>
          </button>

          <a
            href={scheme.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gov-blue hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all"
          >
            <span>Apply on Official Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
