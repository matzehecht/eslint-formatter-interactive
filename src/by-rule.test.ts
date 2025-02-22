import { select } from '@inquirer/prompts';
import { ESLint } from 'eslint';
import { describe, expect, it, vi } from 'vitest';
import { bold } from 'yoctocolors';
import { byRule } from './by-rule.js';
import { SEVERITY } from './constants.js';
import { formatTable } from './table.js';
import { filterResults, print } from './utils.js';

// import { select } from '@inquirer/prompts';
// import { ESLint } from 'eslint';
// import { blueBright, bold } from 'yoctocolors';
// import type { RuleStats } from './by-rule.utils.js';
// import {
//   enrichRuleStats,
//   formatGroupedResultsTableData,
//   GROUPED_RESULTS_TABLE_HEADERS,
//   mergeRuleStatsRecords,
//   SELECT_INDENT,
// } from './by-rule.utils.js';
// import { SEVERITY } from './constants.js';
// import { formatTable } from './table.js';
// import { print } from './utils.js';

vi.mock('@inquirer/prompts');
vi.mock('./utils.js');
vi.mock('./table.js');
vi.mock('eslint');

describe('byRule', () => {
  it('should format results by rule', async () => {
    const mockResults: ESLint.LintResult[] = [
      {
        errorCount: 0,
        fatalErrorCount: 0,
        filePath: '',
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        messages: [
          {
            column: 0,
            fatal: undefined,
            fix: { range: [0, 0], text: '' },
            line: 0,
            message: '',
            ruleId: 'no-unused-vars',
            severity: SEVERITY.ERROR,
          },
          {
            column: 0,
            fatal: undefined,
            fix: undefined,
            line: 0,
            message: '',
            ruleId: 'no-console',
            severity: SEVERITY.WARN,
          },
        ],
        suppressedMessages: [],
        usedDeprecatedRules: [],
        warningCount: 0,
      },
      {
        errorCount: 0,
        fatalErrorCount: 0,
        filePath: '',
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        messages: [
          {
            column: 0,
            fatal: undefined,
            fix: { range: [0, 0], text: '' },
            line: 0,
            message: '',
            ruleId: 'no-unused-vars',
            severity: SEVERITY.ERROR,
          },
        ],
        suppressedMessages: [],
        usedDeprecatedRules: [],
        warningCount: 0,
      },
    ];

    vi.mocked(formatTable).mockReturnValue(['formatted results']);
    vi.mocked(select).mockResolvedValue('no-unused-vars');
    vi.mocked(filterResults).mockImplementation((results) => results);

    const mockFormatter = { format: vi.fn().mockReturnValue('formatted results') };
    ESLint.prototype.loadFormatter = vi.fn().mockResolvedValue(mockFormatter);

    const result = await byRule(mockResults);

    expect(select).toHaveBeenCalled();
    expect(print).toHaveBeenCalledWith(expect.stringContaining(`Results for rule ${bold('no-unused-vars')}:`));
    expect(mockFormatter.format).toHaveBeenCalledWith(expect.any(Array));
    expect(result).toBe('formatted results');
  });

  it('should throw an error if no rule is selected', async () => {
    const mockResults: ESLint.LintResult[] = [
      {
        errorCount: 0,
        fatalErrorCount: 0,
        filePath: '',
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        messages: [
          {
            column: 0,
            fatal: undefined,
            fix: undefined,
            line: 0,
            message: '',
            ruleId: 'no-unused-vars',
            severity: SEVERITY.ERROR,
          },
        ],
        suppressedMessages: [],
        usedDeprecatedRules: [],
        warningCount: 0,
      },
    ];

    vi.mocked(select).mockResolvedValue(null);
    vi.mocked(formatTable).mockReturnValue(['headers', 'row1', 'row2']);

    await expect(byRule(mockResults)).rejects.toThrow('No rule selected');
  });
});
