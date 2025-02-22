import { bold, red, yellow } from 'yoctocolors';
import { SELECT_INDENT_WIDTH } from './constants.js';

export const enrichRuleStatsBySummedCounts = (ruleStats: (RuleStats & { ruleId: string })[]) =>
  ruleStats.map<EnrichedRuleStats>((stats) => {
    const count = stats.errors + stats.warnings;
    const fixable = stats.fixableErrors + stats.fixableWarnings;
    return { ...stats, count, fixable };
  }, {});

export const GROUPED_RESULTS_TABLE_HEADERS = [
  { key: 'count', label: 'Count' },
  { key: 'rule', label: bold('Rule') },
  { key: 'errors', label: red('Error') },
  { key: 'warnings', label: yellow('Warning') },
  { key: 'fixable', label: 'Fixable' },
  { key: 'files', label: 'Files' },
  { key: 'fatalErrors', label: red('Fatal Error') },
] as const;

type GroupedResultsColumns = (typeof GROUPED_RESULTS_TABLE_HEADERS)[number]['key'];

export const formatGroupedResultsTableData = (grouped: EnrichedRuleStats[]): Record<GroupedResultsColumns, string>[] =>
  grouped.map(({ count, errors, fatalErrors, files, fixable, ruleId, warnings }) => ({
    count: count.toString(),
    errors: red(errors.toString()),
    fatalErrors: red(fatalErrors.toString()),
    files: files.toString(),
    fixable: fixable.toString(),
    rule: bold(ruleId.toString()),
    warnings: yellow(warnings.toString()),
  }));

export const SELECT_INDENT = new Array(SELECT_INDENT_WIDTH).fill(' ').join('');

export type EnrichedRuleStats = RuleStats & {
  count: number;
  fixable: number;
  ruleId: string;
};

export type RuleStats = {
  errors: number;
  fatalErrors: number;
  files: number;
  fixableErrors: number;
  fixableWarnings: number;
  warnings: number;
};

export const mergeRuleStatsRecords = (
  aRuleStatsRecord: Record<string, RuleStats>,
  bRuleStatsRecord: Record<string, RuleStats>,
) =>
  Object.entries(aRuleStatsRecord).reduce<Record<string, RuleStats>>((filePrev, [rule, stats]) => {
    if (!filePrev[rule]) {
      filePrev[rule] = stats;
      return filePrev;
    }

    const prevRuleStats = filePrev[rule];

    filePrev[rule] = {
      errors: prevRuleStats.errors + stats.errors,
      fatalErrors: prevRuleStats.fatalErrors + stats.fatalErrors,
      files: prevRuleStats.files + stats.files,
      fixableErrors: prevRuleStats.fixableErrors + stats.fixableErrors,
      fixableWarnings: prevRuleStats.fixableWarnings + stats.fixableWarnings,
      warnings: prevRuleStats.warnings + stats.warnings,
    };
    return filePrev;
  }, bRuleStatsRecord);
