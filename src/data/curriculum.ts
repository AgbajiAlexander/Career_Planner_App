import { LearningModule, MicroTask } from '@/types';

export const INITIAL_MODULES: LearningModule[] = [
  {
    id: 'mod-foundations',
    title: 'Foundations 101: Thinking in Code',
    subtitle: 'From zero to algorithmic problem solver in bite-sized chunks',
    description: 'Master the universal building blocks of modern software: state, variables, decisions, and reusable functions.',
    category: 'foundations',
    order: 1,
    icon: 'Sparkles',
    estimatedHours: 4,
    tasks: [
      {
        id: 'task-101',
        slug: 'variables-storage-box',
        moduleId: 'mod-foundations',
        title: 'Variables: Your First Digital Storage Box',
        description: 'Learn how software remembers information using variables, constants, and data types.',
        order: 1,
        estimatedMinutes: 20,
        difficulty: 'beginner',
        xpReward: 100,
        language: 'javascript',
        concept: {
          title: 'What is a Variable?',
          explanation: 'In programming, a variable is like a labeled cardboard box. You put a label on the box (the variable name), put an item inside (the value), and whenever you need that item, you refer to the label.',
          realWorldAnalogy: 'Think of your phone contacts. You do not dial 10 random numbers from memory every time; you tap "Mom" (the variable name), which points to "+1-555-0199" (the value).',
          keyTakeaways: [
            'Use `const` for values that stay constant (never change).',
            'Use `let` for values that will change later (like a score or timer).',
            '`console.log()` prints whatever is inside its parentheses to the screen.',
          ],
        },
        challenge: {
          prompt: 'Declare your developer identity in code.',
          targetGoal: 'Define two variables: `developerName` and `currentStreak`, then print a friendly welcome message.',
          instructions: [
            '1. Create a `const` named `developerName` and assign it your name (e.g. "Alex").',
            '2. Create a `let` named `currentStreak` and set it to 1.',
            '3. Use `console.log()` to print: "Welcome [developerName]! Day 1 streak started."',
          ],
        },
        starterCode: `// Step 1: Create your developerName variable using const
const developerName = "Alex";

// Step 2: Create your currentStreak variable using let


// Step 3: Print the message using console.log
console.log("Welcome " + developerName + "! Day " + currentStreak + " streak started.");
`,
        solutionCode: `const developerName = "Alex";
let currentStreak = 1;
console.log("Welcome " + developerName + "! Day " + currentStreak + " streak started.");
`,
        testCases: [
          {
            id: 'tc-1',
            description: '`currentStreak` variable is declared with value 1',
            codeContains: 'currentStreak = 1',
          },
          {
            id: 'tc-2',
            description: '`console.log` outputs the streak announcement',
            expectedOutputSubstring: 'streak started',
          },
        ],
        socraticHints: {
          tier1GuidingQuestion: 'Have you declared `let currentStreak = 1;` so JavaScript knows how to track your streak count?',
          tier2AnalogyExample: 'Remember: `let` is like a reusable whiteboard where you write a number that can be erased and updated later.',
          tier3SyntaxTemplate: 'let currentStreak = 1;\nconsole.log("Welcome " + developerName + "! Day " + currentStreak + " streak started.");',
        },
      },
      {
        id: 'task-102',
        slug: 'logic-and-branching',
        moduleId: 'mod-foundations',
        title: 'Logic & Branching: Teaching Computers to Decide',
        description: 'Understand conditional statements (if/else) and how machines make decisions.',
        order: 2,
        estimatedMinutes: 25,
        difficulty: 'beginner',
        xpReward: 120,
        language: 'javascript',
        concept: {
          title: 'Conditionals: The Crossroads of Code',
          explanation: 'Computers do not have gut feelings; they evaluate conditions to True or False (Booleans). If a condition is met, they take Path A; otherwise, they take Path B.',
          realWorldAnalogy: 'A traffic light: IF the light is green, proceed. ELSE IF the light is yellow, slow down. ELSE (it is red), stop.',
          keyTakeaways: [
            '`if (condition) { ... }` runs code only when condition is true.',
            '`else { ... }` provides a fallback when the condition is false.',
            'Comparison operators: `>` (greater than), `<` (less than), `===` (strictly equal).',
          ],
        },
        challenge: {
          prompt: 'Create a Streak Status Checker for Pathfinder learners.',
          targetGoal: 'Check a learner\'s `streakDays`. If streak is 7 or more, output "On Fire 🔥". Otherwise output "Building Momentum 🚀".',
          instructions: [
            '1. Examine `streakDays`.',
            '2. Write an `if` statement checking if `streakDays >= 7`.',
            '3. In the `if` block, print "On Fire 🔥".',
            '4. In the `else` block, print "Building Momentum 🚀".',
          ],
        },
        starterCode: `const streakDays = 7;

// Write your if/else decision logic below:
if (streakDays >= 7) {
  // Output for big streak
  
} else {
  // Output for starting streak
  
}
`,
        solutionCode: `const streakDays = 7;

if (streakDays >= 7) {
  console.log("On Fire 🔥");
} else {
  console.log("Building Momentum 🚀");
}
`,
        testCases: [
          {
            id: 'tc-1',
            description: 'Handles 7+ days condition',
            codeContains: 'streakDays >= 7',
          },
          {
            id: 'tc-2',
            description: 'Outputs correct flame badge string',
            expectedOutputSubstring: 'On Fire',
          },
        ],
        socraticHints: {
          tier1GuidingQuestion: 'What should the computer print between the curly braces `{}` when `streakDays >= 7` is true?',
          tier2AnalogyExample: 'Think of an automatic badge dispenser: when the counter hits 7, it dispenses "On Fire 🔥".',
          tier3SyntaxTemplate: 'if (streakDays >= 7) {\n  console.log("On Fire 🔥");\n} else {\n  console.log("Building Momentum 🚀");\n}',
        },
      },
      {
        id: 'task-103',
        slug: 'functions-reusable-powers',
        moduleId: 'mod-foundations',
        title: 'Functions: Packaging Reusable Superpowers',
        description: 'Package your logic into clean, reusable functions that accept parameters and return answers.',
        order: 3,
        estimatedMinutes: 30,
        difficulty: 'beginner',
        xpReward: 150,
        language: 'javascript',
        concept: {
          title: 'What is a Function?',
          explanation: 'A function is a recipe or machine. You give it ingredients (parameters/arguments), it executes a set of instructions, and it hands back a finished dish (the return value).',
          realWorldAnalogy: 'A coffee machine: you insert beans and water (inputs), press start, and out comes an Espresso (output). You do not manually grind beans every morning.',
          keyTakeaways: [
            'Functions prevent repeating yourself (DRY principle: Don\'t Repeat Yourself).',
            'Parameters are input variables declared in the function definition.',
            'The `return` keyword sends the calculated result back to whoever called the function.',
          ],
        },
        challenge: {
          prompt: 'Build a Mastery XP Calculator function.',
          targetGoal: 'Write a function `calculateMasteryXP(tasksCompleted, bonusMultiplier)` that returns the total XP earned.',
          instructions: [
            '1. Define a function `calculateMasteryXP` taking `tasksCompleted` and `bonusMultiplier`.',
            '2. Each task is worth 50 base XP. Total XP is `tasksCompleted * 50 * bonusMultiplier`.',
            '3. Return the total XP and print the result for 3 tasks with multiplier 2.',
          ],
        },
        starterCode: `function calculateMasteryXP(tasksCompleted, bonusMultiplier) {
  // Multiply tasksCompleted by 50 and by bonusMultiplier
  // Return the result
  
}

// Test your function:
const earnedXP = calculateMasteryXP(3, 2);
console.log("Earned XP: " + earnedXP);
`,
        solutionCode: `function calculateMasteryXP(tasksCompleted, bonusMultiplier) {
  const baseXP = 50;
  return tasksCompleted * baseXP * bonusMultiplier;
}

const earnedXP = calculateMasteryXP(3, 2);
console.log("Earned XP: " + earnedXP);
`,
        testCases: [
          {
            id: 'tc-1',
            description: 'Returns correct calculated XP (3 * 50 * 2 = 300)',
            expectedOutputSubstring: 'Earned XP: 300',
          },
          {
            id: 'tc-2',
            description: 'Function contains a return statement',
            codeContains: 'return',
          },
        ],
        socraticHints: {
          tier1GuidingQuestion: 'What mathematical formula connects `tasksCompleted`, 50 base XP, and `bonusMultiplier`?',
          tier2AnalogyExample: 'Like multiplying items in a cart: `count * priceEach * discountFactor`. Make sure to `return` the product.',
          tier3SyntaxTemplate: 'return tasksCompleted * 50 * bonusMultiplier;',
        },
      },
    ],
  },
  {
    id: 'mod-ai-native',
    title: 'Module 2: AI-Native Engineering & LLMs',
    subtitle: 'Learn to orchestrate AI models like an engineer, not just a prompter',
    description: 'Understand system prompts, structured JSON outputs, context windows, and API orchestration.',
    category: 'ai-engineering',
    order: 2,
    icon: 'BrainCircuit',
    prerequisiteModuleId: 'mod-foundations',
    estimatedHours: 5,
    tasks: [
      {
        id: 'task-201',
        slug: 'system-vs-user-prompts',
        moduleId: 'mod-ai-native',
        title: 'Anatomy of an LLM: System vs User Prompts',
        description: 'Understand how AI models parse personas, constraints, and instructions.',
        order: 1,
        estimatedMinutes: 25,
        difficulty: 'intermediate',
        xpReward: 160,
        language: 'javascript',
        concept: {
          title: 'System Prompts: The Persona Sandbox',
          explanation: 'Modern LLMs divide instructions into roles. The `system` message sets the behavioral boundary, tone, and rules. The `user` message is the incoming prompt. The system instructions take precedence.',
          realWorldAnalogy: 'Think of an actor preparing for a role. The script director whispering: "You are Sherlock Holmes; do not break character" is the system prompt. The client asking "Where are my keys?" is the user.',
          keyTakeaways: [
            'System messages define personality, boundaries, and formatting rules.',
            'Never trust raw user input to override system safety rules.',
            'Structured prompt templates prevent hallucinations.',
          ],
        },
        challenge: {
          prompt: 'Construct a Socratic AI Mentor payload for Pathfinder AI.',
          targetGoal: 'Build an object `mentorPayload` with `systemRole` and `formatInstructions` that enforces Socratic hints.',
          instructions: [
            '1. Create a variable `systemPrompt` instructing the AI: "You are a Socratic coding tutor. Never give direct answers. Ask guiding questions."',
            '2. Create a `userQuery` variable: "How do I fix my loop?"',
            '3. Combine them in a `chatPayload` object and log `chatPayload.systemPrompt`.',
          ],
        },
        starterCode: `const systemPrompt = "You are a Socratic coding tutor. Never give direct answers. Ask guiding questions.";
const userQuery = "How do I fix my loop?";

// Assemble into a payload object:
const chatPayload = {
  systemPrompt: systemPrompt,
  userQuery: userQuery,
  maxTokens: 150
};

console.log("Configured System: " + chatPayload.systemPrompt);
`,
        solutionCode: `const systemPrompt = "You are a Socratic coding tutor. Never give direct answers. Ask guiding questions.";
const userQuery = "How do I fix my loop?";

const chatPayload = {
  systemPrompt: systemPrompt,
  userQuery: userQuery,
  maxTokens: 150
};

console.log("Configured System: " + chatPayload.systemPrompt);
`,
        testCases: [
          {
            id: 'tc-1',
            description: 'Payload contains system prompt with Socratic instructions',
            codeContains: 'Socratic',
          },
          {
            id: 'tc-2',
            description: 'Prints configured system string',
            expectedOutputSubstring: 'Configured System: You are a Socratic',
          },
        ],
        socraticHints: {
          tier1GuidingQuestion: 'Does `chatPayload` hold both the system guardrails and user query?',
          tier2AnalogyExample: 'Objects in JavaScript are key-value pairs, like an envelope labeled with recipient, message, and return address.',
          tier3SyntaxTemplate: 'const chatPayload = { systemPrompt: systemPrompt, userQuery: userQuery };',
        },
      },
      {
        id: 'task-202',
        slug: 'deterministic-json-schema',
        moduleId: 'mod-ai-native',
        title: 'Structured Outputs: Parsing AI into Clean JSON',
        description: 'Force AI models to respond in strictly validated JSON schemas for frontend consumption.',
        order: 2,
        estimatedMinutes: 30,
        difficulty: 'intermediate',
        xpReward: 180,
        language: 'javascript',
        concept: {
          title: 'Why JSON Matters for AI Applications',
          explanation: 'Chatbots output unstructured conversational text. But applications need deterministic data: arrays, numbers, and boolean flags to render interactive UI components.',
          realWorldAnalogy: 'Instead of receiving an essay about a restaurant receipt, you get a clean tabular receipt with subtotal, tax, and total numbers.',
          keyTakeaways: [
            '`JSON.parse()` turns a JSON string into a usable JavaScript object.',
            'Always validate schemas or wrap `JSON.parse` in `try/catch` to handle format quirks.',
          ],
        },
        challenge: {
          prompt: 'Parse an AI-generated weekly progress recommendation.',
          targetGoal: 'Parse a raw AI JSON string response and extract the `paceRecommendation` and `xpEarned`.',
          instructions: [
            '1. Given the raw string `aiResponseRaw`, parse it using `JSON.parse()`.',
            '2. Extract `report.paceRecommendation`.',
            '3. Log "Recommendation: " + report.paceRecommendation.',
          ],
        },
        starterCode: `const aiResponseRaw = '{"paceRecommendation":"level-up","xpEarned":450,"streakDays":5}';

// Step 1: Parse the JSON string
const report = JSON.parse(aiResponseRaw);

// Step 2: Log the pace recommendation
console.log("Recommendation: " + report.paceRecommendation);
`,
        solutionCode: `const aiResponseRaw = '{"paceRecommendation":"level-up","xpEarned":450,"streakDays":5}';

const report = JSON.parse(aiResponseRaw);
console.log("Recommendation: " + report.paceRecommendation);
`,
        testCases: [
          {
            id: 'tc-1',
            description: 'Calls JSON.parse on the AI response',
            codeContains: 'JSON.parse',
          },
          {
            id: 'tc-2',
            description: 'Outputs parsed recommendation',
            expectedOutputSubstring: 'Recommendation: level-up',
          },
        ],
        socraticHints: {
          tier1GuidingQuestion: 'How do you turn a JSON string into an accessible object in JavaScript?',
          tier2AnalogyExample: 'Like unpacking a flat-pack IKEA box (`JSON.parse`) into an assembled piece of furniture you can use.',
          tier3SyntaxTemplate: 'const report = JSON.parse(aiResponseRaw);\nconsole.log("Recommendation: " + report.paceRecommendation);',
        },
      },
    ],
  },
  {
    id: 'mod-modern-ui',
    title: 'Module 3: Reactive Frontend & Web UI',
    subtitle: 'Build interactive dashboards, roadmap views, and squad feeds',
    description: 'Transform concepts into responsive, user-friendly interactive web applications.',
    category: 'frontend',
    order: 3,
    icon: 'Layout',
    prerequisiteModuleId: 'mod-ai-native',
    estimatedHours: 6,
    tasks: [
      {
        id: 'task-301',
        slug: 'state-reactive-counters',
        moduleId: 'mod-modern-ui',
        title: 'State & Reactivity: The Heartbeat of UI',
        description: 'Understand how user interfaces track changes over time with reactive state.',
        order: 1,
        estimatedMinutes: 25,
        difficulty: 'intermediate',
        xpReward: 200,
        language: 'javascript',
        concept: {
          title: 'What is State?',
          explanation: 'State is the current snapshot of an application. When a user clicks "Complete Micro-Task", state changes from "incomplete" to "completed", and the UI automatically re-renders to reflect that change.',
          realWorldAnalogy: 'A scoreboard at a basketball match. When someone scores, the display immediately flips from 12 to 14 without tearing down the stadium.',
          keyTakeaways: [
            'State drives the UI.',
            'Changing state triggers an automatic re-render of dependent components.',
          ],
        },
        challenge: {
          prompt: 'Simulate a state transition for completing a Micro-Task.',
          targetGoal: 'Write a reducer function that marks a task as completed and increments learner XP.',
          instructions: [
            '1. Create a function `completeTask(state, taskXP)`.',
            '2. Return a new object with `tasksCompleted: state.tasksCompleted + 1` and `totalXP: state.totalXP + taskXP`.',
            '3. Test with starting state `{ tasksCompleted: 2, totalXP: 250 }` and `100` XP.',
          ],
        },
        starterCode: `const initialLearnerState = {
  tasksCompleted: 2,
  totalXP: 250
};

function completeTask(state, taskXP) {
  return {
    ...state,
    tasksCompleted: state.tasksCompleted + 1,
    totalXP: state.totalXP + taskXP
  };
}

const updatedState = completeTask(initialLearnerState, 100);
console.log("Tasks Done: " + updatedState.tasksCompleted + " | Total XP: " + updatedState.totalXP);
`,
        solutionCode: `const initialLearnerState = {
  tasksCompleted: 2,
  totalXP: 250
};

function completeTask(state, taskXP) {
  return {
    ...state,
    tasksCompleted: state.tasksCompleted + 1,
    totalXP: state.totalXP + taskXP
  };
}

const updatedState = completeTask(initialLearnerState, 100);
console.log("Tasks Done: " + updatedState.tasksCompleted + " | Total XP: " + updatedState.totalXP);
`,
        testCases: [
          {
            id: 'tc-1',
            description: 'Computes new task count (3)',
            expectedOutputSubstring: 'Tasks Done: 3',
          },
          {
            id: 'tc-2',
            description: 'Increments total XP correctly (350)',
            expectedOutputSubstring: 'Total XP: 350',
          },
        ],
        socraticHints: {
          tier1GuidingQuestion: 'Does your updated state increase `tasksCompleted` by 1 and add `taskXP` to `totalXP`?',
          tier2AnalogyExample: 'Imagine updating an immutable passport stamp: keep all your old stamps, and add the new visa on top.',
          tier3SyntaxTemplate: 'return { ...state, tasksCompleted: state.tasksCompleted + 1, totalXP: state.totalXP + taskXP };',
        },
      },
    ],
  },
  {
    id: 'mod-capstone',
    title: 'Module 4: Full-Stack Capstone & Deployment',
    subtitle: 'Ship your complete AI-powered portfolio application',
    description: 'Connect frontend interfaces to AI APIs, manage persistent databases, and deploy live.',
    category: 'capstone',
    order: 4,
    icon: 'Rocket',
    prerequisiteModuleId: 'mod-modern-ui',
    estimatedHours: 8,
    tasks: [
      {
        id: 'task-401',
        slug: 'deploying-and-shipping',
        moduleId: 'mod-capstone',
        title: 'Production Readiness & Deployment',
        description: 'Assemble your portfolio project, run verification checks, and prepare for production launch.',
        order: 1,
        estimatedMinutes: 30,
        difficulty: 'advanced',
        xpReward: 300,
        language: 'javascript',
        concept: {
          title: 'Going Live: From Localhost to the World',
          explanation: 'Building on your laptop is only half the battle. Delivering value means deploying your code so real users and future hiring managers can interact with your creation.',
          realWorldAnalogy: 'Rehearsing a play in a garage vs opening night on Broadway in front of an enthusiastic audience.',
          keyTakeaways: [
            'Environment variables protect API keys from leaking to public repositories.',
            'Production builds run optimizations like minification and tree-shaking.',
            'Always verify critical paths before cutting a release.',
          ],
        },
        challenge: {
          prompt: 'Write an environment configuration validator for Pathfinder AI.',
          targetGoal: 'Validate that all required production keys are defined.',
          instructions: [
            '1. Check an `envConfig` object for `API_KEY` and `DATABASE_URL`.',
            '2. If both exist, log "System Status: Production Ready 🚀".',
          ],
        },
        starterCode: `const envConfig = {
  API_KEY: "secret-key-prod-999",
  DATABASE_URL: "postgresql://postgres:pass@aws.supabase.co:5432"
};

function checkProductionReady(env) {
  if (env.API_KEY && env.DATABASE_URL) {
    return "System Status: Production Ready 🚀";
  }
  return "System Status: Missing Configuration ⚠️";
}

console.log(checkProductionReady(envConfig));
`,
        solutionCode: `const envConfig = {
  API_KEY: "secret-key-prod-999",
  DATABASE_URL: "postgresql://postgres:pass@aws.supabase.co:5432"
};

function checkProductionReady(env) {
  if (env.API_KEY && env.DATABASE_URL) {
    return "System Status: Production Ready 🚀";
  }
  return "System Status: Missing Configuration ⚠️";
}

console.log(checkProductionReady(envConfig));
`,
        testCases: [
          {
            id: 'tc-1',
            description: 'Validates production readiness output',
            expectedOutputSubstring: 'Production Ready',
          },
        ],
        socraticHints: {
          tier1GuidingQuestion: 'Does the check verify both keys are truthy before giving the green light?',
          tier2AnalogyExample: 'Like a pre-flight checklist: engine checked, fuel checked, clearance granted.',
          tier3SyntaxTemplate: 'if (env.API_KEY && env.DATABASE_URL) return "System Status: Production Ready 🚀";',
        },
      },
    ],
  },
];
