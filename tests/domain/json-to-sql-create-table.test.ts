import { describe, it, expect } from 'vitest';
import { JsonToSqlCreateTableBuilder } from '../../core/domain/converters/json-to-sql-create-table';

describe('JsonToSqlCreateTableBuilder', () => {
    it('builds create table from simple object', () => {
        const builder = new JsonToSqlCreateTableBuilder({
            options: { tableName: 'users' }
        });

        const sql = builder.build({ id: 1, name: 'John', email: 'john@example.com' });
        expect(sql).toContain('CREATE TABLE `users`');
        expect(sql).toContain('`id` INT AUTO_INCREMENT PRIMARY KEY');
        expect(sql).toContain('`name` VARCHAR(255)');
        expect(sql).toContain('`email` VARCHAR(320)');
        expect(sql).toContain('ENGINE=InnoDB');
        expect(sql).toContain('DEFAULT CHARSET=utf8mb4');
    });

    it('adds IF NOT EXISTS when specified', () => {
        const builder = new JsonToSqlCreateTableBuilder({
            options: { tableName: 'users', ifNotExists: true }
        });

        const sql = builder.build({ id: 1 });
        expect(sql).toContain('CREATE TABLE IF NOT EXISTS users');
    });

    it('adds primary key constraint', () => {
        const builder = new JsonToSqlCreateTableBuilder({
            options: { tableName: 'users', primaryKey: 'id' }
        });

        const sql = builder.build({ id: 1, name: 'John' });
        expect(sql).toContain('PRIMARY KEY (id)');
    });

    it('adds composite primary key', () => {
        const builder = new JsonToSqlCreateTableBuilder({
            options: { tableName: 'user_permissions', primaryKey: ['user_id', 'permission_id'] }
        });

        const sql = builder.build({ user_id: 1, permission_id: 'read' });
        expect(sql).toContain('PRIMARY KEY (user_id, permission_id)');
    });

    it('handles different data types correctly', () => {
        const builder = new JsonToSqlCreateTableBuilder({
            options: { tableName: 'test' }
        });

        const sql = builder.build({
            id: 1,
            name: 'John',
            active: true,
            score: 95.5,
            created_at: '2024-01-01T00:00:00Z'
        });

        expect(sql).toContain('`id` INT AUTO_INCREMENT PRIMARY KEY');
        expect(sql).toContain('`name` VARCHAR(255)');
        expect(sql).toContain('`active` TINYINT(1)');
        expect(sql).toContain('`score` DECIMAL(10,2)');
        expect(sql).toContain('`created_at` DATETIME');
    });

    it('uses custom column definitions', () => {
        const builder = new JsonToSqlCreateTableBuilder({
            options: { tableName: 'users' },
            customColumns: {
                id: { name: 'id', type: 'BIGINT AUTO_INCREMENT PRIMARY KEY', nullable: false },
                email: { name: 'email', type: 'VARCHAR(320)', nullable: false }
            }
        });

        const sql = builder.build({ id: 1, name: 'John', email: 'john@example.com' });
        expect(sql).toContain('id BIGINT AUTO_INCREMENT PRIMARY KEY');
        expect(sql).toContain('email VARCHAR(320) NOT NULL');
        expect(sql).toContain('`name` VARCHAR(255)');
    });

    it('adds timestamps automatically', () => {
        const builder = new JsonToSqlCreateTableBuilder({
            options: { tableName: 'users' }
        });

        const sql = builder.build({ id: 1, name: 'John' });
        expect(sql).toContain('created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP');
        expect(sql).toContain('updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    });

    it('handles email fields specially', () => {
        const builder = new JsonToSqlCreateTableBuilder({
            options: { tableName: 'users' }
        });

        const sql = builder.build({ email: 'john@example.com' });
        expect(sql).toContain('email VARCHAR(320)');
    });

    it('handles text fields for long content', () => {
        const builder = new JsonToSqlCreateTableBuilder({
            options: { tableName: 'posts' }
        });

        const sql = builder.build({
            title: 'Short title',
            description: 'A very long description that should be TEXT...',
            content: 'Even longer content that should definitely be TEXT...'
        });

        expect(sql).toContain('description TEXT');
        expect(sql).toContain('content TEXT');
    });

    it('throws error for empty array', () => {
        const builder = new JsonToSqlCreateTableBuilder({
            options: { tableName: 'users' }
        });

        expect(() => builder.build([])).toThrow('Cannot create table from empty array');
    });
});
