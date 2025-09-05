import { EntrySource } from '../domain/entry-source';
import { KeyPathParser } from '../domain/key-path-parser';
import { ValueCoercer } from '../domain/value-coercer';
import { StructureMutator } from '../domain/structure-mutator';

export class EntrySourceToJsonConverter {
    private readonly parser: KeyPathParser;
    private readonly coercer: ValueCoercer;
    private readonly mutator: StructureMutator<Record<string, any>>;

    constructor(params: { parser: KeyPathParser; coercer: ValueCoercer; mutator: StructureMutator<Record<string, any>> }) {
        this.parser = params.parser;
        this.coercer = params.coercer;
        this.mutator = params.mutator;
    }

    convert<TKey, TValue>(source: EntrySource<TKey, TValue>, keySelector?: (key: TKey) => string, valueSelector?: (value: TValue) => unknown): Record<string, any> {
        const result: Record<string, any> = {};
        const selectKey = keySelector ?? ((k: any) => String(k));
        const selectValue = valueSelector ?? ((v: any) => v);
        for (const [rawKeyAny, rawValueAny] of source.entries()) {
            const rawKey = selectKey(rawKeyAny);
            const path = this.parser.parse(rawKey);
            this.mutator.set(result, path, selectValue(rawValueAny), this.coercer);
        }
        return result;
    }
}


