'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MicroTask, UserProfile, MentorChatMessage } from '@/types';
import { runJavaScriptSandbox, CodeRunResult } from '@/lib/codeRunner';
import confetti from 'canvas-confetti';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Send,
  Lightbulb,
  BookOpen,
  Terminal,
  ArrowRight,
  Flame,
  Trophy,
  Check,
  Compass,
  Cpu,
} from 'lucide-react';

interface WorkspaceViewProps {
  task: MicroTask;
  user: UserProfile;
  onCompleteTask: (taskId: string, xpEarned: number) => void;
  onNextTask: () => void;
  onBackToRoadmap: () => void;
  apiKey: string;
  provider: 'auto' | 'gemini' | 'openai';
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  task,
  user,
  onCompleteTask,
  onNextTask,
  onBackToRoadmap,
  apiKey,
  provider,
}) => {
  const [code, setCode] = useState<string>(task.starterCode);
  const [activeTab, setActiveTab] = useState<'concept' | 'challenge'>('concept');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<CodeRunResult | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(user.completedTaskIds.includes(task.id));

  // Mentor Chat State
  const [chatMessages, setChatMessages] = useState<MentorChatMessage[]>([
    {
      id: 'm-init',
      sender: 'mentor',
      text: `Hi ${user.name}! I'm Ada, your Socratic AI mentor for **${task.title}**. Whenever you get stuck, ask me anything or use the hint buttons below. Remember: I won't just dump answers—we learn by doing! 🚀`,
      timestamp: 'Just now',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Sync code when task changes
  useEffect(() => {
    setCode(task.starterCode);
    setRunResult(null);
    setIsCompleted(user.completedTaskIds.includes(task.id));
    setActiveTab('concept');
    setChatMessages([
      {
        id: `m-init-${task.id}`,
        sender: 'mentor',
        text: `Welcome to **${task.title}**! Take a look at the concept and analogy on the left, then try the challenge in your editor. How can I guide you today?`,
        timestamp: 'Just now',
      },
    ]);
  }, [task.id, user.completedTaskIds]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAiLoading]);

  const handleResetCode = () => {
    setCode(task.starterCode);
    setRunResult(null);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    const result = runJavaScriptSandbox(code, task.testCases);
    setRunResult(result);
    setIsRunning(false);

    if (result.allTestsPassed) {
      setIsCompleted(true);
      onCompleteTask(task.id, task.xpReward);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
      // Mentor congratulatory message
      setChatMessages((prev) => [
        ...prev,
        {
          id: `congrats-${Date.now()}`,
          sender: 'mentor',
          text: `🎉 Phenomenal work! All validation criteria passed for **${task.title}**. You earned +${task.xpReward} Mastery XP and reinforced your foundation. Ready for the next micro-task?`,
          timestamp: 'Just now',
          suggestedAction: 'Click Next Micro-Task to advance',
        },
      ]);
    }
  };

  const handleSendMentorPrompt = async (customPrompt?: string, tier?: 1 | 2 | 3) => {
    const questionText = customPrompt || inputQuestion.trim();
    if (!questionText && !tier) return;

    const userMsgText = questionText || (tier === 1 ? 'Give me a guiding hint (Tier 1)' : tier === 2 ? 'Explain with an analogy (Tier 2)' : 'Show structural scaffold (Tier 3)');

    const newUserMsg: MentorChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: 'Just now',
      hintTier: tier,
    };

    setChatMessages((prev) => [...prev, newUserMsg]);
    setInputQuestion('');
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          userCode: code,
          terminalOutput: runResult ? runResult.logs.concat(runResult.errors).join('\n') : '',
          chatHistory: chatMessages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
          userQuestion: userMsgText,
          hintLevel: tier || 1,
          apiKey: apiKey || undefined,
          provider: provider === 'auto' ? undefined : provider,
        }),
      });

      const data = await response.json();
      if (data.success && data.message) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}`,
            sender: 'mentor',
            text: data.message,
            timestamp: 'Just now',
            suggestedAction: data.suggestedAction,
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to get mentor response');
      }
    } catch (err) {
      console.error('Mentor chat error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `m-err-${Date.now()}`,
          sender: 'mentor',
          text: `I ran into a temporary hiccup, but here is a direct guiding question for this task:\n\n💭 **${task.socraticHints.tier1GuidingQuestion}**`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-950 overflow-hidden">
      {/* Workspace Header */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToRoadmap}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Roadmap</span>
          </button>
          <span className="text-slate-700">/</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
              {task.title}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 hidden sm:inline">
              ~{task.estimatedMinutes} mins
            </span>
            {isCompleted && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Check className="w-3 h-3" /> Done
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleResetCode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset to starter code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg transition-all shadow-md ${
              isCompleted
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/20'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Running...' : isCompleted ? 'Test Again' : 'Run Code'}</span>
          </button>

          {isCompleted && (
            <button
              onClick={onNextTask}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-all shadow-md shadow-violet-600/20 animate-pulse"
            >
              <span>Next Task</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main 3-Column Split Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Concept & Instructions (col-span-3) */}
        <div className="lg:col-span-3 border-r border-slate-800 bg-slate-900/60 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/40">
            <button
              onClick={() => setActiveTab('concept')}
              className={`flex-1 py-3 text-xs font-semibold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'concept'
                  ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Concept & Analogy</span>
            </button>
            <button
              onClick={() => setActiveTab('challenge')}
              className={`flex-1 py-3 text-xs font-semibold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'challenge'
                  ? 'border-sky-500 text-sky-400 bg-sky-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Micro-Challenge</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 text-sm">
            {activeTab === 'concept' ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">{task.concept.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{task.concept.explanation}</p>
                </div>

                {/* Real-world Metaphor */}
                <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/40">
                  <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Real-World Mental Model</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {task.concept.realWorldAnalogy}
                  </p>
                </div>

                {/* Key Takeaways */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Key Principles:
                  </h4>
                  <ul className="space-y-2">
                    {task.concept.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">Challenge Instructions</h3>
                  <p className="text-xs text-slate-400">{task.challenge.prompt}</p>
                </div>

                <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-800/30 text-xs text-violet-300">
                  <strong>Target Goal:</strong> {task.challenge.targetGoal}
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Checklist:
                  </h4>
                  <div className="space-y-2.5">
                    {task.challenge.instructions.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test criteria */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Validation Criteria:
                  </h4>
                  <div className="space-y-1.5">
                    {task.testCases.map((tc) => (
                      <div key={tc.id} className="text-xs text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        <span>{tc.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Middle Column: Code Editor & Terminal (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col border-r border-slate-800 bg-slate-950 overflow-hidden">
          {/* Code Editor Window */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">solution.js</span>
              <span>JavaScript (ES6+)</span>
            </div>

            <div className="flex-1 relative overflow-hidden font-mono text-xs">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full p-4 bg-slate-950 text-slate-100 font-mono resize-none focus:outline-none leading-relaxed selection:bg-sky-500/30 selection:text-white"
                placeholder="// Type your code here..."
              />
            </div>
          </div>

          {/* Terminal / Live Console output */}
          <div className="h-48 border-t border-slate-800 bg-slate-900/90 flex flex-col overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>Console & Test Verification</span>
              </div>
              {runResult && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    runResult.allTestsPassed
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/25'
                  }`}
                >
                  {runResult.allTestsPassed ? 'All Tests Passed ✓' : 'Validation Failed'}
                </span>
              )}
            </div>

            <div className="flex-1 p-3.5 overflow-y-auto font-mono text-xs space-y-2">
              {!runResult ? (
                <div className="text-slate-600 italic">
                  Press "Run Code" above to execute your solution in the browser sandbox.
                </div>
              ) : (
                <>
                  {/* Console logs */}
                  {runResult.logs.length > 0 && (
                    <div className="space-y-1">
                      {runResult.logs.map((log, i) => (
                        <div key={i} className="text-sky-300 flex items-start gap-1.5">
                          <span className="text-slate-600 select-none">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Errors */}
                  {runResult.errors.length > 0 && (
                    <div className="space-y-1">
                      {runResult.errors.map((err, i) => (
                        <div key={i} className="text-rose-400 flex items-start gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{err}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Test case breakdown */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    {runResult.testResults.map((tr) => (
                      <div
                        key={tr.id}
                        className={`text-[11px] flex items-center gap-1.5 ${
                          tr.passed ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {tr.passed ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-3 h-3 text-amber-400 shrink-0" />
                        )}
                        <span>{tr.description}: {tr.reason}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Socratic AI Coding Mentor (Ada) (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col bg-slate-900/95 overflow-hidden">
          {/* Mentor Top Bar */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-violet-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Ada (Socratic AI Mentor)
                </h4>
                <p className="text-[10px] text-slate-400">Never gives answers away • Teaches by asking</p>
              </div>
            </div>

            <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              {provider === 'auto' ? 'Offline Socratic' : provider === 'gemini' ? 'Gemini 1.5' : 'OpenAI'}
            </span>
          </div>

          {/* Socratic Hint Quick Actions (3-Tier Hint Buttons) */}
          <div className="p-2.5 border-b border-slate-800 bg-slate-950/20">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
              Socratic Progressive Hints:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleSendMentorPrompt(undefined, 1)}
                disabled={isAiLoading}
                className="px-2 py-1.5 text-[11px] font-medium bg-slate-800/80 hover:bg-sky-500/20 text-slate-200 hover:text-sky-300 rounded-lg border border-slate-700/60 transition-colors text-center"
                title="Level 1: Guiding thought without syntax"
              >
                1: Guiding Q
              </button>
              <button
                onClick={() => handleSendMentorPrompt(undefined, 2)}
                disabled={isAiLoading}
                className="px-2 py-1.5 text-[11px] font-medium bg-slate-800/80 hover:bg-violet-500/20 text-slate-200 hover:text-violet-300 rounded-lg border border-slate-700/60 transition-colors text-center"
                title="Level 2: Real-world analogy"
              >
                2: Analogy
              </button>
              <button
                onClick={() => handleSendMentorPrompt(undefined, 3)}
                disabled={isAiLoading}
                className="px-2 py-1.5 text-[11px] font-medium bg-slate-800/80 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 rounded-lg border border-slate-700/60 transition-colors text-center"
                title="Level 3: Fill-in-the-blank syntax scaffold"
              >
                3: Scaffold
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatScrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed"
          >
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-sky-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/50 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.suggestedAction && (
                    <div className="mt-2 pt-2 border-t border-slate-700/60 text-[11px] font-semibold text-sky-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{msg.suggestedAction}</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isAiLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2 bg-slate-800/40 rounded-xl w-fit">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span>Ada is formulating a Socratic nudge...</span>
              </div>
            )}
          </div>

          {/* Chat Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMentorPrompt();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Ask Ada for guidance or why something failed..."
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim() || isAiLoading}
                className="p-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 rounded-xl transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
