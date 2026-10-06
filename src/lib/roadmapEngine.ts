import { LearningModule, UserProfile, WeeklyProgressReport } from '@/types';

export function calculateModuleLockStatus(
  modules: LearningModule[],
  completedTaskIds: string[]
): Record<string, { isUnlocked: boolean; completionRate: number; completedCount: number; totalCount: number }> {
  const result: Record<string, { isUnlocked: boolean; completionRate: number; completedCount: number; totalCount: number }> = {};

  modules.forEach((mod) => {
    const totalCount = mod.tasks.length;
    const completedCount = mod.tasks.filter((t) => completedTaskIds.includes(t.id)).length;
    const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    let isUnlocked = false;
    if (!mod.prerequisiteModuleId) {
      // First module has no prerequisite
      isUnlocked = true;
    } else {
      // Prerequisite module must be 100% completed
      const prereqMod = modules.find((m) => m.id === mod.prerequisiteModuleId);
      if (prereqMod) {
        const prereqCompleted = prereqMod.tasks.every((t) => completedTaskIds.includes(t.id));
        isUnlocked = prereqCompleted;
      }
    }

    result[mod.id] = {
      isUnlocked,
      completionRate,
      completedCount,
      totalCount,
    };
  });

  return result;
}

export function generateWeeklyReport(user: UserProfile, modules: LearningModule[]): WeeklyProgressReport {
  const totalTasks = modules.flatMap(m => m.tasks);
  const completedCount = user.completedTaskIds.length;
  const minutesLearned = user.weeklyCompletedMinutes;

  let paceRecommendation: 'maintain' | 'level-up' | 'reinforce' = 'maintain';
  let aiCoachSummary = '';

  if (completedCount >= 3 && user.streakCount >= 4) {
    paceRecommendation = 'level-up';
    aiCoachSummary = `Outstanding velocity! You have maintained a ${user.streakCount}-day streak and finished ${completedCount} micro-tasks with zero burnout. Pathfinder AI is adjusting your upcoming challenges to introduce AI-native API patterns.`;
  } else if (user.weeklyCompletedMinutes < 60 && user.streakCount < 2) {
    paceRecommendation = 'reinforce';
    aiCoachSummary = `You are getting started! To avoid tutorial overwhelm, we recommend breaking your sessions into strict 15-minute intervals with Tier 2 conceptual analogies.`;
  } else {
    paceRecommendation = 'maintain';
    aiCoachSummary = `Steady consistency! You logged ${minutesLearned} minutes this week. Consistency beats intensity every single time. Keep your 30-minute rhythm going!`;
  }

  // Find next uncompleted task
  const nextTask = totalTasks.find(t => !user.completedTaskIds.includes(t.id)) || totalTasks[0];

  return {
    weekNumber: 1,
    tasksCompleted: completedCount,
    minutesLearned,
    xpGained: user.masteryPoints,
    streakStatus: user.streakCount >= 5 ? 'flaming' : 'maintained',
    paceRecommendation,
    suggestedNextMicroTask: nextTask.title,
    aiCoachSummary,
  };
}
