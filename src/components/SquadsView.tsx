'use client';

import React, { useState } from 'react';
import { Squad, SquadCheckIn, UserProfile } from '@/types';
import {
  Users,
  Flame,
  Trophy,
  MessageSquare,
  Sparkles,
  Send,
  Heart,
  PlusCircle,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';

interface SquadsViewProps {
  squad: Squad;
  user: UserProfile;
  onPostCheckIn: (checkIn: Omit<SquadCheckIn, 'id' | 'timestamp' | 'reactions'>) => void;
}

export const SquadsView: React.FC<SquadsViewProps> = ({
  squad,
  user,
  onPostCheckIn,
}) => {
  const [headline, setHeadline] = useState('');
  const [reflection, setReflection] = useState('');
  const [blocker, setBlocker] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [encouragedMembers, setEncouragedMembers] = useState<Record<string, boolean>>({});

  const handleSendEncouragement = (memberId: string) => {
    setEncouragedMembers((prev) => ({ ...prev, [memberId]: true }));
    setTimeout(() => {
      setEncouragedMembers((prev) => ({ ...prev, [memberId]: false }));
    }, 2500);
  };

  const handleSubmitCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !reflection.trim()) return;

    onPostCheckIn({
      authorName: user.name,
      authorAvatar: user.avatar,
      headline: headline.trim(),
      reflection: reflection.trim(),
      milestonesHit: [`${user.streakCount}-day streak preserved`, 'Active in Micro-Tasks'],
      blocker: blocker.trim() || undefined,
    });

    setHeadline('');
    setReflection('');
    setBlocker('');
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Squad Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-3xl shadow-xl shadow-indigo-500/20 shrink-0">
              {squad.badge}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Peer Accountability Squad
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/25">
                  {squad.pace.toUpperCase()} PACE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{squad.name}</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">{squad.description}</p>
            </div>
          </div>

          {/* Squad Combined Stats */}
          <div className="flex items-center gap-4 sm:gap-6 bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl shrink-0">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Combined Streak</div>
              <div className="text-xl font-black text-amber-400 flex items-center gap-1.5 mt-0.5">
                <Flame className="w-5 h-5 fill-amber-400" />
                <span>{squad.combinedStreak} Days</span>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-800" />

            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Squad XP</div>
              <div className="text-xl font-black text-violet-400 flex items-center gap-1.5 mt-0.5">
                <Trophy className="w-5 h-5" />
                <span>{squad.totalXp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Squad Members & Weekly Check-Ins */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Squad Members Roster (col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Squad Cohort ({squad.members.length} Members)</span>
            </h2>
            <span className="text-xs text-slate-500">Matched by pace & start date</span>
          </div>

          <div className="space-y-3">
            {squad.members.map((member) => (
              <div
                key={member.id}
                className={`p-4 rounded-2xl border transition-all ${
                  member.isCurrentUser
                    ? 'border-sky-500/40 bg-sky-950/20 ring-1 ring-sky-500/20'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {member.name}
                        {member.isCurrentUser && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400">
                            You
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {member.currentTaskTitle}
                      </p>
                    </div>
                  </div>

                  {/* Streak & XP */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1 justify-end">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      {member.streak}d
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">
                      {member.xp} XP
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <p className="text-xs text-slate-400 italic">"{member.statusMessage}"</p>

                  {!member.isCurrentUser && (
                    <button
                      onClick={() => handleSendEncouragement(member.id)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                        encouragedMembers[member.id]
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{encouragedMembers[member.id] ? 'Kudos Sent! 🔥' : 'Cheer'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Weekly Check-in Feed (col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Weekly Check-In Feed</span>
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-xs font-semibold px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Check-In</span>
            </button>
          </div>

          {/* New Check-In Form (Collapsible) */}
          {showForm && (
            <form
              onSubmit={handleSubmitCheckIn}
              className="p-5 rounded-2xl bg-slate-900 border border-sky-500/30 shadow-xl space-y-3.5 animate-fadeIn"
            >
              <h3 className="text-sm font-bold text-white">Share Your Weekly Check-In</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Mastered loops and finished Module 1! 🚀"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Reflection (What clicked? How did the Socratic mentor help?)
                </label>
                <textarea
                  required
                  rows={3}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Share your breakthrough or learning takeaway..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Any Blocker or Question for the Squad? (Optional)
                </label>
                <input
                  type="text"
                  value={blocker}
                  onChange={(e) => setBlocker(e.target.value)}
                  placeholder="e.g. Still practicing nested conditionals"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Squad</span>
                </button>
              </div>
            </form>
          )}

          {/* Check-ins list */}
          <div className="space-y-4">
            {squad.checkIns.map((ci) => (
              <div
                key={ci.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ci.authorAvatar}
                      alt={ci.authorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{ci.authorName}</h4>
                      <span className="text-[10px] text-slate-500">{ci.timestamp}</span>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Weekly Check-in
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{ci.headline}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{ci.reflection}</p>
                </div>

                {ci.blocker && (
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30 text-xs text-amber-300">
                    <strong>Blocker noted:</strong> {ci.blocker}
                  </div>
                )}

                {/* Milestones hit */}
                {ci.milestonesHit && ci.milestonesHit.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {ci.milestonesHit.map((m, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20"
                      >
                        ✓ {m}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reactions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  {ci.reactions.map((r, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-slate-300 flex items-center gap-1"
                    >
                      <span>{r.emoji}</span>
                      <span className="font-semibold">{r.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
