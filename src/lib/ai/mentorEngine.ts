import { MicroTask } from '@/types';

export interface MentorPromptContext {
  task: MicroTask;
  userCode: string;
  terminalOutput?: string;
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  userQuestion: string;
  hintLevel?: 1 | 2 | 3;
}

export const SYSTEM_SOCRATIC_MENTOR_PROMPT = `
You are "Ada", the Socratic AI Mentor for Pathfinder AI.
Your absolute mission is to guide complete beginners (0 coding background) to master AI-native full-stack software engineering using "Learning by Doing".

CRITICAL PEDAGOGICAL DIRECTIVES:
1. NEVER spoon-feed the complete finished code solution immediately.
2. ADAPT TO THE USER'S HINT TIER:
   - Tier 1 (Default / Guiding Question): Point out what part of the logic to inspect. Ask a question that leads them to identify the issue themselves.
   - Tier 2 (Analogy & Concept): Use an intuitive real-world analogy (e.g. storage boxes, recipe cards, traffic lights, mail delivery) to explain the principle.
   - Tier 3 (Structural Template): Provide a syntax scaffold with blanks (e.g. \`let _____ = ____;\`) so they still type and verify the solution themselves.
3. CONTEXTUAL AWARENESS:
   - Reference the user's specific code lines, variable names, or terminal error output.
   - Highlight what they did RIGHT first to build confidence before steering them.
4. TONE:
   - Friendly, encouraging, concise (2-4 short paragraphs max).
   - End with a single clear, low-friction next step or question.
`;

export function generateSocraticSystemPrompt(task: MicroTask, hintLevel: number = 1): string {
  return `${SYSTEM_SOCRATIC_MENTOR_PROMPT}

CURRENT MICRO-TASK CONTEXT:
- Title: "${task.title}" (${task.estimatedMinutes} min micro-task)
- Difficulty: ${task.difficulty}
- Core Concept: "${task.concept.title}": ${task.concept.explanation}
- Real World Analogy: "${task.concept.realWorldAnalogy}"
- Target Challenge: "${task.challenge.prompt}"
- Specific Instructions:
${task.challenge.instructions.map((ins, i) => `  ${ins}`).join('\n')}

PRE-BAKED HINTS FOR THIS TASK:
- Tier 1: ${task.socraticHints.tier1GuidingQuestion}
- Tier 2: ${task.socraticHints.tier2AnalogyExample}
- Tier 3: ${task.socraticHints.tier3SyntaxTemplate}

CURRENT REQUESTED HINT TIER: Level ${hintLevel}
`;
}

/**
 * Fallback intelligent Socratic generator when external API keys are not provided.
 * Ensures the app functions completely offline / out of the box with realistic mentor behavior.
 */
export function generateMockSocraticResponse(context: MentorPromptContext): {
  message: string;
  suggestedAction: string;
} {
  const { task, userCode, terminalOutput, userQuestion, hintLevel = 1 } = context;
  const q = userQuestion.toLowerCase();

  // If user asks for solution or is stuck
  if (hintLevel === 3 || q.includes('give me the answer') || q.includes('solution') || q.includes('show code')) {
    return {
      message: `I hear you! When you hit a wall, seeing the structure helps connect the dots. Here is the scaffold template for **${task.title}**—fill in the blanks:

\`\`\`javascript
${task.socraticHints.tier3SyntaxTemplate}
\`\`\`

Look closely at the variable names. Try inserting this into your editor and click **Run Code** to see it in action!`,
      suggestedAction: 'Apply template into editor',
    };
  }

  if (hintLevel === 2 || q.includes('analogy') || q.includes('explain') || q.includes('don\'t understand')) {
    return {
      message: `Great question! Let's step away from syntax for a second and look at how this works in real life:

💡 **Think of it like this:** ${task.concept.realWorldAnalogy}

In your code right now, ask yourself: *what label are we giving our box, and what value are we putting inside?*

${task.socraticHints.tier2AnalogyExample}`,
      suggestedAction: 'Reflect on analogy and update code',
    };
  }

  // Tier 1 / General question
  if (terminalOutput && terminalOutput.includes('Error')) {
    return {
      message: `Spot on for testing your code early! I see a small hiccup in the output:
\`${terminalOutput.trim().slice(0, 100)}\`

Take a quick look at your code:
${task.socraticHints.tier1GuidingQuestion}

What do you think happens if you check the variable name spelling?`,
      suggestedAction: 'Check variable name and test again',
    };
  }

  // Default Tier 1 guidance
  return {
    message: `You're off to a solid start on **${task.title}**! 🚀

Notice what the instructions ask for:
> "${task.challenge.instructions[0]}"

Here is a guiding question to nudge you forward:
💭 **${task.socraticHints.tier1GuidingQuestion}**

Give that a quick tweak in your editor, then hit **Run Code** to see what changes!`,
    suggestedAction: 'Try tweaking the code based on the question',
  };
}

export async function askMentor(context: MentorPromptContext, apiKey?: string, provider?: 'gemini' | 'openai'): Promise<{
  message: string;
  suggestedAction?: string;
}> {
  const envGeminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const envOpenAIKey = process.env.OPENAI_API_KEY;
  const activeKey = apiKey || envGeminiKey || envOpenAIKey;

  // If no keys available anywhere, use the intelligent Socratic fallback
  if (!activeKey) {
    return generateMockSocraticResponse(context);
  }

  const isGemini = provider === 'gemini' || (!provider && (apiKey?.startsWith('AIza') || envGeminiKey));

  if (isGemini) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: generateSocraticSystemPrompt(context.task, context.hintLevel || 1) },
                  {
                    text: `USER CODE IN EDITOR:\n\`\`\`javascript\n${context.userCode}\n\`\`\`\n\nTERMINAL OUTPUT:\n${
                      context.terminalOutput || 'No errors yet'
                    }\n\nUSER INQUIRY:\n${context.userQuestion}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        return {
          message: generatedText,
          suggestedAction: 'Reflect and try in editor',
        };
      }
    } catch (err) {
      console.warn('Gemini request failed, falling back to mock Socratic mentor:', err);
    }
  } else {
    // OpenAI fallback
    try {
      const openAiKey = activeKey;
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: generateSocraticSystemPrompt(context.task, context.hintLevel || 1),
            },
            {
              role: 'user',
              content: `USER CODE:\n\`\`\`javascript\n${context.userCode}\n\`\`\`\n\nOUTPUT:\n${
                context.terminalOutput || 'None'
              }\n\nQUESTION: ${context.userQuestion}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) {
        return {
          message: reply,
          suggestedAction: 'Apply feedback in editor',
        };
      }
    } catch (err) {
      console.warn('OpenAI request failed, falling back to mock Socratic mentor:', err);
    }
  }

  // Graceful fallback
  return generateMockSocraticResponse(context);
}
