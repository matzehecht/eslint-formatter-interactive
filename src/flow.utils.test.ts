import { describe, expect, it } from 'vitest';
import { bold, red, yellow } from 'yoctocolors';
import type { Stats } from './flow.utils.js';
import { formatTableData } from './flow.utils.js';

describe('formatTableData', () => {
  it('should format the table data correctly', () => {
    const input: Pick<Stats, 'count' | 'errors' | 'fatalErrors' | 'fixable' | 'group' | 'occurences' | 'warnings'>[] = [
      {
        count: 10,
        errors: 2,
        fatalErrors: 1,
        fixable: 5,
        group: 'testGroup',
        occurences: 3,
        warnings: 4,
      },
    ];

    const expectedOutput = [
      {
        count: '10',
        errors: red('2'),
        fatalErrors: red('1'),
        fixable: '5',
        group: bold('testGroup'),
        occurences: '3',
        warnings: yellow('4'),
      },
    ];

    const result = formatTableData(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should handle empty input', () => {
    const input: Pick<Stats, 'count' | 'errors' | 'fatalErrors' | 'fixable' | 'group' | 'occurences' | 'warnings'>[] =
      [];
    const expectedOutput: unknown[] = [];

    const result = formatTableData(input);
    expect(result).toEqual(expectedOutput);
  });
});
