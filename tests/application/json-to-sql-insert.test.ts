import { describe, it, expect } from 'vitest';
import { JsonToSqlInsertBuilder } from '../../application/json-to-sql-insert';
import { DefaultJsonToFormDataSerializer } from '../../infrastructure/json/default-json-to-formdata-serializer';

describe('JsonToSqlInsertBuilder', () => {
    it('builds single insert from simple object', () => {
        const serializer = new DefaultJsonToFormDataSerializer();

        const builder = new JsonToSqlInsertBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        const sql = builder.build({ id: 1, name: 'John', email: 'john@example.com' });
        expect(sql).toBe("INSERT INTO `users` (`email`, `id`, `name`) VALUES ('john@example.com', '1', 'John');");
    });

    it('builds insert with custom quote style', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlInsertBuilder({
            serializer,
            options: { tableName: 'users', quoteStyle: 'double' }
        });

        const sql = builder.build({ name: 'John' });
        expect(sql).toBe("INSERT INTO `users` (`name`) VALUES ('John');");
    });

    it('excludes null values when includeNulls is false', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlInsertBuilder({
            serializer,
            options: { tableName: 'users', includeNulls: false }
        });

        const sql = builder.build({ id: 1, name: 'John', email: null });
        expect(sql).toBe("INSERT INTO `users` (`id`, `name`) VALUES ('1', 'John');");
    });

    it('includes null values when includeNulls is true', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlInsertBuilder({
            serializer,
            options: { tableName: 'users', includeNulls: true }
        });

        const sql = builder.build({ id: 1, name: 'John', email: null });
        expect(sql).toBe("INSERT INTO `users` (`email`, `id`, `name`) VALUES (NULL, '1', 'John');");
    });

    it('builds bulk insert from array', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlInsertBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        const data = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ];

        const sql = builder.build(data);
        expect(sql).toBe(`INSERT INTO \`users\` (\`id\`, \`name\`) VALUES\n            ('1', 'John');\nINSERT INTO \`users\` (\`id\`, \`name\`) VALUES\n            ('2', 'Jane');`);
    });

    it('builds bulk insert with batching', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlInsertBuilder({
            serializer,
            options: { tableName: 'users', batchSize: 1 }
        });

        const data = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ];

        const sql = builder.build(data);
        expect(sql).toBe(`INSERT INTO \`users\` (\`id\`, \`name\`) VALUES\n            ('1', 'John');\nINSERT INTO \`users\` (\`id\`, \`name\`) VALUES\n            ('2', 'Jane');`);
    });

    it('handles boolean values correctly', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlInsertBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        const sql = builder.build({ active: true, deleted: false });
        expect(sql).toBe("INSERT INTO `users` (`active`, `deleted`) VALUES (1, 0);");
    });

    it('escapes single quotes in strings', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlInsertBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        const sql = builder.build({ name: "O'Connor" });
        expect(sql).toBe("INSERT INTO `users` (`name`) VALUES ('O''Connor');");
    });

    it('handles empty array', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlInsertBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        const sql = builder.build([]);
        expect(sql).toBe('');
    });
});
