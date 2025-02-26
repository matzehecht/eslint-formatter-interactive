import checkbox from '@inquirer/checkbox';
import { ESLint } from 'eslint';
import { blueBright, bold } from 'yoctocolors';
import { SELECT_INDENT_WIDTH } from './constants.js';
import type { RelevantStats, Stats } from './flow.utils.js';
import { formatTableData } from './flow.utils.js';
import type { BaseHeaderDefinitions } from './table.js';
import { formatTable } from './table.js';
import { print } from './utils.js';

type FlowOptions = {
  calculateStats: (results: ESLint.LintResult[]) => Stats[];
  filterResults: (results: ESLint.LintResult[], selectedGroups: string[]) => ESLint.LintResult[];
  groupLabel: string;
  tableHeaders: BaseHeaderDefinitions<RelevantStats>;
};

export { Stats };

export const SELECT_INDENT = new Array(SELECT_INDENT_WIDTH).fill(' ').join('');

export const getFlow =
  ({ calculateStats, filterResults, groupLabel, tableHeaders }: FlowOptions): ESLint.Formatter['format'] =>
  async (results) => {
    const stats = calculateStats(results);

    const sortedStats = [...stats].sort((a, b) => b.count - a.count);
    const formattedRuleStats = formatTableData(sortedStats);

    const [headers = '', ...bodyRows] = formatTable(tableHeaders, formattedRuleStats);

    const selectedGroups = await checkbox(
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        choices: bodyRows.map((row, i) => ({ name: row, value: sortedStats[i]!.group })),
        loop: true,
        message: `Select a ${groupLabel} to view details\n${SELECT_INDENT}${headers}\n`,
        pageSize: bodyRows.length,
      },
      { clearPromptOnDone: true },
    );

    if (selectedGroups.length === 0) {
      throw new Error(`No ${groupLabel} selected`);
    }

    const filteredResults = filterResults(results, selectedGroups);

    print(`${blueBright('!')} Results for ${groupLabel}(s) ${bold(selectedGroups.join(', '))}:`);

    const eslint = new ESLint();
    const formatter = await eslint.loadFormatter('stylish');

    return formatter.format(filteredResults);
  };
