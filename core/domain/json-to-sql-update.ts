import { JsonOutputBuilder } from './ports/json-output-builder';
import { JsonSerializer } from './ports/json-serializer';

export interface SqlUpdateOptions {
    tableName: string;
    whereClause?: string;
    includeNulls?: boolean;
    quoteStyle?: 'single' | 'double';
    primaryKey?: string;
    setQuoteIdentifiers?: boolean;
}

export class JsonToSqlUpdateBuilder implements JsonOutputBuilder<string> {
    private readonly serializer: JsonSerializer;
    private readonly options: SqlUpdateOptions;

    constructor(params: { serializer: JsonSerializer; options: SqlUpdateOptions }) {
        this.serializer = params.serializer;
        this.options = {
            includeNulls: false,
            quoteStyle: 'single',
            setQuoteIdentifiers: true,
            ...params.options
        };
    }

    build(json: Record<string, any>): string {
        if (Array.isArray(json)) {
            return this.buildBulkUpdate(json);
        }
        return this.buildSingleUpdate(json);
    }

    private buildSingleUpdate(data: Record<string, any>): string {
        const updates: string[] = [];

        // Sort keys for consistent ordering
        const sortedKeys = Object.keys(data).sort();
        for (const key of sortedKeys) {
            if (key === this.options.primaryKey) continue; // Skip primary key from SET clause
            if (!this.options.includeNulls && data[key] === null) continue;

            const setKey = this.options.setQuoteIdentifiers ? this.escapeIdentifier(key) : key;
            updates.push(`${setKey} = ${this.formatValue(data[key])}`);
        }

        if (updates.length === 0) {
            throw new Error('No fields to update');
        }

        let whereClause = this.options.whereClause;
        const primaryKey = this.options.primaryKey;
        if (!whereClause && primaryKey && data[primaryKey] !== undefined) {
            const pkValue = this.formatValue(data[primaryKey]);
            whereClause = `${this.escapeIdentifier(primaryKey)} = ${pkValue}`;
        }

        if (!whereClause) {
            throw new Error('Either whereClause or primaryKey must be provided for UPDATE statements');
        }

        return `UPDATE ${this.escapeIdentifier(this.options.tableName)} SET ${updates.join(', ')} WHERE ${whereClause};`;
    }

    private buildBulkUpdate(data: Record<string, any>[]): string {
        if (!this.options.primaryKey) {
            throw new Error('primaryKey is required for bulk UPDATE operations');
        }

        const statements: string[] = [];
        const primaryKey = this.options.primaryKey as string;
        data.forEach(item => {
            const pkValue = item[primaryKey];
            if (pkValue === undefined) {
                throw new Error(`Primary key ${primaryKey} is required for all items in bulk update`);
            }

            const updates: string[] = [];
            // Sort keys for consistent ordering
            const sortedKeys = Object.keys(item).sort();
            for (const key of sortedKeys) {
                if (key === this.options.primaryKey) continue;
                if (!this.options.includeNulls && item[key] === null) continue;

                const setKey = this.options.setQuoteIdentifiers ? this.escapeIdentifier(key) : key;
                updates.push(`${setKey} = ${this.formatValue(item[key])}`);
            }

            if (updates.length > 0) {
                const whereClause = `${this.escapeIdentifier(primaryKey)} = ${this.formatValue(pkValue)}`;
                statements.push(`UPDATE ${this.escapeIdentifier(this.options.tableName)} SET ${updates.join(', ')} WHERE ${whereClause};`);
            }
        });

        return statements.join('\n');
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
            const quote = this.options.quoteStyle === 'double' ? '"' : "'";
            return `${quote}${serialized.replace(new RegExp(quote, 'g'), `${quote}${quote}`)}${quote}`;
        }

        return String(serialized);
    }

    private escapeIdentifier(identifier: string): string {
        // Remove quotes if already present and add backticks for MySQL style
        const cleanIdentifier = identifier.replace(/["`]/g, '');
        return `\`${cleanIdentifier}\``;
    }
}
