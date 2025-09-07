
import { EntrySource } from '../interfaces/entry-source';
import { KeyPathParser } from '../interfaces/key-path-parser';
import { ValueCoercer } from '../interfaces/value-coercer';
import { StructureMutator } from '../interfaces/structure-mutator';
import { JsonOutputBuilder } from './ports/json-output-builder';
import { JsonToFormDataBuilder } from './json-to-formdata';
import { JsonToCsvBuilder } from './json-to-csv';
import { JsonToSqlInsertBuilder, SqlInsertOptions } from './json-to-sql-insert';
import { JsonToSqlUpdateBuilder, SqlUpdateOptions } from './json-to-sql-update';
import { JsonToSqlCreateTableBuilder, SqlCreateTableOptions } from './json-to-sql-create-table';
import { JsonToXmlBuilder, XmlOptions } from './json-to-xml';
import { JsonToYamlBuilder, YamlOptions } from './json-to-yaml';
import { JsonToJsonSchemaBuilder, JsonSchemaOptions, JsonSchema } from './json-to-json-schema';
import { JsonToDatabaseMigrationBuilder, MigrationOptions, MigrationScript } from './json-to-database-migration';
import { JsonToOpenApiBuilder, OpenApiOptions, OpenApiSpec } from './json-to-openapi';
import { DotBracketKeyPathFormatter } from '../infrastructure/key-path/dot-bracket-key-path-formatter';
import { DefaultJsonToFormDataSerializer } from '../infrastructure/json/default-json-to-formdata-serializer';
import { DefaultCsvFieldEscaper } from '../infrastructure/csv/csv-escaper';
import { EntrySourceToJsonConverter } from './entry-source-to-json-converter';

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

    toSqlInsert(options: SqlInsertOptions): string {
        const json = this.toJSON();
        const builder = new JsonToSqlInsertBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options
        });
        return builder.build(json);
    }

    toSqlUpdate(options: SqlUpdateOptions): string {
        const json = this.toJSON();
        const builder = new JsonToSqlUpdateBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options: { setQuoteIdentifiers: false, ...options }
        });
        return builder.build(json);
    }

    toSqlCreateTable(options: SqlCreateTableOptions): string {
        const json = this.toJSON();
        const builder = new JsonToSqlCreateTableBuilder({
            options
        });
        return builder.build(json);
    }

    toXml(options?: XmlOptions): string {
        const json = this.toJSON();
        const builder = new JsonToXmlBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options
        });
        return builder.build(json);
    }

    toYaml(options?: YamlOptions): string {
        const json = this.toJSON();
        const builder = new JsonToYamlBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options
        });
        return builder.build(json);
    }

    toJsonSchema(options?: JsonSchemaOptions): JsonSchema {
        const json = this.toJSON();
        const builder = new JsonToJsonSchemaBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options
        });
        return builder.build(json);
    }

    toDatabaseMigration(options: MigrationOptions): MigrationScript {
        const json = this.toJSON();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options
        });
        return builder.build(json);
    }

    toOpenApiSpec(options: OpenApiOptions): OpenApiSpec {
        const json = this.toJSON();
        const builder = new JsonToOpenApiBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options
        });
        return builder.build(json);
    }
}


