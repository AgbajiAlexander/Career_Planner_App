'use client';

import React, { useState } from 'react';
import { X, Key, Cpu, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  provider: 'auto' | 'gemini' | 'openai';
  setProvider: (p: 'auto' | 'gemini' | 'openai') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  provider,
  setProvider,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempProvider, setTempProvider] = useState(provider);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey);
    setProvider(tempProvider);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pathfinder_api_key', tempKey);
      localStorage.setItem('pathfinder_provider', tempProvider);
    }
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">AI Mentor Configuration</h3>
              <p className="text-xs text-slate-400">Configure AI provider and Socratic settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select AI Engine
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setTempProvider('auto')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tempProvider === 'auto'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-white mb-0.5">Smart Offline</div>
                <div className="text-[10px] text-slate-400">Zero-key fallback</div>
              </button>

              <button
                type="button"
                onClick={() => setTempProvider('gemini')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tempProvider === 'gemini'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-white mb-0.5">Google Gemini</div>
                <div className="text-[10px] text-slate-400">Gemini 1.5 Flash</div>
              </button>

              <button
                type="button"
                onClick={() => setTempProvider('openai')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tempProvider === 'openai'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-white mb-0.5">OpenAI</div>
                <div className="text-[10px] text-slate-400">GPT-4o Mini</div>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                API Key (Optional)
              </label>
              <span className="text-[11px] text-slate-400">Stored locally in your browser</span>
            </div>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder={
                tempProvider === 'gemini'
                  ? 'AIzaSy...'
                  : tempProvider === 'openai'
                  ? 'sk-proj-...'
                  : 'Leave blank to use built-in Socratic mentor'
              }
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Socratic Philosophy Notice */}
          <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
            <div className="text-xs text-violet-200 leading-relaxed">
              <strong>Socratic AI Guardrails Active:</strong> Ada is strictly configured to never give away the code outright. She asks guiding questions and provides conceptual analogies first.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Ready for use</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors shadow-lg shadow-sky-500/20"
            >
              {savedNotice ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
