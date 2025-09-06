import { describe, it, expect } from 'vitest';
import { JsonToDatabaseMigrationBuilder } from '../../application/json-to-database-migration';
import { DefaultJsonToFormDataSerializer } from '../../infrastructure/json/default-json-to-formdata-serializer';

describe('JsonToDatabaseMigrationBuilder', () => {
    it('builds complete migration from object', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users', migrationName: 'create_users_table' }
        });

        const migration = builder.build({ id: 1, name: 'John', email: 'john@example.com' });

        expect(migration.name).toBe('create_users_table');
        expect(migration.up).toContain('CREATE TABLE `users`');
        expect(migration.up).toContain('id INT AUTO_INCREMENT PRIMARY KEY');
        expect(migration.up).toContain('name VARCHAR(255)');
        expect(migration.up).toContain('email VARCHAR(320)');
        expect(migration.down).toContain('DROP TABLE IF EXISTS `users`');
    });

    it('includes data when specified', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users', includeData: true }
        });

        const migration = builder.build({ id: 1, name: 'John' });

        expect(migration.up).toContain('INSERT INTO `users`');
        expect(migration.up).toContain("VALUES\n            ('1', 'John')");
    });

    it('handles array data with batching', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users', includeData: true, batchSize: 2 }
        });

        const data = [
            { id: 1, name: 'John' },
            { id: 2, name: 'Jane' },
            { id: 3, name: 'Bob' }
        ];

        const migration = builder.build(data);

        expect(migration.up).toContain('INSERT INTO `users`');
        expect(migration.up).toContain("VALUES\n            ('1', 'John'),\n            ('2', 'Jane')");
        expect(migration.up).toContain("VALUES\n            ('3', 'Bob')");
    });

    it('adds timestamps automatically', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        const migration = builder.build({ id: 1, name: 'John' });

        expect(migration.up).toContain('created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL');
        expect(migration.up).toContain('updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL');
    });

    it('handles different data types correctly', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'test' }
        });

        const migration = builder.build({
            id: 1,
            name: 'John',
            active: true,
            score: 95.5,
            created_at: '2024-01-01T00:00:00Z'
        });

        expect(migration.up).toContain('id INT AUTO_INCREMENT PRIMARY KEY');
        expect(migration.up).toContain('name VARCHAR(255)');
        expect(migration.up).toContain('active TINYINT(1)');
        expect(migration.up).toContain('score DECIMAL(10,2)');
        expect(migration.up).toContain('created_at DATETIME');
    });

    it('handles email fields with proper length', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        const migration = builder.build({ email: 'john@example.com' });

        expect(migration.up).toContain('email VARCHAR(320)');
    });

    it('handles text fields for long content', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'posts' }
        });

        const migration = builder.build({
            title: 'Short',
            description: 'A very long description...',
            content: 'Even longer content...'
        });

        expect(migration.up).toContain('description TEXT');
        expect(migration.up).toContain('content TEXT');
    });

    it('includes custom engine and charset', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users', engine: 'MyISAM', charset: 'utf8' }
        });

        const migration = builder.build({ id: 1 });

        expect(migration.up).toContain('ENGINE=MyISAM');
        expect(migration.up).toContain('DEFAULT CHARSET=utf8');
    });

    it('handles JSON data type', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        const migration = builder.build({ preferences: { theme: 'dark' } });

        expect(migration.up).toContain('preferences JSON');
    });

    it('includes timestamp in migration name', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        const migration = builder.build({ id: 1 });

        expect(migration.timestamp).toMatch(/^\d{8}_\d{6}$/);
    });

    it('handles down migration correctly', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users', upDirection: false, downDirection: true }
        });

        const migration = builder.build({ id: 1 });

        expect(migration.up).toBe('');
        expect(migration.down).toContain('DROP TABLE IF EXISTS `users`');
    });

    it('throws error for empty array', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users' }
        });

        expect(() => builder.build([])).toThrow('Cannot create migration from empty array');
    });

    it('escapes single quotes in data', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToDatabaseMigrationBuilder({
            serializer,
            options: { tableName: 'users', includeData: true }
        });

        const migration = builder.build({ name: "O'Connor" });

        expect(migration.up).toContain("O''Connor");
    });
});
