// Domain Abstraction: Value coercion rules
export interface ValueCoercer {
    coerce(value: unknown): unknown;
}


