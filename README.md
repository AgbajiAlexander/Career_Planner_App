# Pathfinder AI: Career Planning & AI-Native Learning Platform

> **From Zero Coding Knowledge to AI-Native Full-Stack Proficiency**  
> Built strictly adhering to the product requirements and HARD goals defined in [`PRD.md`](./PRD.md).

---

## 🌟 Overview & Philosophy

Traditional coding bootcamps and video tutorials suffer from high drop-out rates due to passive video watching, massive cognitive overload, and isolation. **Pathfinder AI** replaces that with:
1. **Learning by Doing:** Hands-on browser sandbox with live test validation and instant feedback.
2. **Focused Instruction (Micro-Tasks):** Every concept is chunked into an accessible, non-intimidating 20–30 minute micro-task with real-world analogies.
3. **Socratic AI Coding Mentor ("Ada"):** Never just outputs answers. Guides learners through a 3-tier progressive hint system (Guiding Question $\rightarrow$ Real-world Analogy $\rightarrow$ Syntax Scaffold).
4. **Community Squads:** Automated peer grouping (Squad Nebula-9), weekly check-in reflections, shared milestone celebrations, and combined streak tracking.

---

## 🚀 Key Features

### 1. Interactive Dynamic Roadmap (PRD 4.1)
- **Node-based progression map:** Modules unlock sequentially as learners achieve 100% mastery of prerequisites.
- **Micro-Task Schema (HARD Goal 1):** Standardized metadata (`id`, `estimatedMinutes`, `concept`, `analogy`, `challenge`, `starterCode`, `testCases`, `socraticHints`, `xpReward`).
- **Dynamic Difficulty Calibration:** Adapts roadmap velocity between *Reinforce* (15m + deeper analogies), *Steady* (recommended 30m), and *Level-Up* (accelerated pace) based on weekly performance.

### 2. Socratic AI Coding Mentor (PRD 4.2 & HARD Goal 2)
- **Zero-Spoiler Guarantee:** Configured with strict pedagogical guardrails.
- **3-Tier Socratic System:**
  - **Tier 1 (Guiding Question):** Identifies the logic section to inspect without giving syntax.
  - **Tier 2 (Mental Model / Analogy):** Explains the concept using everyday analogies (e.g. labeled cardboard boxes, restaurant receipts).
  - **Tier 3 (Syntax Scaffold):** Provides fill-in-the-blank code templates.
- **Multi-Provider Architecture:**
  - Supports **Google Gemini (1.5 Flash)** and **OpenAI (GPT-4o / GPT-4o-mini)**.
  - Features an **Intelligent Local Socratic Fallback Engine** allowing full functionality out of the box with zero external API keys needed!

### 3. Gamification & Progress Tracking (PRD 4.3)
- Daily learning streak counters (`🔥 4-day streak`).
- Mastery Points (XP) and Level progression.
- Automated Weekly Review modal synthesizing accomplishments and next recommendations.

### 4. Community-Driven Squads (PRD 4.4)
- Cohort view for **Squad Nebula-9** (peers matched by velocity).
- Combined squad streak and collective XP leaderboard.
- Live weekly check-in feed with milestone badges and peer cheering.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti
- **Execution Sandbox:** Isolated browser runtime with custom `console.log` interceptor and test assertion runner
- **AI Orchestration:** Multi-provider API route (`/api/mentor/chat`) supporting Google Gemini, OpenAI, and smart local Socratic heuristic engine

---

## 💻 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. (Optional) Configure AI Mentor Keys
Click the **Settings** icon (top right) inside the application:
- You can immediately use the built-in **Smart Offline Socratic Engine** (no key required).
- Or enter your **Google Gemini API Key** or **OpenAI API Key** to enable live LLM generation.
