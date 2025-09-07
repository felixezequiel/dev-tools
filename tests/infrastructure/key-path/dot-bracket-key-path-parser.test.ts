import { describe, it, expect } from 'vitest';
import { DotBracketKeyPathParser } from '../../../core/infrastructure/key-path/dot-bracket-key-path-parser';

describe('DotBracketKeyPathParser', () => {
    it('parses dot+bracket syntax into segments', () => {
        const p = new DotBracketKeyPathParser();
        const kp = p.parse('user.emails[0].address');
        expect(kp.segments).toEqual(['user', 'emails', '0', 'address']);
    });
});


