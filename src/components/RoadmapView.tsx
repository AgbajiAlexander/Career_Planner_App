'use client';

import React from 'react';
import { LearningModule, MicroTask, UserProfile } from '@/types';
import { calculateModuleLockStatus } from '@/lib/roadmapEngine';
import {
  Sparkles,
  Lock,
  CheckCircle2,
  PlayCircle,
  Clock,
  Trophy,
  ArrowRight,
  BrainCircuit,
  Layout,
  Rocket,
  Flame,
  Zap,
} from 'lucide-react';

interface RoadmapViewProps {
  modules: LearningModule[];
  user: UserProfile;
  onSelectTask: (task: MicroTask) => void;
  onOpenWeeklyReview: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  modules,
  user,
  onSelectTask,
  onOpenWeeklyReview,
}) => {
  const lockStatuses = calculateModuleLockStatus(modules, user.completedTaskIds);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-sky-400" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-violet-400" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-emerald-400" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-amber-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Adaptive Progression Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              From Zero Coding to AI-Native Engineer
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every concept is condensed into a 30-minute hands-on micro-task with Socratic AI guidance. No 40-hour tutorial paralysis.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Pace</div>
              <div className="text-base font-bold text-white capitalize flex items-center gap-1.5 mt-0.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                {user.pacePreference} Mode
              </div>
            </div>
            <button
              onClick={onOpenWeeklyReview}
              className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 hover:underline"
            >
              <span>Review Weekly Velocity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Module Nodes Timeline */}
      <div className="space-y-8 relative">
        {/* Subtle connecting vertical line */}
        <div className="absolute left-6 sm:left-8 top-12 bottom-12 w-0.5 bg-slate-800 -z-0 hidden md:block" />

        {modules.map((mod, modIndex) => {
          const status = lockStatuses[mod.id] || { isUnlocked: true, completionRate: 0, completedCount: 0, totalCount: mod.tasks.length };
          const isComplete = status.completionRate === 100;
          const isUnlocked = status.isUnlocked;

          return (
            <div
              key={mod.id}
              className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                !isUnlocked
                  ? 'border-slate-800/50 bg-slate-950/40 opacity-70'
                  : isComplete
                  ? 'border-emerald-500/30 bg-slate-900/90 shadow-lg shadow-emerald-950/20'
                  : 'border-slate-800 bg-slate-900/95 shadow-xl shadow-slate-950/40'
              }`}
            >
              {/* Module Header Bar */}
              <div className="p-5 sm:p-6 border-b border-slate-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/30">
                <div className="flex items-start sm:items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${
                      !isUnlocked
                        ? 'border-slate-800 bg-slate-900 text-slate-600'
                        : isComplete
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : 'border-sky-500/40 bg-sky-500/10 text-sky-400'
                    }`}
                  >
                    {!isUnlocked ? <Lock className="w-5 h-5 text-slate-500" /> : getModuleIcon(mod.icon)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Module 0{modIndex + 1}
                      </span>
                      {isComplete && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Mastered
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Complete Module 0{modIndex} to Unlock
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">{mod.title}</h2>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl">{mod.description}</p>
                  </div>
                </div>

                {/* Progress Mini Bar */}
                <div className="sm:text-right shrink-0">
                  <div className="text-xs font-medium text-slate-400 mb-1.5 flex sm:justify-end items-center gap-2">
                    <span>{status.completedCount} / {status.totalCount} Micro-Tasks</span>
                    <span className="font-bold text-white">{status.completionRate}%</span>
                  </div>
                  <div className="w-full sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-sky-500 to-indigo-500'
                      }`}
                      style={{ width: `${status.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Micro-Task List */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {mod.tasks.map((task) => {
                  const isTaskDone = user.completedTaskIds.includes(task.id);
                  const isTaskActive = user.activeTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`group relative p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        !isUnlocked
                          ? 'border-slate-800/60 bg-slate-950/20 opacity-60 cursor-not-allowed'
                          : isTaskDone
                          ? 'border-emerald-500/25 bg-emerald-950/10 hover:border-emerald-500/40'
                          : isTaskActive
                          ? 'border-sky-500/50 bg-sky-950/20 ring-1 ring-sky-500/30'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div>
                        {/* Task Meta row */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {task.estimatedMinutes}m Micro-Task
                          </span>
                          <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            +{task.xpReward} XP
                          </span>
                        </div>

                        {/* Task Title */}
                        <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Task Description */}
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        {isTaskDone ? (
                          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Mastered</span>
                          </span>
                        ) : !isUnlocked ? (
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Locked</span>
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                            <PlayCircle className="w-4 h-4" />
                            <span>{isTaskActive ? 'Resume Task' : 'Start Task'}</span>
                          </span>
                        )}

                        {isUnlocked && (
                          <button
                            onClick={() => onSelectTask(task)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                              isTaskActive
                                ? 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-md shadow-sky-500/20'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            }`}
                          >
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
