import { describe, it, expect } from 'vitest';
import { KeyPath } from '../../domain/key-path';

describe('KeyPath', () => {
    it('exposes segments and helpers', () => {
        const kp = new KeyPath(['user', 'emails', '0']);
        expect(kp.length).toBe(3);
        expect(kp.first()).toBe('user');
        expect(kp.segmentAt(2)).toBe('0');
        expect(KeyPath.isIndexSegment('10')).toBe(true);
        expect(KeyPath.isIndexSegment('a')).toBe(false);
    });
});


