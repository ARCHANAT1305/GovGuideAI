'use client';

import React from 'react';
import { SupportedLanguage } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { ShieldCheck, ExternalLink, Heart, Globe, PhoneCall } from 'lucide-react';

interface FooterProps {
  currentLang: SupportedLanguage;
}

export default function Footer({ currentLang }: FooterProps) {
  const t = TRANSLATIONS[currentLang];

  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2 text-white font-extrabold text-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>Gov<span className="text-gov-blue">Guide</span> AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering citizens with transparent access, personalized eligibility insights, and document checklists for Indian public welfare schemes.
            </p>
            <div className="pt-2">
              <span className="inline-block bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-[11px] text-slate-300">
                🇮🇳 Designed for Citizen Empowerment
              </span>
            </div>
          </div>

          {/* Official Portals */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Official Digital Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a href="https://www.mygov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>MyGov Citizen Platform</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a href="https://web.umang.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>UMANG Unified Mobile App</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
              <li>
                <a href="https://digitallocker.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>DigiLocker Digital Wallet</span>
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Citizen Helplines */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Emergency & Welfare Helplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between text-slate-300">
                <span>National Emergency:</span>
                <strong className="text-white font-mono">112</strong>
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Ayushman Bharat:</span>
                <strong className="text-white font-mono">14555</strong>
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Kisan Call Center:</span>
                <strong className="text-white font-mono">1800-180-1551</strong>
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Senior Citizen Line:</span>
                <strong className="text-white font-mono">14567</strong>
              </li>
              <li className="flex items-center justify-between text-slate-300">
                <span>Women Helpline:</span>
                <strong className="text-white font-mono">1091 / 181</strong>
              </li>
            </ul>
          </div>

          {/* Advisory Disclaimer */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Transparency & Disclaimer
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              GovGuide AI is an independent civic-tech advisory platform built to simplify access to government welfare programs. It is not directly affiliated with any single ministry. Citizens are encouraged to verify current criteria and submit official applications solely on authenticated .gov.in or .nic.in domains.
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} GovGuide AI • Public Benefit Digital Guide
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Open Data Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
