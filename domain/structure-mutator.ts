import { KeyPath } from './key-path';
import { ValueCoercer } from './value-coercer';

// Domain Abstraction: Mutates a target structure using a path and a value
export interface StructureMutator<TTarget extends Record<string, any>> {
    set(target: TTarget, path: KeyPath, value: unknown, coercer: ValueCoercer): void;
}


