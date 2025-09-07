import { StructureMutator } from '../../interfaces/structure-mutator';
import { KeyPath } from '../../domain/ports/key-path';
import { ValueCoercer } from '../../interfaces/value-coercer';

export class NestedPathStructureMutator implements StructureMutator<Record<string, any>> {
    set(target: Record<string, any>, path: KeyPath, value: unknown, coercer: ValueCoercer): void {
        let current: any = target;
        for (let i = 0; i < path.length; i++) {
            const key = path.segmentAt(i)!;
            const last = i === path.length - 1;
            const nextKey = path.segmentAt(i + 1);
            const nextIsIndex = KeyPath.isIndexSegment(nextKey);

            if (last) {
                if (KeyPath.isIndexSegment(key)) {
                    const index = Number(key);
                    if (!Array.isArray(current)) return;
                    current[index] = coercer.coerce(value);
                } else {
                    const existing = current[key];
                    if (existing === undefined) {
                        current[key] = coercer.coerce(value);
                    } else if (Array.isArray(existing)) {
                        existing.push(coercer.coerce(value));
                    } else {
                        current[key] = [existing, coercer.coerce(value)];
                    }
                }
            } else {
                if (KeyPath.isIndexSegment(key)) {
                    const index = Number(key);
                    if (!Array.isArray(current)) return;
                    if (current[index] === undefined) {
                        current[index] = nextIsIndex ? [] : {};
                    }
                    current = current[index];
                } else {
                    if (current[key] === undefined) {
                        current[key] = nextIsIndex ? [] : {};
                    }
                    current = current[key];
                }
            }
        }
    }
}


