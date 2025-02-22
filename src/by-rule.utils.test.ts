import { describe, expect, it } from 'vitest';
import type { EnrichedRuleStats, RuleStats } from './by-rule.utils.js';
import {
  enrichRuleStatsBySummedCounts,
  formatGroupedResultsTableData,
  mergeRuleStatsRecords,
} from './by-rule.utils.js';

describe('enrichRuleStats', () => {
  it('should enrich rule stats with count and fixable properties', () => {
    const ruleStats: (RuleStats & { ruleId: string })[] = [
      { errors: 2, fatalErrors: 1, files: 1, fixableErrors: 1, fixableWarnings: 2, ruleId: 'rule1', warnings: 3 },
    ];
    const enrichedStats = enrichRuleStatsBySummedCounts(ruleStats);
    expect(enrichedStats).toEqual([
      {
        count: 5,
        errors: 2,
        fatalErrors: 1,
        files: 1,
        fixable: 3,
        fixableErrors: 1,
        fixableWarnings: 2,
        ruleId: 'rule1',
        warnings: 3,
      },
    ]);
  });
});

describe('formatGroupedResultsTableData2', () => {
  it('should format grouped results table data', () => {
    const groups: EnrichedRuleStats[] = [
      {
        count: 5,
        errors: 2,
        fatalErrors: 1,
        files: 1,
        fixable: 3,
        fixableErrors: 1,
        fixableWarnings: 2,
        ruleId: 'rule1',
        warnings: 3,
      },
    ];
    const formattedResults = formatGroupedResultsTableData(groups);
    expect(formattedResults).toEqual([
      {
        count: '5',
        errors: '\u001b[31m2\u001b[39m', // red color
        fatalErrors: '\u001b[31m1\u001b[39m', // red color
        files: '1',
        fixable: '3',
        rule: '\u001b[1mrule1\u001b[22m', // bold
        warnings: '\u001b[33m3\u001b[39m', // yellow color
      },
    ]);
  });
});

describe('mergeRuleStatsRecords', () => {
  it('should merge two rule stats records', () => {
    const aRuleStatsRecord: Record<string, RuleStats> = {
      rule1: { errors: 2, fatalErrors: 1, files: 1, fixableErrors: 1, fixableWarnings: 2, warnings: 3 },
    };
    const bRuleStatsRecord: Record<string, RuleStats> = {
      rule1: { errors: 1, fatalErrors: 0, files: 1, fixableErrors: 0, fixableWarnings: 1, warnings: 1 },
      rule2: { errors: 0, fatalErrors: 0, files: 1, fixableErrors: 0, fixableWarnings: 0, warnings: 2 },
    };
    const merged = mergeRuleStatsRecords(aRuleStatsRecord, bRuleStatsRecord);
    expect(merged).toEqual({
      rule1: { errors: 3, fatalErrors: 1, files: 2, fixableErrors: 1, fixableWarnings: 3, warnings: 4 },
      rule2: { errors: 0, fatalErrors: 0, files: 1, fixableErrors: 0, fixableWarnings: 0, warnings: 2 },
    });
  });
});
