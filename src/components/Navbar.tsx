'use client';

import React from 'react';
import { UserProfile } from '@/types';
import { Sparkles, Flame, Trophy, Compass, Code, Users, BarChart3, Settings, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentTab: 'roadmap' | 'workspace' | 'squads';
  setCurrentTab: (tab: 'roadmap' | 'workspace' | 'squads') => void;
  user: UserProfile;
  onOpenWeeklyReview: () => void;
  onOpenSettings: () => void;
  activeProvider: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenWeeklyReview,
  onOpenSettings,
  activeProvider,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
                Pathfinder AI
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                AI-Native
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Zero to AI Full Stack Engineer</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCurrentTab('roadmap')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'roadmap'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Roadmap</span>
          </button>

          <button
            onClick={() => setCurrentTab('workspace')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'workspace'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Workspace</span>
          </button>

          <button
            onClick={() => setCurrentTab('squads')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentTab === 'squads'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Squad Nebula</span>
          </button>

          <button
            onClick={onOpenWeeklyReview}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all"
            title="Weekly Progress & Adaptive Summary"
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Review</span>
          </button>
        </nav>

        {/* User Stats & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/25 rounded-full text-amber-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{user.streakCount} Day Streak</span>
          </div>

          {/* Mastery Points */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 border border-violet-500/25 rounded-full text-violet-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-violet-400" />
            <span>{user.masteryPoints} XP</span>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800 transition-colors"
            title="AI Mentor Settings & API Keys"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full ring-2 ring-sky-500/40 object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
};
