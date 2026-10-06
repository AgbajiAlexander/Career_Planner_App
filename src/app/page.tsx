'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { RoadmapView } from '@/components/RoadmapView';
import { WorkspaceView } from '@/components/WorkspaceView';
import { SquadsView } from '@/components/SquadsView';
import { WeeklyReviewModal } from '@/components/WeeklyReviewModal';
import { SettingsModal } from '@/components/SettingsModal';
import { INITIAL_MODULES } from '@/data/curriculum';
import { INITIAL_USER_PROFILE, INITIAL_SQUAD } from '@/data/mockData';
import { LearningModule, MicroTask, UserProfile, Squad, SquadCheckIn } from '@/types';
import { generateWeeklyReport } from '@/lib/roadmapEngine';

export default function Home() {
  const [modules, setModules] = useState<LearningModule[]>(INITIAL_MODULES);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [squad, setSquad] = useState<Squad>(INITIAL_SQUAD);
  const [currentTab, setCurrentTab] = useState<'roadmap' | 'workspace' | 'squads'>('roadmap');

  // Active micro-task
  const [currentTask, setCurrentTask] = useState<MicroTask>(() => {
    const flat = INITIAL_MODULES.flatMap((m) => m.tasks);
    return flat.find((t) => t.id === INITIAL_USER_PROFILE.activeTaskId) || flat[0];
  });

  // Modals state
  const [isWeeklyReviewOpen, setIsWeeklyReviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // AI Configuration State
  const [apiKey, setApiKey] = useState<string>('');
  const [provider, setProvider] = useState<'auto' | 'gemini' | 'openai'>('auto');

  // Load local preferences from browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('pathfinder_api_key');
      const savedProvider = localStorage.getItem('pathfinder_provider') as any;
      const savedUser = localStorage.getItem('pathfinder_user_profile');

      if (savedKey) setApiKey(savedKey);
      if (savedProvider) setProvider(savedProvider);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.warn('Failed parsing saved user', e);
        }
      }
    }
  }, []);

  // Save user profile changes
  const updateUserData = (updater: (prev: UserProfile) => UserProfile) => {
    setUser((prev) => {
      const updated = updater(prev);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pathfinder_user_profile', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSelectTask = (task: MicroTask) => {
    setCurrentTask(task);
    updateUserData((prev) => ({
      ...prev,
      activeTaskId: task.id,
    }));
    setCurrentTab('workspace');
  };

  const handleCompleteTask = (taskId: string, xpEarned: number) => {
    updateUserData((prev) => {
      const alreadyDone = prev.completedTaskIds.includes(taskId);
      const newCompleted = alreadyDone ? prev.completedTaskIds : [...prev.completedTaskIds, taskId];
      const newXp = alreadyDone ? prev.masteryPoints : prev.masteryPoints + xpEarned;
      const newMinutes = prev.weeklyCompletedMinutes + currentTask.estimatedMinutes;
      const newLevel = Math.floor(newXp / 300) + 1;

      return {
        ...prev,
        completedTaskIds: newCompleted,
        masteryPoints: newXp,
        weeklyCompletedMinutes: newMinutes,
        level: newLevel,
      };
    });

    // Also update current squad XP
    setSquad((prev) => ({
      ...prev,
      totalXp: prev.totalXp + xpEarned,
      members: prev.members.map((m) =>
        m.isCurrentUser ? { ...m, xp: m.xp + xpEarned } : m
      ),
    }));
  };

  const handleNextTask = () => {
    const allTasks = modules.flatMap((m) => m.tasks);
    const currentIndex = allTasks.findIndex((t) => t.id === currentTask.id);
    if (currentIndex >= 0 && currentIndex < allTasks.length - 1) {
      const next = allTasks[currentIndex + 1];
      handleSelectTask(next);
    } else {
      setCurrentTab('roadmap');
    }
  };

  const handlePostCheckIn = (
    checkInData: Omit<SquadCheckIn, 'id' | 'timestamp' | 'reactions'>
  ) => {
    const newCheckIn: SquadCheckIn = {
      ...checkInData,
      id: `ci-${Date.now()}`,
      timestamp: 'Just now',
      reactions: [{ emoji: '🔥', count: 1, users: ['You'] }],
    };

    setSquad((prev) => ({
      ...prev,
      checkIns: [newCheckIn, ...prev.checkIns],
    }));

    updateUserData((prev) => ({
      ...prev,
      weeklyCheckInCompleted: true,
      masteryPoints: prev.masteryPoints + 50, // XP bonus for accountability check-in!
    }));
  };

  const handleApplyPace = (pace: 'relaxed' | 'steady' | 'accelerated') => {
    updateUserData((prev) => ({
      ...prev,
      pacePreference: pace,
    }));
    setSquad((prev) => ({
      ...prev,
      pace,
    }));
  };

  const weeklyReport = generateWeeklyReport(user, modules);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Global Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onOpenWeeklyReview={() => setIsWeeklyReviewOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeProvider={provider}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'roadmap' && (
          <RoadmapView
            modules={modules}
            user={user}
            onSelectTask={handleSelectTask}
            onOpenWeeklyReview={() => setIsWeeklyReviewOpen(true)}
          />
        )}

        {currentTab === 'workspace' && (
          <WorkspaceView
            task={currentTask}
            user={user}
            onCompleteTask={handleCompleteTask}
            onNextTask={handleNextTask}
            onBackToRoadmap={() => setCurrentTab('roadmap')}
            apiKey={apiKey}
            provider={provider}
          />
        )}

        {currentTab === 'squads' && (
          <SquadsView
            squad={squad}
            user={user}
            onPostCheckIn={handlePostCheckIn}
          />
        )}
      </main>

      {/* Weekly Review Modal */}
      <WeeklyReviewModal
        isOpen={isWeeklyReviewOpen}
        onClose={() => setIsWeeklyReviewOpen(false)}
        report={weeklyReport}
        onApplyPace={handleApplyPace}
        currentPace={user.pacePreference}
      />

      {/* Settings & API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        provider={provider}
        setProvider={setProvider}
      />
    </div>
  );
}
