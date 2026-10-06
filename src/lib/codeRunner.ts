import { TestCase } from '@/types';

export interface CodeRunResult {
  success: boolean;
  logs: string[];
  errors: string[];
  testResults: {
    id: string;
    description: string;
    passed: boolean;
    reason?: string;
  }[];
  allTestsPassed: boolean;
}

export function runJavaScriptSandbox(code: string, testCases: TestCase[]): CodeRunResult {
  const logs: string[] = [];
  const errors: string[] = [];

  // Override console methods in memory
  const customConsole = {
    log: (...args: any[]) => {
      logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    info: (...args: any[]) => {
      logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    error: (...args: any[]) => {
      errors.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
    warn: (...args: any[]) => {
      logs.push('[WARN] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    },
  };

  let executionError: string | null = null;

  try {
    // Sandbox execution inside a Function scope
    const runner = new Function('console', `"use strict";\n${code}`);
    runner(customConsole);
  } catch (err: any) {
    const errMsg = err?.message ? String(err.message) : String(err);
    executionError = errMsg;
    errors.push(errMsg);
  }

  const combinedOutput = logs.join('\n');

  // Evaluate test cases
  const testResults = testCases.map((tc) => {
    let passed = true;
    let reason = '';

    if (executionError) {
      return {
        id: tc.id,
        description: tc.description,
        passed: false,
        reason: `Execution halted with error: ${executionError}`,
      };
    }

    if (tc.expectedOutputSubstring) {
      const found = combinedOutput.toLowerCase().includes(tc.expectedOutputSubstring.toLowerCase());
      if (!found) {
        passed = false;
        reason = `Expected console output to contain "${tc.expectedOutputSubstring}", got: "${combinedOutput || '(empty)'}"`;
      }
    }

    if (passed && tc.codeContains) {
      const codeCleaned = code.replace(/\s+/g, ' ');
      const targetCleaned = tc.codeContains.replace(/\s+/g, ' ');
      if (!codeCleaned.includes(targetCleaned)) {
        passed = false;
        reason = `Code must include: "${tc.codeContains}"`;
      }
    }

    if (passed && tc.codeNotContains) {
      if (code.includes(tc.codeNotContains)) {
        passed = false;
        reason = `Code must not include: "${tc.codeNotContains}"`;
      }
    }

    return {
      id: tc.id,
      description: tc.description,
      passed,
      reason: passed ? 'Passed ✓' : reason,
    };
  });

  const allTestsPassed = testResults.length > 0 && testResults.every(t => t.passed);

  return {
    success: errors.length === 0,
    logs,
    errors,
    testResults,
    allTestsPassed,
  };
}
