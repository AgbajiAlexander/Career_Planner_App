'use client';

import React from 'react';
import { X, Flame, Trophy, Clock, Target, Sparkles, TrendingUp, Compass, ArrowRight } from 'lucide-react';
import { WeeklyProgressReport } from '@/types';

interface WeeklyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: WeeklyProgressReport;
  onApplyPace: (pace: 'relaxed' | 'steady' | 'accelerated') => void;
  currentPace: 'relaxed' | 'steady' | 'accelerated';
}

export const WeeklyReviewModal: React.FC<WeeklyReviewModalProps> = ({
  isOpen,
  onClose,
  report,
  onApplyPace,
  currentPace,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-sky-950/50 via-slate-900 to-indigo-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Weekly Adaptive Review</h3>
              <p className="text-xs text-slate-400">Week 1 Summary & Dynamic Difficulty Calibration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
              <Target className="w-4 h-4 text-sky-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-white">{report.tasksCompleted}</div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Tasks Done</div>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
              <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-white">{report.minutesLearned}m</div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Time Invested</div>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
              <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1 fill-amber-400" />
              <div className="text-xl font-bold text-white">{report.streakStatus === 'flaming' ? '🔥 High' : 'Solid'}</div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Streak Status</div>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-center">
              <Trophy className="w-4 h-4 text-violet-400 mx-auto mb-1" />
              <div className="text-xl font-bold text-white">+{report.xpGained}</div>
              <div className="text-[10px] uppercase font-semibold text-slate-400">Mastery XP</div>
            </div>
          </div>

          {/* AI Coach Adaptive Summary */}
          <div className="p-4 rounded-xl bg-sky-950/30 border border-sky-800/40 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ada\'s Adaptive Coaching Analysis</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {report.aiCoachSummary}
            </p>
          </div>

          {/* Roadmap Difficulty Calibration */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Upcoming Week Roadmap Pacing
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => onApplyPace('relaxed')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentPace === 'relaxed'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-white mb-0.5">Reinforce (Relaxed)</div>
                <div className="text-[10px] text-slate-400">15m tasks + deep analogies</div>
              </button>

              <button
                type="button"
                onClick={() => onApplyPace('steady')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentPace === 'steady'
                    ? 'border-sky-500 bg-sky-500/10 text-sky-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-white mb-0.5">Steady (Recommended)</div>
                <div className="text-[10px] text-slate-400">30m micro-tasks daily</div>
              </button>

              <button
                type="button"
                onClick={() => onApplyPace('accelerated')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  currentPace === 'accelerated'
                    ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-white mb-0.5">Level-Up (Accelerated)</div>
                <div className="text-[10px] text-slate-400">Fast-track to AI capstone</div>
              </button>
            </div>
          </div>

          {/* Recommended Next Task */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block">Recommended Next Step</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Compass className="w-4 h-4 text-sky-400" />
                {report.suggestedNextMicroTask}
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
