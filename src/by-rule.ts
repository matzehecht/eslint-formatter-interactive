import type { ESLint, Linter } from 'eslint';
import { bold, red, yellow } from 'yoctocolors';
import { SEVERITY } from './constants.js';
import type { Stats } from './flow.js';
import { getFlow } from './flow.js';

export const mergeStatsRecords = (aRuleStatsRecord: Record<string, Stats>, bRuleStatsRecord: Record<string, Stats>) =>
  Object.entries(aRuleStatsRecord).reduce<Record<string, Stats>>((filePrev, [rule, stats]) => {
    if (!filePrev[rule]) {
      filePrev[rule] = stats;
      return filePrev;
    }

    const prevRuleStats = filePrev[rule];

    filePrev[rule] = {
      count: prevRuleStats.count + stats.count,
      errors: prevRuleStats.errors + stats.errors,
      fatalErrors: prevRuleStats.fatalErrors + stats.fatalErrors,
      fixable: prevRuleStats.fixable + stats.fixable,
      fixableErrors: prevRuleStats.fixableErrors + stats.fixableErrors,
      fixableWarnings: prevRuleStats.fixableWarnings + stats.fixableWarnings,
      group: rule,
      occurences: prevRuleStats.occurences + stats.occurences,
      warnings: prevRuleStats.warnings + stats.warnings,
    };
    return filePrev;
  }, bRuleStatsRecord);

const calculateStats = (results: ESLint.LintResult[]): Stats[] => {
  const stats = results.reduce<Record<string, Stats>>((prev, { messages }) => {
    const fileRuleStats = messages.reduce<Record<string, Stats>>((filePrev, { fatal, fix, ruleId, severity }) => {
      const rule = ruleId ?? 'unknown';

      const errors = severity === SEVERITY.ERROR ? 1 : 0;
      const warnings = severity === SEVERITY.WARN ? 1 : 0;
      const fatalErrors = fatal ? 1 : 0;
      const files = 1;
      const fixableErrors = errors && fix ? 1 : 0;
      const fixableWarnings = warnings && fix ? 1 : 0;

      const count = errors + warnings;
      const fixable = fixableErrors + fixableWarnings;

      if (!filePrev[rule]) {
        filePrev[rule] = {
          count,
          errors,
          fatalErrors,
          fixable,
          fixableErrors,
          fixableWarnings,
          group: rule,
          occurences: files,
          warnings,
        };
        return filePrev;
      }
      const prevRuleStats = filePrev[rule];

      filePrev[rule] = {
        count: prevRuleStats.count + count,
        errors: prevRuleStats.errors + errors,
        fatalErrors: prevRuleStats.fatalErrors + fatalErrors,
        fixable: prevRuleStats.fixable + fixable,
        fixableErrors: prevRuleStats.fixableErrors + fixableErrors,
        fixableWarnings: prevRuleStats.fixableWarnings + fixableWarnings,
        group: rule,
        occurences: files,
        warnings: prevRuleStats.warnings + warnings,
      };
      return filePrev;
    }, {});

    return mergeStatsRecords(fileRuleStats, prev);
  }, {});

  return Object.values(stats);
};

export const GROUPED_RESULTS_TABLE_HEADERS = [
  { key: 'count', label: 'Count' },
  { key: 'group', label: bold('Rule') },
  { key: 'errors', label: red('Error') },
  { key: 'warnings', label: yellow('Warning') },
  { key: 'fixable', label: 'Fixable' },
  { key: 'occurences', label: 'Files' },
  { key: 'fatalErrors', label: red('Fatal Error') },
] as const;

export const filterResults = (results: ESLint.LintResult[], selectedGroups: string[]): ESLint.LintResult[] => {
  const filter = (message: Linter.LintMessage) => selectedGroups.includes(message.ruleId ?? 'unknown');

  const filteredResultsByMessage = results.map((result) => {
    const messages = result.messages.filter(filter);

    const errorMessages = messages.filter((m) => m.severity === SEVERITY.ERROR);
    const warningMessages = messages.filter((m) => m.severity === SEVERITY.WARN);

    return {
      ...result,
      errorCount: errorMessages.length,
      fatalErrorCount: messages.filter((m) => m.fatal).length,
      fixableErrorCount: errorMessages.filter((m) => m.fix).length,
      fixableWarningCount: warningMessages.filter((m) => m.fix).length,
      messages,
      suppressedMessages: result.suppressedMessages.filter(filter),
      warningCount: warningMessages.length,
    };
  });

  return filteredResultsByMessage.filter((result) => result.messages.length > 0);
};

export const byRule: ESLint.Formatter['format'] = getFlow({
  calculateStats,
  filterResults,
  groupLabel: 'rule',
  tableHeaders: GROUPED_RESULTS_TABLE_HEADERS,
});
