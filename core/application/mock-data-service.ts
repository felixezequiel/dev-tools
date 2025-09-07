import { SimpleSchemaLoader } from '../infrastructure/mock-data/simple-schema-loader';
import { SimpleDataFaker } from '../infrastructure/mock-data/simple-data-faker';
import { SimpleCsvExporter, SimpleSqlInsertExporter } from '../infrastructure/mock-data/simple-exporters';
import type { DataFakerOptions } from '../domain/ports/mock-data';

export class MockDataService {
    private readonly loader = new SimpleSchemaLoader();
    private readonly faker = new SimpleDataFaker();
    private readonly csv = new SimpleCsvExporter();
    private readonly sql = new SimpleSqlInsertExporter();

    generateFromJsonSchema(schema: unknown, options: DataFakerOptions & { tableName?: string; includeNulls?: boolean; batchSize?: number }) {
        const internal = this.loader.loadFromJsonSchema(schema);
        const json = this.faker.generate(internal, options);
        const csv = this.csv.export(json as any[]);
        const effectiveBatch = options.batchSize ?? (Array.isArray(json) ? json.length : 1);
        const sql = this.sql.export(json as any[], { tableName: options.tableName || 'data', includeNulls: options.includeNulls, batchSize: effectiveBatch });
        return { json, csv, sql };
    }

    generateFromOpenApi(spec: unknown, options: DataFakerOptions & { tableName?: string; includeNulls?: boolean; batchSize?: number }) {
        const internal = this.loader.loadFromOpenApi(spec);
        const json = this.faker.generate(internal, options);
        const csv = this.csv.export(json as any[]);
        const effectiveBatch = options.batchSize ?? (Array.isArray(json) ? json.length : 1);
        const sql = this.sql.export(json as any[], { tableName: options.tableName || 'data', includeNulls: options.includeNulls, batchSize: effectiveBatch });
        return { json, csv, sql };
    }
}


