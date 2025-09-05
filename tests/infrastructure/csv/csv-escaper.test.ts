import { describe, it, expect } from 'vitest';
import { DefaultCsvFieldEscaper } from '../../../infrastructure/csv/csv-escaper';

describe('DefaultCsvFieldEscaper', () => {
  it('escapes fields with commas, quotes and newlines', () => {
    const e = new DefaultCsvFieldEscaper();
    expect(e.escape('plain')).toBe('plain');
    expect(e.escape('a,b')).toBe('"a,b"');
    expect(e.escape('a"b')).toBe('"a""b"');
    expect(e.escape('a\n b')).toBe('"a\n b"');
  });
});


