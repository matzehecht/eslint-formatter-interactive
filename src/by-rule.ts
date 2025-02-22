import { select } from '@inquirer/prompts';
import { ESLint } from 'eslint';
import { blueBright, bold } from 'yoctocolors';
import type { RuleStats } from './by-rule.utils.js';
import {
  enrichRuleStatsBySummedCounts,
  formatGroupedResultsTableData,
  GROUPED_RESULTS_TABLE_HEADERS,
  mergeRuleStatsRecords,
  SELECT_INDENT,
} from './by-rule.utils.js';
import { SEVERITY } from './constants.js';
import { formatTable } from './table.js';
import { filterResults, print } from './utils.js';

const calculateRuleStats = (results: ESLint.LintResult[]): Record<string, RuleStats> => {
  return results.reduce<Record<string, RuleStats>>((prev, { messages }) => {
    const fileRuleStats = messages.reduce<Record<string, RuleStats>>((filePrev, { fatal, fix, ruleId, severity }) => {
      const rule = ruleId ?? 'unknown';

      const errors = severity === SEVERITY.ERROR ? 1 : 0;
      const warnings = severity === SEVERITY.WARN ? 1 : 0;
      const fatalErrors = fatal ? 1 : 0;
      const files = 1;
      const fixableErrors = errors && fix ? 1 : 0;
      const fixableWarnings = warnings && fix ? 1 : 0;

      if (!filePrev[rule]) {
        filePrev[rule] = {
          errors,
          fatalErrors,
          files,
          fixableErrors,
          fixableWarnings,
          warnings,
        };
        return filePrev;
      }
      const prevRuleStats = filePrev[rule];

      filePrev[rule] = {
        errors: prevRuleStats.errors + errors,
        fatalErrors: prevRuleStats.fatalErrors + fatalErrors,
        files: 1,
        fixableErrors: prevRuleStats.fixableErrors + fixableErrors,
        fixableWarnings: prevRuleStats.fixableWarnings + fixableWarnings,
        warnings: prevRuleStats.warnings + warnings,
      };
      return filePrev;
    }, {});

    return mergeRuleStatsRecords(fileRuleStats, prev);
  }, {});
};

export const byRule: ESLint.Formatter['format'] = async (results) => {
  const ruleStats = calculateRuleStats(results);

  const enrichedRuleStats = enrichRuleStatsBySummedCounts(
    Object.entries(ruleStats).map(([ruleId, stats]) => ({ ...stats, ruleId })),
  );
  const sortedRuleStats = [...enrichedRuleStats].sort((a, b) => b.count - a.count);
  const formattedRuleStats = formatGroupedResultsTableData(sortedRuleStats);

  const tmp = formatTable(GROUPED_RESULTS_TABLE_HEADERS, formattedRuleStats);
  const [headers = '', ...bodyRows] = tmp;

  const selectedRule = await select(
    {
      choices: bodyRows.map((row, i) => ({ name: row, value: sortedRuleStats[i]?.ruleId })),
      loop: true,
      message: `Select a rule to view details\n${SELECT_INDENT}${headers}`,
      pageSize: bodyRows.length,
    },
    { clearPromptOnDone: true },
  );

  if (!selectedRule) {
    throw new Error('No rule selected');
  }

  const filteredResults = filterResults(results, (message) => message.ruleId === selectedRule);

  print(`${blueBright('!')} Results for rule ${bold(selectedRule)}:`);

  const eslint = new ESLint();
  const formatter = await eslint.loadFormatter('stylish');

  return formatter.format(filteredResults);
};
