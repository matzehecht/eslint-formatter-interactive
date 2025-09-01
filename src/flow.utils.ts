import { bold, red, yellow } from 'yoctocolors';

export type RelevantStats = 'count' | 'errors' | 'fatalErrors' | 'fixable' | 'group' | 'occurences' | 'warnings';

export type Stats = {
  count: number;
  errors: number;
  fatalErrors: number;
  fixable: number;
  fixableErrors: number;
  fixableWarnings: number;
  group: string;
  occurences: number;
  warnings: number;
};

type FormattedResult = Record<RelevantStats, string>;

export const formatTableData = (grouped: Pick<Stats, RelevantStats>[]): FormattedResult[] =>
  grouped.map(({ count, errors, fatalErrors, fixable, group, occurences, warnings }) => ({
    count: count.toString(),
    errors: red(errors.toString()),
    fatalErrors: red(fatalErrors.toString()),
    fixable: fixable.toString(),
    group: bold(group),
    occurences: occurences.toString(),
    warnings: yellow(warnings.toString()),
  }));
