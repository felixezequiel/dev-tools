import { KeyPathParser } from '../domain/key-path-parser';
import { ValueCoercer } from '../domain/value-coercer';
import { StructureMutator } from '../domain/structure-mutator';
import { EntrySource } from '../domain/entry-source';
import { RebuildPipeline } from './rebuild-pipeline';
import { DotBracketKeyPathParser } from '../infrastructure/key-path/dot-bracket-key-path-parser';
import { LiteralStringValueCoercer } from '../infrastructure/value-coercers/literal-string-value-coercer';
import { NestedPathStructureMutator } from '../infrastructure/structure-mutators/nested-path-structure-mutator';

export class DataReBuilder {
    private readonly parser: KeyPathParser;
    private readonly coercer: ValueCoercer;
    private readonly mutator: StructureMutator<Record<string, any>>;

    constructor(params?: { parser?: KeyPathParser; coercer?: ValueCoercer; mutator?: StructureMutator<Record<string, any>> }) {
        this.parser = params?.parser ?? new DotBracketKeyPathParser();
        this.coercer = params?.coercer ?? new LiteralStringValueCoercer();
        this.mutator = params?.mutator ?? new NestedPathStructureMutator();
    }

    rebuildFrom<TKey, TValue>(source: EntrySource<TKey, TValue>, keySelector?: (key: TKey) => string, valueSelector?: (value: TValue) => unknown): RebuildPipeline<TKey, TValue> {
        return new RebuildPipeline<TKey, TValue>({
            source,
            parser: this.parser,
            coercer: this.coercer,
            mutator: this.mutator,
            keySelector,
            valueSelector,
        });
    }
}


