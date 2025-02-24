import { select } from '@inquirer/prompts';
import type { ESLint } from 'eslint';
import { byFile } from './by-file.js';
import { byRule } from './by-rule.js';
import { printSummary } from './summary.js';
import { print } from './utils.js';

const hasFails = (results: ESLint.LintResult[]): boolean => results.some((result) => result.messages.length > 0);

const format: ESLint.Formatter['format'] = async (results, resultsMeta) => {
  printSummary(results);

  if (results.length === 0 || !hasFails(results)) {
    return 'No failures found.';
  }

  const groupBy = await select<'file' | 'rule'>({
    choices: [
      { name: '... rule', value: 'rule' },
      {
        disabled: results.length === 0 && 'Only found failures in 1 file.',
        name: '... file',
        value: 'file',
      },
    ],
    default: 'rule',
    loop: true,
    message: 'Group by...',
  });

  if (groupBy === 'rule') {
    return await byRule(results, resultsMeta);
  }

  return await byFile(results, resultsMeta);
};

process.on('uncaughtException', (error) => {
  if (error instanceof Error && error.name === 'ExitPromptError') {
    print('👋 until next time!');
  } else {
    // Rethrow unknown errors
    throw error;
  }
});

export default format;
