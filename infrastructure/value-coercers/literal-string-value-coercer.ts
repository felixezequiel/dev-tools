import { ValueCoercer } from '../../domain/value-coercer';

export class LiteralStringValueCoercer implements ValueCoercer {
    coerce(value: unknown): unknown {
        if (typeof File !== 'undefined' && value instanceof File) return value;
        if (value === 'null') return null;
        if (value === '[]') return [];
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    }
}


