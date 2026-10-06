export type Language = 'javascript' | 'html' | 'css' | 'python';

export type TaskDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type ModuleCategory = 
  | 'foundations'
  | 'frontend'
  | 'ai-engineering'
  | 'fullstack-api'
  | 'capstone';

export interface ConceptGuide {
  title: string;
  explanation: string;
  realWorldAnalogy: string;
  keyTakeaways: string[];
}

export interface TestCase {
  id: string;
  description: string;
  expectedOutputSubstring?: string;
  codeContains?: string;
  codeNotContains?: string;
  validatorType?: 'output_match' | 'regex_check' | 'js_eval';
}

export interface SocraticHintTiers {
  tier1GuidingQuestion: string; // Guiding thought or question (no syntax)
  tier2AnalogyExample: string;  // Plain English conceptual analogy or example
  tier3SyntaxTemplate: string;  // Scaffolded syntax with blanks
}

export interface MicroTask {
  id: string;
  slug: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number; // usually 20-30 mins per PRD philosophy
  difficulty: TaskDifficulty;
  xpReward: number;
  language: Language;
  concept: ConceptGuide;
  challenge: {
    prompt: string;
    targetGoal: string;
    instructions: string[];
  };
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  socraticHints: SocraticHintTiers;
}

export interface LearningModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: ModuleCategory;
  order: number;
  icon: string;
  prerequisiteModuleId?: string;
  estimatedHours: number;
  tasks: MicroTask[];
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  streakCount: number;
  bestStreak: number;
  lastActiveDate: string;
  masteryPoints: number; // XP
  level: number;
  completedTaskIds: string[];
  activeTaskId: string;
  squadId: string;
  weeklyGoalHours: number;
  weeklyCompletedMinutes: number;
  pacePreference: 'relaxed' | 'steady' | 'accelerated';
  weeklyCheckInCompleted: boolean;
}

export interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  currentTaskTitle: string;
  xp: number;
  statusMessage: string;
  isCurrentUser?: boolean;
}

export interface SquadCheckIn {
  id: string;
  authorName: string;
  authorAvatar: string;
  timestamp: string;
  headline: string;
  reflection: string;
  milestonesHit: string[];
  blocker?: string;
  reactions: { emoji: string; count: number; users: string[] }[];
}

export interface Squad {
  id: string;
  name: string;
  badge: string;
  description: string;
  pace: 'relaxed' | 'steady' | 'accelerated';
  members: SquadMember[];
  checkIns: SquadCheckIn[];
  totalXp: number;
  combinedStreak: number;
}

export interface MentorChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  hintTier?: 1 | 2 | 3;
  suggestedAction?: string;
  codeSnippet?: string;
}

export interface WeeklyProgressReport {
  weekNumber: number;
  tasksCompleted: number;
  minutesLearned: number;
  xpGained: number;
  streakStatus: 'flaming' | 'maintained' | 'at-risk';
  paceRecommendation: 'maintain' | 'level-up' | 'reinforce';
  suggestedNextMicroTask: string;
  aiCoachSummary: string;
}
