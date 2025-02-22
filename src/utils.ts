import type { ESLint, Linter } from 'eslint';
import { SEVERITY } from './constants.js';

export const transpose = <T>(array: T[][]) => {
  const firstRow = array[0];

  if (!firstRow) {
    return array;
  }

  return firstRow.map((_, i) =>
    array.map((row) => {
      const cell = row[i];

      if (cell === undefined) {
        throw new Error('Row is too short');
      }

      return cell;
    }),
  );
};

/* eslint-disable no-console */
export const print = (message: string): void => {
  console.log(message);
};
/* eslint-enable no-console */

export const filterResults = (
  results: ESLint.LintResult[],
  filter: (message: Linter.LintMessage) => boolean,
): ESLint.LintResult[] => {
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
