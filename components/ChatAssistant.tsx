'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, ChatMessage, Scheme } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { Bot, User, Send, X, Sparkles, ArrowRight, CornerDownLeft, ExternalLink, HelpCircle } from 'lucide-react';

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  onSelectScheme: (scheme: Scheme) => void;
}

export default function ChatAssistant({ isOpen, onClose, currentLang, onSelectScheme }: ChatAssistantProps) {
  const t = TRANSLATIONS[currentLang];
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: t.chatWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: currentLang
        })
      });

      if (!res.ok) throw new Error('Failed to fetch response');
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        schemesSuggested: data.schemesSuggested,
        quickActions: data.quickActions
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I had trouble connecting to the advisory service. Please check your connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-gov-navy to-gov-blue text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 border border-white/20">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">GovGuide AI Chat</h3>
                <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-400/40">
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Scheme recommendations & paperwork guidance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gov-blue text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-gov-blue text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Suggested Schemes inside chat */}
                {msg.schemesSuggested && msg.schemesSuggested.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Recommended Schemes:
                    </span>
                    {msg.schemesSuggested.map((scheme) => (
                      <div
                        key={scheme.id}
                        onClick={() => {
                          onClose();
                          onSelectScheme(scheme);
                        }}
                        className="bg-white border border-blue-200 hover:border-gov-blue rounded-xl p-2.5 text-xs cursor-pointer shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-gov-blue">
                            {scheme.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {scheme.category} • {scheme.shortName}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-gov-blue group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Action Chips */}
                {msg.quickActions && msg.quickActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.quickActions.map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(qa.query)}
                        className="text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-gov-blue border border-blue-200 rounded-lg px-2.5 py-1 transition-colors text-left"
                      >
                        {qa.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className={`text-[10px] text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
              <div className="w-8 h-8 rounded-lg bg-gov-blue text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-300 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-slate-500 ml-1 text-xs">GovGuide is searching schemes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions Starter Bar (if few messages) */}
        {messages.length <= 2 && (
          <div className="p-3 bg-white border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Common Questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {t.quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 text-left font-medium transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-gov-blue focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-gov-blue hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-xl font-semibold shadow-xs transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-center text-slate-400 mt-2">
            GovGuide AI provides advisory info. Always verify on official ministry portals before applying.
          </div>
        </div>
      </div>
    </div>
  );
}
