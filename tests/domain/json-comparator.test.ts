import { describe, it, expect } from 'vitest';
import { DefaultJsonComparator } from '../../core/domain/comparators/json-comparator';

describe('DefaultJsonComparator', () => {
    it('detects added/removed/changed keys', () => {
        const cmp = new DefaultJsonComparator();
        const left = { a: 1, b: 2 };
        const right = { a: 1, c: 3 };
        const diffs = cmp.compare(left, right);
        const kinds = diffs.map(d => d.kind);
        expect(kinds).toContain('removed');
        expect(kinds).toContain('added');
        expect(diffs.find(d => d.kind === 'added')!.path).toContain('c');
        expect(diffs.find(d => d.kind === 'removed')!.path).toContain('b');
    });

    it('ignores whitespace-only string changes by default', () => {
        const cmp = new DefaultJsonComparator();
        const diffs = cmp.compare({ a: '  ' }, { a: '' });
        expect(diffs.length).toBe(0);
    });

    it('can ignore array order', () => {
        const cmp = new DefaultJsonComparator();
        const diffs = cmp.compare({ arr: [1, 2, 3] }, { arr: [3, 1, 2] }, { ignoreArrayOrder: true });
        expect(diffs.length).toBe(0);
    });
});


