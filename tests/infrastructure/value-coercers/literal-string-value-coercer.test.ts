import { describe, it, expect } from 'vitest';
import { LiteralStringValueCoercer } from '../../../infrastructure/value-coercers/literal-string-value-coercer';

describe('LiteralStringValueCoercer', () => {
    const c = new LiteralStringValueCoercer();
    it('coerces booleans and null/empty array markers', () => {
        expect(c.coerce('true')).toBe(true);
        expect(c.coerce('false')).toBe(false);
        expect(c.coerce('null')).toBeNull();
        expect(c.coerce('[]')).toEqual([]);
        expect(c.coerce('text')).toBe('text');
    });
});


