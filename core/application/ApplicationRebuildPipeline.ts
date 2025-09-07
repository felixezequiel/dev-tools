import { RebuildPipeline } from "../domain/rebuild-pipeline";
import { JsonToFormDataBuilder } from "../domain/converters/json-to-formdata";
import { DotBracketKeyPathFormatter } from "../infrastructure/key-path/dot-bracket-key-path-formatter";
import { DefaultJsonToFormDataSerializer } from "../infrastructure/json/default-json-to-formdata-serializer";
import { JsonToCsvBuilder } from "../domain/converters/json-to-csv";
import { DefaultCsvFieldEscaper } from "../infrastructure/csv/csv-escaper";
import { SqlInsertOptions } from "../domain/converters/json-to-sql-insert";
import { JsonToSqlInsertBuilder } from "../domain/converters/json-to-sql-insert";
import { SqlUpdateOptions } from "../domain/converters/json-to-sql-update";
import { JsonToSqlUpdateBuilder } from "../domain/converters/json-to-sql-update";
import { SqlCreateTableOptions } from "../domain/converters/json-to-sql-create-table";
import { JsonToSqlCreateTableBuilder } from "../domain/converters/json-to-sql-create-table";
import { XmlOptions } from "../domain/converters/json-to-xml";
import { JsonToXmlBuilder } from "../domain/converters/json-to-xml";
import { YamlOptions } from "../domain/converters/json-to-yaml";
import { JsonToYamlBuilder } from "../domain/converters/json-to-yaml";
import { JsonSchemaOptions } from "../domain/converters/json-to-json-schema";
import { JsonSchema } from "../domain/converters/json-to-json-schema";
import { JsonToJsonSchemaBuilder } from "../domain/converters/json-to-json-schema";
import { MigrationOptions } from "../domain/converters/json-to-database-migration";
import { JsonToDatabaseMigrationBuilder } from "../domain/converters/json-to-database-migration";
import { OpenApiOptions } from "../domain/converters/json-to-openapi";
import { OpenApiSpec } from "../domain/converters/json-to-openapi";
import { JsonToOpenApiBuilder } from "../domain/converters/json-to-openapi";
import { MigrationScript } from "../domain/converters/json-to-database-migration";


export class ApplicationRebuildPipeline<TKey, TValue> {
    private readonly domainPipeline: RebuildPipeline<TKey, TValue>;

    constructor(domainPipeline: RebuildPipeline<TKey, TValue>) {
        this.domainPipeline = domainPipeline;
    }

    toJSON(): Record<string, any> {
        return this.domainPipeline.toJSON();
    }

    toCustom<TOutput>(builder: { build(json: Record<string, any>): TOutput }): TOutput {
        return this.domainPipeline.toCustom(builder);
    }

    toFormData(): FormData {
        const json = this.domainPipeline.toJSON();
        const builder = new JsonToFormDataBuilder({
            formatter: new DotBracketKeyPathFormatter(),
            serializer: new DefaultJsonToFormDataSerializer(),
        });
        return builder.build(json);
    }

    toCsv(): string {
        const json = this.domainPipeline.toJSON();
        const builder = new JsonToCsvBuilder({
            formatter: new DotBracketKeyPathFormatter(),
            serializer: new DefaultJsonToFormDataSerializer(),
            escaper: new DefaultCsvFieldEscaper(),
        });
        return builder.build(json);
    }

    toSqlInsert(options: SqlInsertOptions): string {
        const json = this.domainPipeline.toJSON();
        const builder = new JsonToSqlInsertBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options
        });
        return builder.build(json);
    }

    toSqlUpdate(options: SqlUpdateOptions): string {
        const json = this.domainPipeline.toJSON();
        const builder = new JsonToSqlUpdateBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options: { setQuoteIdentifiers: false, ...options }
        });
        return builder.build(json);
    }

    toSqlCreateTable(options: SqlCreateTableOptions): string {
        const json = this.domainPipeline.toJSON();
        const builder = new JsonToSqlCreateTableBuilder({
            options
        });
        return builder.build(json);
    }

    toXml(options?: XmlOptions): string {
        const json = this.domainPipeline.toJSON();
        const builder = new JsonToXmlBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options
        });
        return builder.build(json);
    }

    toYaml(options?: YamlOptions): string {
        const json = this.domainPipeline.toJSON();
        const builder = new JsonToYamlBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options
        });
        return builder.build(json);
    }

    toJsonSchema(options?: JsonSchemaOptions): JsonSchema {
        const json = this.domainPipeline.toJSON();
        const builder = new JsonToJsonSchemaBuilder({
            options
        });
        return builder.build(json);
    }

    toDatabaseMigration(options: MigrationOptions): MigrationScript {
        const json = this.domainPipeline.toJSON();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer: new DefaultJsonToFormDataSerializer(),
            options
        });
        return builder.build(json);
    }

    toOpenApiSpec(options: OpenApiOptions): OpenApiSpec {
        const json = this.domainPipeline.toJSON();
        const builder = new JsonToOpenApiBuilder({
            options
        });
        return builder.build(json);
    }
}