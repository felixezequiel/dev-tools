import { describe, it, expect } from 'vitest';
import { DefaultCsvParser } from '../../../core/infrastructure/parsers/csv-parser';

describe('DefaultCsvParser', () => {
  it('parses simple csv with quotes', () => {
    const p = new DefaultCsvParser();
    const rows = p.parse('a,b\n"1,2",3');
    expect(rows).toEqual([
      ['a', 'b'],
      ['1,2', '3']
    ]);
  });
});


