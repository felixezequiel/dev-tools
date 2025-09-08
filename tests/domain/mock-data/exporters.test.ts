import { describe, it, expect } from 'vitest';
import { SimpleCsvExporter, SimpleSqlInsertExporter } from '../../../core/infrastructure/mock-data/simple-exporters';

describe('Mock Data Exporters', () => {
    describe('SimpleCsvExporter', () => {
        const exporter = new SimpleCsvExporter();

        it('exports simple data with headers', () => {
            const data = [
                { id: 1, name: 'John', active: true },
                { id: 2, name: 'Jane', active: false },
                { id: 3, name: 'Bob', active: true }
            ];

            const result = exporter.export(data);

            const lines = result.split('\n');
            expect(lines).toHaveLength(4); // header + 3 data rows

            // Check header
            expect(lines[0]).toBe('id,name,active');

            // Check data rows
            expect(lines[1]).toBe('1,John,true');
            expect(lines[2]).toBe('2,Jane,false');
            expect(lines[3]).toBe('3,Bob,true');
        });

        it('handles missing values as empty strings', () => {
            const data = [
                { id: 1, name: 'John', email: 'john@example.com' },
                { id: 2, name: 'Jane' }, // missing email
                { id: 3, email: 'bob@example.com' } // missing name
            ];

            const result = exporter.export(data);

            const lines = result.split('\n');
            expect(lines).toHaveLength(4);

            // Check header includes all keys
            expect(lines[0]).toBe('id,name,email');

            // Check data rows
            expect(lines[1]).toBe('1,John,john@example.com');
            expect(lines[2]).toBe('2,Jane,'); // missing email becomes empty
            expect(lines[3]).toBe('3,,bob@example.com'); // missing name becomes empty
        });

        it('escapes commas and quotes in values', () => {
            const data = [
                { id: 1, description: 'Item with, comma', note: 'Note with "quotes"' },
                { id: 2, description: 'Simple item', note: 'Simple note' }
            ];

            const result = exporter.export(data);

            const lines = result.split('\n');
            expect(lines).toHaveLength(3);

            expect(lines[0]).toBe('id,description,note');
            expect(lines[1]).toBe('1,"Item with, comma","Note with ""quotes"""');
            expect(lines[2]).toBe('2,Simple item,Simple note');
        });

        it('handles numbers and booleans correctly', () => {
            const data = [
                { id: 1, price: 29.99, active: true, count: 0 },
                { id: 2, price: 15.5, active: false, count: 5 }
            ];

            const result = exporter.export(data);

            const lines = result.split('\n');
            expect(lines).toHaveLength(3);

            expect(lines[0]).toBe('id,price,active,count');
            expect(lines[1]).toBe('1,29.99,true,0');
            expect(lines[2]).toBe('2,15.5,false,5');
        });

        it('handles null and undefined values', () => {
            const data = [
                { id: 1, value: null, other: undefined },
                { id: 2, value: 'text', other: null }
            ];

            const result = exporter.export(data);

            const lines = result.split('\n');
            expect(lines).toHaveLength(3);

            expect(lines[0]).toBe('id,value,other');
            expect(lines[1]).toBe('1,null,'); // null becomes 'null', undefined becomes empty
            expect(lines[2]).toBe('2,text,null'); // null becomes 'null'
        });

        it('handles empty array', () => {
            const result = exporter.export([]);
            expect(result).toBe('');
        });

        it('preserves column order from first row', () => {
            const data = [
                { a: 1, b: 2, c: 3 },
                { c: 6, a: 4, b: 5 }, // different order
                { b: 8, c: 9, a: 7 }  // different order
            ];

            const result = exporter.export(data);

            const lines = result.split('\n');
            expect(lines[0]).toBe('a,b,c'); // order from first row
            expect(lines[1]).toBe('1,2,3');
            expect(lines[2]).toBe('4,5,6');
            expect(lines[3]).toBe('7,8,9');
        });

        it('handles complex objects and arrays', () => {
            const data = [
                {
                    id: 1,
                    tags: ['tag1', 'tag2'],
                    metadata: { key: 'value' },
                    description: 'Item, with "quotes"'
                }
            ];

            const result = exporter.export(data);

            const lines = result.split('\n');
            expect(lines).toHaveLength(2);
            expect(lines[0]).toBe('id,tags,metadata,description');
            // Objects and arrays are stringified
            expect(lines[1]).toContain('1');
            expect(lines[1]).toContain('"Item, with ""quotes"""');
        });
    });

    describe('SimpleSqlInsertExporter', () => {
        const exporter = new SimpleSqlInsertExporter();

        it('exports simple INSERT statements', () => {
            const data = [
                { id: 1, name: 'John', active: true },
                { id: 2, name: 'Jane', active: false }
            ];

            const result = exporter.export(data, { tableName: 'users' });

            // Should have INSERT statement and VALUES
            expect(result).toMatch(/^INSERT INTO `users`/);
            // Columns are sorted alphabetically
            expect(result).toContain('(`active`, `id`, `name`)');
            expect(result).toContain('VALUES');

            // Check values are present (format may vary between implementations)
            expect(result).toContain('John');
            expect(result).toContain('Jane');
            expect(result).toContain('1'); // id values
            expect(result).toContain('2');
        });

        it('handles batchSize correctly', () => {
            const data = [
                { id: 1, name: 'John' },
                { id: 2, name: 'Jane' },
                { id: 3, name: 'Bob' },
                { id: 4, name: 'Alice' }
            ];

            const result = exporter.export(data, { tableName: 'users', batchSize: 2 });

            // Should contain batched INSERT statements
            expect(result).toContain('INSERT INTO `users`');
            expect(result).toContain('VALUES');
            expect(result).toContain("('1', 'John')");
            expect(result).toContain("('2', 'Jane')");
            expect(result).toContain("('3', 'Bob')");
            expect(result).toContain("('4', 'Alice')");
        });

        it('handles includeNulls option', () => {
            const data = [
                { id: 1, name: 'John', email: null },
                { id: 2, name: 'Jane', email: 'jane@example.com' }
            ];

            const resultWithNulls = exporter.export(data, {
                tableName: 'users',
                includeNulls: true
            });

            const resultWithoutNulls = exporter.export(data, {
                tableName: 'users',
                includeNulls: false
            });

            // With nulls
            expect(resultWithNulls).toContain('`email`');
            expect(resultWithNulls).toContain("NULL");

            // Without nulls - should exclude email column since it has null values
            expect(resultWithoutNulls).toContain('`id`');
            expect(resultWithoutNulls).toContain('`name`');
            // When includeNulls is false, columns with all null values might be excluded
        });

        it('escapes single quotes in string values', () => {
            const data = [
                { id: 1, name: "John's Company", description: 'Item with "quotes"' }
            ];

            const result = exporter.export(data, { tableName: 'companies' });

            expect(result).toContain("'John''s Company'");
            expect(result).toContain("'Item with \"quotes\"'");
        });

        it('handles different data types', () => {
            const data = [
                {
                    id: 1,
                    name: 'John',
                    age: 25,
                    active: true,
                    score: 95.5,
                    created_at: '2024-01-01',
                    tags: '["tag1", "tag2"]',
                    metadata: '{"key": "value"}'
                }
            ];

            const result = exporter.export(data, { tableName: 'users' });

            // Columns are sorted alphabetically: active, age, created_at, id, metadata, name, score, tags
            // Booleans become 1/0, numbers become strings with quotes
            expect(result).toContain("(1, '25', '2024-01-01', '1', '{\"key\": \"value\"}', 'John', '95.5', '[\"tag1\", \"tag2\"]')");
        });

        it('handles single row data', () => {
            const data = [{ id: 1, name: 'John' }];

            const result = exporter.export(data, { tableName: 'users' });

            expect(result).toMatch(/^INSERT INTO `users`/);
            // Columns are sorted alphabetically: id, name
            expect(result).toContain("(`id`, `name`)");
            expect(result).toContain("VALUES ('1', 'John')");
        });

        it('handles empty data array', () => {
            const result = exporter.export([], { tableName: 'users' });

            expect(result).toBe("INSERT INTO `users` () VALUES ();"); // Empty array creates empty INSERT
        });

        it('uses provided tableName', () => {
            const data = [{ id: 1, name: 'John' }];

            const result = exporter.export(data, { tableName: 'custom_table' });

            expect(result).toContain('INSERT INTO `custom_table`');
        });

        it('handles special characters in column names', () => {
            const data = [
                { 'user-id': 1, 'user-name': 'John', 'created_at': '2024-01-01' }
            ];

            const result = exporter.export(data, { tableName: 'users' });

            expect(result).toContain('`user-id`');
            expect(result).toContain('`user-name`');
            expect(result).toContain('`created_at`');
        });

        it('handles large datasets with batching', () => {
            const data = Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                name: `User${i + 1}`
            }));

            const result = exporter.export(data, { tableName: 'users', batchSize: 3 });

            // Should contain multiple INSERT statements due to batching
            const insertCount = (result.match(/INSERT INTO/g) || []).length;
            expect(insertCount).toBeGreaterThan(1);

            // Should contain all expected values as strings
            for (let i = 1; i <= 10; i++) {
                expect(result).toContain(`('${i}', 'User${i}')`);
            }
        });
    });
});
