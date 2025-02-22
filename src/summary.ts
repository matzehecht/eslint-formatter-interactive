import type { ESLint } from 'eslint';
import { bgRed, bgYellow, bold, green, red } from 'yoctocolors';
import { COLUMN_PADDING } from './constants.js';
import { print } from './utils.js';

const PADDING = new Array(COLUMN_PADDING).fill(' ').join('');

export const printSummary = (results: ESLint.LintResult[]): void => {
  const lintedFiles = results.length;
  const stats = results.reduce<Record<'errors' | 'failed' | 'passed' | 'warnings', number>>(
    (acc, result) => {
      if (result.messages.length === 0) {
        acc.passed = acc.passed + 1;
        return acc;
      }

      acc.failed = acc.failed + 1;
      acc.errors = acc.errors + result.errorCount;
      acc.warnings = acc.warnings + result.warningCount;

      return acc;
    },
    { errors: 0, failed: 0, passed: 0, warnings: 0 },
  );

  const summaryMessages = [
    `Linted ${lintedFiles} files.`,
    red(`${stats.failed} files failed.`),
    green(`${stats.passed} files passed.`),
    bgRed(`Errors: ${stats.errors}`),
    bgYellow(`Warnings: ${stats.warnings}`),
  ];

  print(summaryMessages.map(bold).join(PADDING));
};
