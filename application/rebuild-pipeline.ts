import { EntrySource } from '../domain/entry-source';
import { KeyPathParser } from '../domain/key-path-parser';
import { ValueCoercer } from '../domain/value-coercer';
import { StructureMutator } from '../domain/structure-mutator';
import { JsonOutputBuilder } from './ports/json-output-builder';
import { JsonToFormDataBuilder } from './json-to-formdata';
import { JsonToCsvBuilder } from './json-to-csv';
import { DotBracketKeyPathFormatter } from '../infrastructure/key-path/dot-bracket-key-path-formatter';
import { DefaultJsonToFormDataSerializer } from '../infrastructure/json/default-json-to-formdata-serializer';
import { DefaultCsvFieldEscaper } from '../infrastructure/csv/csv-escaper';
import { EntrySourceToJsonConverter } from 'application/entry-source-to-json-converter';

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

    toFormData(): FormData {
        const json = this.toJSON();
        const builder = new JsonToFormDataBuilder({
            formatter: new DotBracketKeyPathFormatter(),
            serializer: new DefaultJsonToFormDataSerializer(),
        });
        return builder.build(json);
    }

    toCsv(): string {
        const json = this.toJSON();
        const builder = new JsonToCsvBuilder({
            formatter: new DotBracketKeyPathFormatter(),
            serializer: new DefaultJsonToFormDataSerializer(),
            escaper: new DefaultCsvFieldEscaper(),
        });
        return builder.build(json);
    }
}


