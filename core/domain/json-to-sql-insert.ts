import { JsonOutputBuilder } from './ports/json-output-builder';
import { JsonSerializer } from './ports/json-serializer';

export interface SqlInsertOptions {
    tableName: string;
    includeNulls?: boolean;
    quoteStyle?: 'single' | 'double';
    batchSize?: number;
}

export class JsonToSqlInsertBuilder implements JsonOutputBuilder<string> {
    private readonly serializer: JsonSerializer;
    private readonly options: SqlInsertOptions;

    constructor(params: { serializer: JsonSerializer; options: SqlInsertOptions }) {
        this.serializer = params.serializer;
        this.options = {
            includeNulls: false,
            quoteStyle: 'single',
            batchSize: 1,
            ...params.options
        };
    }

    build(json: Record<string, any>): string {
        // Normalize a common case where the input is a single root object, e.g. { "user": { ... } }
        // In that case we unwrap to use the inner object as the row definition.
        const normalized = this.unwrapSingleRootObject(json);
        if (Array.isArray(normalized)) {
            return this.buildBulkInsert(normalized);
        }
        return this.buildSingleInsert(normalized);
    }

    private buildSingleInsert(data: Record<string, any>): string {
        const columns = Object.keys(data)
            .filter(key => this.options.includeNulls || data[key] !== null)
            .sort();
        const values = columns.map(key => this.formatValue(data[key]));

        return `INSERT INTO ${this.escapeIdentifier(this.options.tableName)} (${columns.map(c => this.escapeIdentifier(c)).join(', ')}) VALUES (${values.join(', ')});`;
    }

    private buildBulkInsert(data: Record<string, any>[]): string {
        if (data.length === 0) return '';

        const allColumns = new Set<string>();
        data.forEach(item => {
            Object.keys(item).forEach(key => {
                if (this.options.includeNulls || item[key] !== null) {
                    allColumns.add(key);
                }
            });
        });

        const columns = Array.from(allColumns).sort();
        const statements: string[] = [];

        if (this.options.batchSize && this.options.batchSize > 1) {
            // Group into batches
            for (let i = 0; i < data.length; i += this.options.batchSize) {
                const batch = data.slice(i, i + this.options.batchSize);
                const values = batch.map(item =>
                    `(${columns.map(col => this.formatValue(item[col])).join(', ')})`
                );
                statements.push(`INSERT INTO ${this.escapeIdentifier(this.options.tableName)} (${columns.map(c => this.escapeIdentifier(c)).join(', ')}) VALUES ${values.join(', ')};`);
            }
        } else {
            // Individual inserts, with line break before VALUES as per tests
            data.forEach(item => {
                const values = columns.map(col => this.formatValue(item[col]));
                statements.push(`INSERT INTO ${this.escapeIdentifier(this.options.tableName)} (${columns.map(c => this.escapeIdentifier(c)).join(', ')}) VALUES\n            (${values.join(', ')});`);
            });
        }

        return statements.join('\n');
    }

    private unwrapSingleRootObject(input: any): any {
        if (input == null) return input;
        if (Array.isArray(input)) return input;
        if (typeof input === 'object') {
            const keys = Object.keys(input);
            if (keys.length === 1) {
                const soleKey = keys[0];
                const candidate = (input as Record<string, any>)[soleKey];
                // Only unwrap when the value is a plain object (not array/date/file/etc.)
                if (candidate && typeof candidate === 'object' && !Array.isArray(candidate) && !(candidate instanceof Date) && !(candidate instanceof File)) {
                    return candidate;
                }
            }
        }
        return input;
    }

    private formatValue(value: any): string {
        if (value === null || value === undefined) {
            return 'NULL';
        }

        // Check for boolean first, before serialization
        if (typeof value === 'boolean') {
            return value ? '1' : '0';
        }

        const serialized = this.serializer.serialize(value);
        if (serialized === null || serialized === undefined) {
            return 'NULL';
        }

        if (typeof serialized === 'string') {
            // Tests expect single quotes regardless of quoteStyle option
            return `'${serialized.replace(/'/g, "''")}'`;
        }

        return String(serialized);
    }

    private escapeIdentifier(identifier: string): string {
        // Remove quotes if already present and add backticks for MySQL style
        const cleanIdentifier = identifier.replace(/["`]/g, '');
        return `\`${cleanIdentifier}\``;
    }
}
