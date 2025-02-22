import type { ESLint } from 'eslint';
import { describe, expect, it, vi } from 'vitest';
import { printSummary } from './summary.js';
import * as utils from './utils.js';

describe('printSummary', () => {
  it('should print the correct summary for lint results', () => {
    const results: ESLint.LintResult[] = [
      {
        errorCount: 0,
        fatalErrorCount: 0,
        filePath: 'file1.js',
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        messages: [],
        source: '',
        suppressedMessages: [],
        usedDeprecatedRules: [],
        warningCount: 0,
      },
      {
        errorCount: 1,
        fatalErrorCount: 0,
        filePath: 'file2.js',
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        messages: [
          {
            column: 1,
            endColumn: 2,
            endLine: 1,
            line: 1,
            message: 'Unused variable',
            nodeType: 'Identifier',
            ruleId: 'no-unused-vars',
            severity: 2,
          },
        ],
        source: '',
        suppressedMessages: [],
        usedDeprecatedRules: [],
        warningCount: 0,
      },
      {
        errorCount: 0,
        fatalErrorCount: 0,
        filePath: 'file3.js',
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        messages: [
          {
            column: 1,
            endColumn: 2,
            endLine: 1,
            line: 1,
            message: 'Unexpected console statement',
            nodeType: 'MemberExpression',
            ruleId: 'no-console',
            severity: 1,
          },
        ],
        source: '',
        suppressedMessages: [],
        usedDeprecatedRules: [],
        warningCount: 1,
      },
    ];

    const printSpy = vi.spyOn(utils, 'print').mockImplementation(() => {
      /* no-op */
    });

    printSummary(results);

    expect(printSpy).toHaveBeenCalledTimes(1);
    expect(printSpy).toHaveBeenCalledWith(expect.stringContaining('Linted 3 files.'));
    expect(printSpy).toHaveBeenCalledWith(expect.stringContaining('2 files failed.'));
    expect(printSpy).toHaveBeenCalledWith(expect.stringContaining('1 files passed.'));
    expect(printSpy).toHaveBeenCalledWith(expect.stringContaining('Errors: 1'));
    expect(printSpy).toHaveBeenCalledWith(expect.stringContaining('Warnings: 1'));

    printSpy.mockRestore();
  });
});
