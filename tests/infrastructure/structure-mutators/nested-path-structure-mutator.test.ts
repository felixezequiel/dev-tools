import { describe, it, expect } from 'vitest';
import { NestedPathStructureMutator } from '../../../core/infrastructure/structure-mutators/nested-path-structure-mutator';
import { KeyPath } from '../../../core/domain/ports/key-path';
import { LiteralStringValueCoercer } from '../../../core/infrastructure/value-coercers/literal-string-value-coercer';

describe('NestedPathStructureMutator', () => {
  it('sets values for object and array paths', () => {
    const m = new NestedPathStructureMutator();
    const target: any = {};
    m.set(target, new KeyPath(['a']), '1', new LiteralStringValueCoercer());
    m.set(target, new KeyPath(['arr', '0']), 'x', new LiteralStringValueCoercer());
    m.set(target, new KeyPath(['arr', '1']), 'y', new LiteralStringValueCoercer());
    expect(target.a).toBe('1');
    expect(target.arr).toEqual(['x', 'y']);
  });
});


