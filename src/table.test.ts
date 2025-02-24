import { describe, expect, it } from 'vitest';
import { formatTable } from './table.js';

describe('formatTable', () => {
  it('should format a table with given headers and data', () => {
    const headerDefinitions = [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
    ] as const;

    const tableData = [
      { age: '30', name: 'Alice' },
      { age: '25', name: 'Bob' },
    ];

    const result = formatTable(headerDefinitions, tableData);

    const expected = ['Name   Age  ', 'Alice  30   ', 'Bob    25   '];

    expect(result).toEqual(expected);
  });

  it('should handle empty table data', () => {
    const headerDefinitions = [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
    ] as const;

    const tableData: { age: string; name: string }[] = [];

    const result = formatTable(headerDefinitions, tableData);

    const expected = ['Name  Age  '];

    expect(result).toEqual(expected);
  });

  it('should handle different column lengths', () => {
    const headerDefinitions = [
      { key: 'name', label: 'Name' },
      { key: 'occupation', label: 'Occupation' },
    ] as const;

    const tableData = [
      { name: 'Alice', occupation: 'Engineer' },
      { name: 'Bob', occupation: 'Doctor' },
    ];

    const result = formatTable(headerDefinitions, tableData);

    const expected = ['Name   Occupation  ', 'Alice  Engineer    ', 'Bob    Doctor      '];

    expect(result).toEqual(expected);
  });
});
