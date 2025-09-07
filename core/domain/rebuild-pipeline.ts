
import { EntrySource } from '../interfaces/entry-source';
import { KeyPathParser } from '../interfaces/key-path-parser';
import { ValueCoercer } from '../interfaces/value-coercer';
import { StructureMutator } from '../interfaces/structure-mutator';
import { JsonOutputBuilder } from './ports/json-output-builder';
import { EntrySourceToJsonConverter } from './converters/entry-source-to-json-converter';

export class RebuildPipeline<TKey, TValue> {
    private readonly source: EntrySource<TKey, TValue>;
    private readonly parser: KeyPathParser;
    private readonly coercer: ValueCoercer;
    private readonly mutator: StructureMutator<Record<string, any>>;
    private readonly keySelector?: (key: TKey) => string;
    private readonly valueSelector?: (value: TValue) => unknown;

    constructor(params: {
        source: EntrySource<TKey, TValue>;
        parser: KeyPathParser;
        coercer: ValueCoercer;
        mutator: StructureMutator<Record<string, any>>;
        keySelector?: (key: TKey) => string;
        valueSelector?: (value: TValue) => unknown;
    }) {
        this.source = params.source;
        this.parser = params.parser;
        this.coercer = params.coercer;
        this.mutator = params.mutator;
        this.keySelector = params.keySelector;
        this.valueSelector = params.valueSelector;
    }

    toJSON(): Record<string, any> {
        const converter = new EntrySourceToJsonConverter({
            parser: this.parser,
            coercer: this.coercer,
            mutator: this.mutator,
        });
        return converter.convert(this.source, this.keySelector, this.valueSelector);
    }

    toCustom<TOutput>(builder: JsonOutputBuilder<TOutput>): TOutput {
        const json = this.toJSON();
        return builder.build(json);
    }

    // Convenience conversion methods moved to Application layer wrapper to keep domain free of infra
}


