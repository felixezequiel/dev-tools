import { describe, it, expect } from 'vitest';
import { FormDataEntrySource } from '../../../infrastructure/entry-sources/formdata-entry-source';

describe('FormDataEntrySource', () => {
  it('wraps FormData entries()', () => {
    const fd = new FormData();
    fd.append('a', '1');
    const src = new FormDataEntrySource(fd);
    expect(Array.from(src.entries())).toEqual([['a', '1']]);
  });
});


