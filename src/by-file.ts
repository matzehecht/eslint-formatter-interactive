import type { ESLint } from 'eslint';
import { bold, red, yellow } from 'yoctocolors';
import type { Stats } from './flow.js';
import { getFlow } from './flow.js';

const calculateStats = (results: ESLint.LintResult[]): Stats[] => {
  return results
    .filter(({ messages }) => messages.length > 0)
    .map(
      ({ errorCount, fatalErrorCount, filePath, fixableErrorCount, fixableWarningCount, messages, warningCount }) => ({
        count: errorCount + warningCount,
        errors: errorCount,
        fatalErrors: fatalErrorCount,
        fixable: fixableErrorCount + fixableWarningCount,
        fixableErrors: fixableErrorCount,
        fixableWarnings: fixableWarningCount,
        group: filePath,
        occurences: messages.length,
        warnings: warningCount,
      }),
    );
};

export const GROUPED_RESULTS_TABLE_HEADERS = [
  { key: 'count', label: 'Count' },
  { key: 'group', label: bold('File') },
  { key: 'errors', label: red('Error') },
  { key: 'warnings', label: yellow('Warning') },
  { key: 'fixable', label: 'Fixable' },
  { key: 'occurences', label: 'Occurences' },
  { key: 'fatalErrors', label: red('Fatal Error') },
] as const;

export const filterResults = (results: ESLint.LintResult[], selectedGroups: string[]): ESLint.LintResult[] => {
  return results.filter((result) => selectedGroups.includes(result.filePath));
};

export const byFile: ESLint.Formatter['format'] = getFlow({
  calculateStats,
  filterResults,
  groupLabel: 'file',
  tableHeaders: GROUPED_RESULTS_TABLE_HEADERS,
});
