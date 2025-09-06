import { describe, it, expect } from 'vitest';
import { JsonToSqlUpdateBuilder } from '../../application/json-to-sql-update';
import { DefaultJsonToFormDataSerializer } from '../../infrastructure/json/default-json-to-formdata-serializer';

describe('JsonToSqlUpdateBuilder', () => {
    it('builds update with primary key', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlUpdateBuilder({
            serializer,
            options: { tableName: 'users', primaryKey: 'id' }
        });

        const sql = builder.build({ id: 1, name: 'John', email: 'john@example.com' });
        expect(sql).toBe("UPDATE `users` SET `email` = 'john@example.com', `name` = 'John' WHERE `id` = '1';");
    });

    it('builds update with custom where clause', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlUpdateBuilder({
            serializer,
            options: { tableName: 'users', whereClause: 'status = \'active\'' }
        });

        const sql = builder.build({ name: 'John' });
        expect(sql).toBe("UPDATE `users` SET `name` = 'John' WHERE status = 'active';");
    });

    it('excludes null values when includeNulls is false', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlUpdateBuilder({
            serializer,
            options: { tableName: 'users', primaryKey: 'id', includeNulls: false }
        });

        const sql = builder.build({ id: 1, name: 'John', email: null });
        expect(sql).toBe("UPDATE `users` SET `name` = 'John' WHERE `id` = '1';");
    });

    it('includes null values when includeNulls is true', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlUpdateBuilder({
            serializer,
            options: { tableName: 'users', primaryKey: 'id', includeNulls: true }
        });

        const sql = builder.build({ id: 1, name: 'John', email: null });
        expect(sql).toBe("UPDATE `users` SET `email` = NULL, `name` = 'John' WHERE `id` = '1';");
    });

    it('builds bulk update from array', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlUpdateBuilder({
            serializer,
            options: { tableName: 'users', primaryKey: 'id' }
        });

        const data = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ];

        const sql = builder.build(data);
        expect(sql).toBe("UPDATE `users` SET `name` = 'John' WHERE `id` = '1';\nUPDATE `users` SET `name` = 'Jane' WHERE `id` = '2';");
    });

    it('throws error when no where clause or primary key provided', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlUpdateBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        expect(() => builder.build({ name: 'John' })).toThrow('Either whereClause or primaryKey must be provided');
    });

    it('throws error for bulk update without primary key', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlUpdateBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        const data = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' }
        ];

        expect(() => builder.build(data)).toThrow('primaryKey is required for bulk UPDATE operations');
    });

    it('throws error for bulk update with missing primary key in data', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlUpdateBuilder({
            serializer,
            options: { tableName: 'users', primaryKey: 'id' }
        });

        const data = [
            { name: 'John' }, // missing id
            { id: 2, name: 'Jane' }
        ];

        expect(() => builder.build(data)).toThrow('Primary key id is required for all items in bulk update');
    });

    it('handles boolean values correctly', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlUpdateBuilder({
            serializer,
            options: { tableName: 'users', primaryKey: 'id' }
        });

        const sql = builder.build({ id: 1, active: true });
        expect(sql).toBe("UPDATE `users` SET `active` = 1 WHERE `id` = '1';");
    });

    it('skips primary key from SET clause', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToSqlUpdateBuilder({
            serializer,
            options: { tableName: 'users', primaryKey: 'id' }
        });

        const sql = builder.build({ id: 1, name: 'John' });
        expect(sql).toBe("UPDATE `users` SET `name` = 'John' WHERE `id` = '1';");
    });
});
