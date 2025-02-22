import { describe, expect, it, vi } from 'vitest';
import { print, transpose } from './utils.js';

describe('transpose', () => {
  it('should transpose a 2x2 matrix', () => {
    const input = [
      [1, 2],
      [3, 4],
    ];
    const expected = [
      [1, 3],
      [2, 4],
    ];
    expect(transpose(input)).toEqual(expected);
  });

  it('should transpose a 3x2 matrix', () => {
    const input = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const expected = [
      [1, 4],
      [2, 5],
      [3, 6],
    ];
    expect(transpose(input)).toEqual(expected);
  });

  it('should return an empty array when given an empty array', () => {
    const input: number[][] = [];
    const expected: number[][] = [];
    expect(transpose(input)).toEqual(expected);
  });

  it('should throw an error if rows are of unequal length', () => {
    const input = [[1, 2], [3]];
    expect(() => transpose(input)).toThrow('Row is too short');
  });
});

describe('print', () => {
  it('should print the message to the console', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {
      /* no-op */
    });
    const message = 'Hello, world!';
    print(message);
    expect(consoleSpy).toHaveBeenCalledWith(message);
    consoleSpy.mockRestore();
  });
});
