'use client';

import React, { useState } from 'react';
import { SupportedLanguage, Scheme, Category } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { SCHEMES_DATABASE } from '@/data/schemes';
import { searchSchemes } from '@/lib/matcher';
import { Search, ExternalLink, FileText, ChevronRight, Sparkles, Filter } from 'lucide-react';

interface SchemeCatalogProps {
  currentLang: SupportedLanguage;
  searchFilter: string;
  onSelectScheme: (scheme: Scheme) => void;
  onSelectChecklist: (scheme: Scheme) => void;
}

export default function SchemeCatalog({ currentLang, searchFilter, onSelectScheme, onSelectChecklist }: SchemeCatalogProps) {
  const t = TRANSLATIONS[currentLang];
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [internalQuery, setInternalQuery] = useState(searchFilter);

  // Sync internalQuery if parent searchFilter changes
  React.useEffect(() => {
    if (searchFilter !== undefined) {
      setInternalQuery(searchFilter);
    }
  }, [searchFilter]);

  const categories: Category[] = [
    'All',
    'Agriculture',
    'Healthcare',
    'Education',
    'Housing',
    'Business & MSME',
    'Social Welfare',
    'Women & Child'
  ];

  const filteredSchemes = searchSchemes(internalQuery, activeCategory);

  return (
    <section id="schemes" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-gov-blue text-xs font-semibold mb-3">
            <Filter className="w-3.5 h-3.5" />
            <span>Comprehensive Welfare Schemes</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            {t.schemesDirectory}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Explore verified central and state welfare initiatives with clear criteria, benefits, and required paperwork.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 mb-10">
          {/* Search bar inside catalog */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={internalQuery}
              onChange={(e) => setInternalQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-gov-blue focus:bg-white text-sm transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-gov-navy text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-600">
            Showing <span className="text-gov-blue font-bold">{filteredSchemes.length}</span> schemes in <span className="font-bold">{activeCategory}</span>
          </span>
          {internalQuery && (
            <button
              onClick={() => setInternalQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Sector & Ministry */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-gov-blue border border-blue-200">
                    {scheme.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 truncate max-w-[150px]">
                    {scheme.ministry}
                  </span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectScheme(scheme)}
                  className="font-bold text-lg text-slate-900 group-hover:text-gov-blue transition-colors cursor-pointer mb-2 line-clamp-1"
                >
                  {scheme.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Key Benefits Preview */}
                <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1.5 border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Key Highlights
                  </div>
                  {scheme.benefits.slice(0, 2).map((benefit, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span className="line-clamp-1">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectChecklist(scheme)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-gov-blue py-1.5 px-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Checklist</span>
                </button>

                <button
                  onClick={() => onSelectScheme(scheme)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gov-blue hover:text-blue-700 py-1.5 px-3 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <span>{t.viewDetails}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSchemes.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-800">No schemes found</h4>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
              We couldn't find any schemes matching "{internalQuery}". Try searching for broader terms like "farmer", "health", or "loan".
            </p>
            <button
              onClick={() => {
                setInternalQuery('');
                setActiveCategory('All');
              }}
              className="bg-gov-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
