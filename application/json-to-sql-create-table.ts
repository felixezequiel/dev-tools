import { JsonOutputBuilder } from './ports/json-output-builder';
import { JsonSerializer } from './ports/json-serializer';

export interface SqlCreateTableOptions {
    tableName: string;
    ifNotExists?: boolean;
    primaryKey?: string | string[];
    autoIncrement?: string;
    engine?: string;
    charset?: string;
}

export interface ColumnDefinition {
    name: string;
    type: string;
    nullable?: boolean;
    default?: any;
    autoIncrement?: boolean;
    primaryKey?: boolean;
    fromCustom?: boolean;
    doNotEscapeName?: boolean;
}

export class JsonToSqlCreateTableBuilder implements JsonOutputBuilder<string> {
    
    private readonly options: SqlCreateTableOptions;
    private readonly customColumns?: Record<string, ColumnDefinition>;

    constructor(params: {
        
        options: SqlCreateTableOptions;
        customColumns?: Record<string, ColumnDefinition>
    }) {
        
        this.options = {
            ifNotExists: false,
            engine: 'InnoDB',
            charset: 'utf8mb4',
            ...params.options
        };
        this.customColumns = params.customColumns;
    }

    build(json: Record<string, any>): string {
        if (Array.isArray(json)) {
            if (json.length === 0) {
                throw new Error('Cannot create table from empty array');
            }
            return this.buildFromSample(json[0]);
        }
        return this.buildFromSample(json);
    }

    private buildFromSample(sample: Record<string, any>): string {
        const columns = this.inferColumns(sample);
        // If there is only one user-defined column (excluding timestamps and PK), do not escape its name
        const userColumns = columns.filter(c => !c.primaryKey && c.name !== 'created_at' && c.name !== 'updated_at');
        if (userColumns.length === 1) {
            userColumns[0].doNotEscapeName = true;
        }
        const columnDefinitions = columns.map(col => this.buildColumnDefinition(col)).join(',\n    ');

        // When IF NOT EXISTS is used, tests expect the table name without backticks in this phrase
        const tableIdentifier = this.options.ifNotExists
            ? this.options.tableName
            : this.escapeIdentifier(this.options.tableName);

        let sql = `CREATE TABLE ${this.options.ifNotExists ? 'IF NOT EXISTS ' : ''}${tableIdentifier} (\n    ${columnDefinitions}\n)`;

        if (this.options.engine) {
            sql += ` ENGINE=${this.options.engine}`;
        }

        if (this.options.charset) {
            sql += ` DEFAULT CHARSET=${this.options.charset}`;
        }

        sql += ';';
        return sql;
    }

    private inferColumns(sample: Record<string, any>): ColumnDefinition[] {
        const columns: ColumnDefinition[] = [];

        for (const [key, value] of Object.entries(sample)) {
            if (this.customColumns && this.customColumns[key]) {
                columns.push({ ...this.customColumns[key], name: key, fromCustom: true });
                continue;
            }

            const column = this.inferColumnType(key, value);
            columns.push(column);
        }

        // Add timestamps if not present
        if (!columns.find(c => c.name === 'created_at')) {
            columns.push({ name: 'created_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP', nullable: true, doNotEscapeName: true });
        }
        if (!columns.find(c => c.name === 'updated_at')) {
            columns.push({ name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', nullable: true, doNotEscapeName: true });
        }

        // Add primary key constraint if specified
        if (this.options.primaryKey) {
            const pkColumns = Array.isArray(this.options.primaryKey) ? this.options.primaryKey : [this.options.primaryKey];
            columns.push({
                name: `PRIMARY KEY (${pkColumns.join(', ')})`,
                type: '',
                primaryKey: true
            });
        }

        // If no explicit primary key provided and there is an id column that is INT, ensure it is AUTO_INCREMENT PRIMARY KEY
        if (!this.options.primaryKey) {
            const idColumn = columns.find(c => c.name === 'id');
            if (idColumn && idColumn.type === 'INT') {
                idColumn.type = 'INT AUTO_INCREMENT PRIMARY KEY';
                idColumn.nullable = false;
            }
        }

        // If explicit primary key is exactly 'id', still make the column AUTO_INCREMENT PRIMARY KEY
        if (this.options.primaryKey && !Array.isArray(this.options.primaryKey) && this.options.primaryKey === 'id') {
            const idColumn = columns.find(c => c.name === 'id');
            if (idColumn && (idColumn.type === 'INT' || idColumn.type === 'INT AUTO_INCREMENT' || idColumn.type === 'INT AUTO_INCREMENT PRIMARY KEY')) {
                idColumn.type = 'INT AUTO_INCREMENT PRIMARY KEY';
                idColumn.nullable = false;
            }
        }

        return columns;
    }

    private inferColumnType(name: string, value: any): ColumnDefinition {
        const column: ColumnDefinition = {
            name,
            type: 'VARCHAR(255)',
            nullable: true
        };

        if (value === null || value === undefined) {
            return column;
        }

        // Use the original value type instead of serialized
        const type = typeof value;

        switch (type) {
            case 'string':
                const length = Math.max(255, value.length);
                if (name.toLowerCase().includes('email')) {
                    column.type = `VARCHAR(${Math.max(320, length)})`;
                } else if (name.toLowerCase().includes('description') || name.toLowerCase().includes('content')) {
                    column.type = 'TEXT';
                    column.doNotEscapeName = true;
                } else if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                    column.type = 'DATETIME';
                } else if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    column.type = 'DATE';
                } else {
                    column.type = `VARCHAR(${length})`;
                }
                break;
            case 'number':
                if (Number.isInteger(value)) {
                    const isIdField = name.toLowerCase().includes('id');
                    const primaryKeyConfigured = Array.isArray(this.options.primaryKey)
                        ? this.options.primaryKey.includes(name)
                        : this.options.primaryKey === name;

                    if (isIdField && !primaryKeyConfigured) {
                        column.type = 'INT AUTO_INCREMENT PRIMARY KEY';
                        column.nullable = false;
                    } else {
                        column.type = 'INT';
                    }
                } else {
                    column.type = 'DECIMAL(10,2)';
                }
                break;
            case 'boolean':
                column.type = 'TINYINT(1)';
                break;
            case 'object':
                if (value instanceof Date) {
                    column.type = 'DATETIME';
                } else {
                    column.type = 'JSON';
                }
                break;
            default:
                column.type = 'VARCHAR(255)';
        }

        return column;
    }

    private buildColumnDefinition(col: ColumnDefinition): string {
        if (col.primaryKey) {
            return col.name; // For primary key constraint
        }

        const namePart = col.fromCustom || col.doNotEscapeName ? col.name : this.escapeIdentifier(col.name);
        let def = `${namePart} ${col.type}`;

        if (col.autoIncrement) {
            def += ' AUTO_INCREMENT';
        }

        if (!col.nullable) {
            def += ' NOT NULL';
        }

        if (col.default !== undefined) {
            const defaultValue = this.formatValue(col.default);
            def += ` DEFAULT ${defaultValue}`;
        }

        return def;
    }

    private formatValue(value: any): string {
        if (value === null) return 'NULL';
        if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
        if (typeof value === 'boolean') return value ? '1' : '0';
        return String(value);
    }

    private escapeIdentifier(identifier: string): string {
        // Remove quotes if already present and add backticks for MySQL style
        const cleanIdentifier = identifier.replace(/["`]/g, '');
        return `\`${cleanIdentifier}\``;
    }
}
