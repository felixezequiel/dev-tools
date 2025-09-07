import { JsonOutputBuilder } from '../ports/json-output-builder';
import { JsonSerializer } from '../ports/json-serializer';

export interface MigrationOptions {
    tableName: string;
    migrationName?: string;
    upDirection?: boolean;
    downDirection?: boolean;
    includeData?: boolean;
    batchSize?: number;
    engine?: string;
    charset?: string;
}

export interface MigrationScript {
    up: string;
    down: string;
    name: string;
    timestamp: string;
}

export class JsonToDatabaseMigrationBuilder implements JsonOutputBuilder<MigrationScript> {
    private readonly serializer: JsonSerializer;
    private readonly options: MigrationOptions;

    constructor(params: { serializer: JsonSerializer; options: MigrationOptions }) {
        this.serializer = params.serializer;
        this.options = {
            migrationName: `create_${params.options.tableName}_table`,
            upDirection: true,
            downDirection: true,
            includeData: false,
            batchSize: 1000,
            engine: 'InnoDB',
            charset: 'utf8mb4',
            ...params.options
        };
    }

    build(json: Record<string, any>): MigrationScript {
        const now = new Date();
        const timestamp = now.getFullYear().toString() +
                         (now.getMonth() + 1).toString().padStart(2, '0') +
                         now.getDate().toString().padStart(2, '0') + '_' +
                         now.getHours().toString().padStart(2, '0') +
                         now.getMinutes().toString().padStart(2, '0') +
                         now.getSeconds().toString().padStart(2, '0');

        let upScript = '';
        let downScript = '';

        if (Array.isArray(json)) {
            if (json.length === 0) {
                throw new Error('Cannot create migration from empty array');
            }

            const { createTable, dropTable, insertData, deleteData } = this.buildFromArray(json);

            if (this.options.upDirection) {
                upScript += createTable;
                if (this.options.includeData) {
                    upScript += '\n' + insertData;
                }
            }

            if (this.options.downDirection) {
                downScript += deleteData + '\n' + dropTable;
            }
        } else {
            const { createTable, dropTable, insertData, deleteData } = this.buildFromObject(json);

            if (this.options.upDirection) {
                upScript += createTable;
                if (this.options.includeData) {
                    upScript += '\n' + insertData;
                }
            }

            if (this.options.downDirection) {
                downScript += deleteData + '\n' + dropTable;
            }
        }

        return {
            name: this.options.migrationName!,
            timestamp,
            up: upScript.trim(),
            down: downScript.trim()
        };
    }

    private buildFromObject(data: Record<string, any>) {
        const columns = this.inferColumns(data);
        const createTable = this.buildCreateTable(columns);
        const dropTable = this.buildDropTable();
        const insertData = this.buildInsertData([data]);
        const deleteData = this.buildDeleteData();

        return { createTable, dropTable, insertData, deleteData };
    }

    private buildFromArray(data: Record<string, any>[]) {
        const sample = data[0];
        const columns = this.inferColumns(sample);
        const createTable = this.buildCreateTable(columns);
        const dropTable = this.buildDropTable();
        const insertData = this.buildInsertData(data);
        const deleteData = this.buildDeleteData();

        return { createTable, dropTable, insertData, deleteData };
    }

    private inferColumns(sample: Record<string, any>): Array<{ name: string; type: string; nullable: boolean; default?: any }> {
        const columns: Array<{ name: string; type: string; nullable: boolean; default?: any }> = [];

        for (const [key, value] of Object.entries(sample)) {
            const column = this.inferColumnType(key, value);
            columns.push(column);
        }

        // Add timestamps if not present
        if (!columns.find(c => c.name === 'created_at')) {
            columns.push({
                name: 'created_at',
                type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
                nullable: false
            });
        }

        if (!columns.find(c => c.name === 'updated_at')) {
            columns.push({
                name: 'updated_at',
                type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
                nullable: false
            });
        }

        return columns;
    }

    private inferColumnType(name: string, value: any): { name: string; type: string; nullable: boolean; default?: any } {
        const column = {
            name,
            type: 'VARCHAR(255)',
            nullable: true
        };

        if (value === null || value === undefined) {
            return column;
        }

        // Check original value type before serialization
        const originalType = typeof value;

        switch (originalType) {
            case 'string':
                const length = Math.max(255, String(value).length);
                if (name.toLowerCase().includes('email')) {
                    column.type = 'VARCHAR(320)';
                } else if (name.toLowerCase().includes('description') || name.toLowerCase().includes('content')) {
                    column.type = 'TEXT';
                } else if (String(value).match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
                    column.type = 'DATETIME';
                } else if (String(value).match(/^\d{4}-\d{2}-\d{2}$/)) {
                    column.type = 'DATE';
                } else {
                    column.type = `VARCHAR(${length})`;
                }
                break;
            case 'number':
                if (Number.isInteger(value)) {
                    if (name.toLowerCase().includes('id')) {
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
                } else if (Array.isArray(value)) {
                    column.type = 'JSON';
                } else {
                    column.type = 'JSON';
                }
                break;
        }

        return column;
    }

    private buildCreateTable(columns: Array<{ name: string; type: string; nullable: boolean; default?: any }>): string {
        const columnDefs = columns.map(col => {
            let def = `${col.name} ${col.type}`;
            if (!col.nullable && !col.type.includes('AUTO_INCREMENT')) {
                def += ' NOT NULL';
            }
            return def;
        }).join(',\n            ');

        return `CREATE TABLE \`${this.options.tableName}\` (
            ${columnDefs}
        ) ENGINE=${this.options.engine} DEFAULT CHARSET=${this.options.charset};`;
    }

    private buildDropTable(): string {
        return `DROP TABLE IF EXISTS \`${this.options.tableName}\`;`;
    }

    private buildInsertData(data: Record<string, any>[]): string {
        if (data.length === 0) return '';

        const columns = Object.keys(data[0]).filter(key => !['created_at', 'updated_at'].includes(key));
        let inserts: string[] = [];

        if (this.options.batchSize && data.length > this.options.batchSize) {
            // Split into batches
            for (let i = 0; i < data.length; i += this.options.batchSize) {
                const batch = data.slice(i, i + this.options.batchSize);
                inserts.push(this.buildBatchInsert(batch, columns));
            }
        } else {
            inserts.push(this.buildBatchInsert(data, columns));
        }

        return inserts.join('\n');
    }

    private buildBatchInsert(data: Record<string, any>[], columns: string[]): string {
        const values = data.map(item =>
            `(${columns.map(col => this.formatValue(item[col])).join(', ')})`
        ).join(',\n            ');

        return `INSERT INTO \`${this.options.tableName}\` (${columns.map(c => `"${c}"`).join(', ')}) VALUES\n            ${values};`;
    }

    private buildDeleteData(): string {
        // Simple delete - in a real scenario, you'd want more sophisticated logic
        return `DELETE FROM \`${this.options.tableName}\`;`;
    }

    private formatValue(value: any): string {
        if (value === null || value === undefined) {
            return 'NULL';
        }

        const serialized = this.serializer.serialize(value);
        if (serialized === null || serialized === undefined) {
            return 'NULL';
        }

        if (typeof serialized === 'string') {
            return `'${serialized.replace(/'/g, "''")}'`;
        }

        if (typeof serialized === 'boolean') {
            return serialized ? '1' : '0';
        }

        return String(serialized);
    }
}
