import { describe, it, expect } from 'vitest';
import { DefaultTextComparator } from '../../core/domain/comparators/text-comparator';

describe('DefaultTextComparator', () => {
    it('detects line additions/removals/changes', () => {
        const cmp = new DefaultTextComparator();
        const left = 'a\nb\nc';
        const right = 'a\nc\nd';
        const res = cmp.compare(left, right);
        expect(res.summary.added).toBe(1);
        expect(res.summary.removed).toBe(1);
        expect(res.summary.changed).toBe(1);
    });

    it('flags invisible characters', () => {
        const cmp = new DefaultTextComparator();
        const nbsp = '\u00A0';
        const res = cmp.compare(`a${nbsp}b`, 'a b');
        const issues = res.lines.flatMap(l => l.issues || []);
        expect(issues.some(i => i.codePoint === 'U+00A0')).toBe(true);
    });
});


