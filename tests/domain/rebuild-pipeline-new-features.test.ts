import { describe, it, expect } from 'vitest';
import { DataReBuilder } from '../../core/domain/data-rebuilder';
import { EntrySource } from '../../core/interfaces/entry-source';

class SimpleEntrySource implements EntrySource<string, any> {
    constructor(private data: Record<string, any>) {}

    entries(): Iterable<[string, any]> {
        return Object.entries(this.data);
    }
}

describe('RebuildPipeline new features integration', () => {
    const sampleData = {
        id: 1,
        name: 'João Silva',
        email: 'joao.silva@email.com',
        age: 30,
        active: true,
        created_at: '2024-01-15T10:30:00Z',
        profile: {
            bio: 'Desenvolvedor Full Stack',
            skills: ['JavaScript', 'TypeScript', 'React']
        }
    };

    it('converts to SQL INSERT', () => {
        const service = new DataReBuilder();
        const pipeline = service.rebuildFrom(new SimpleEntrySource(sampleData));
        const sql = pipeline.toSqlInsert({
            tableName: 'users',
            includeNulls: false
        });

        expect(sql).toContain('INSERT INTO `users`');
        expect(sql).toContain('João Silva');
        expect(sql).toContain('joao.silva@email.com');
        expect(sql).toContain('1');
        expect(sql).toContain('1'); // boolean true becomes 1
    });

    it('converts to SQL UPDATE', () => {
        const service = new DataReBuilder();
        const pipeline = service.rebuildFrom(new SimpleEntrySource(sampleData));
        const sql = pipeline.toSqlUpdate({
            tableName: 'users',
            primaryKey: 'id'
        });

        expect(sql).toContain('UPDATE `users` SET');
        expect(sql).toContain('name = \'João Silva\'');
        expect(sql).toContain('WHERE `id` = \'1\'');
    });

    it('converts to SQL CREATE TABLE', () => {
        const service = new DataReBuilder();
        const pipeline = service.rebuildFrom(new SimpleEntrySource(sampleData));
        const sql = pipeline.toSqlCreateTable({
            tableName: 'users',
            primaryKey: 'id'
        });

        expect(sql).toContain('CREATE TABLE `users`');
        expect(sql).toContain('`id` INT AUTO_INCREMENT PRIMARY KEY');
        expect(sql).toContain('`name` VARCHAR(255)');
        expect(sql).toContain('`email` VARCHAR(320)');
        expect(sql).toContain('`age` INT');
        expect(sql).toContain('`active` TINYINT(1)');
        expect(sql).toContain('`created_at` DATETIME');
        expect(sql).toContain('`profile` JSON');
    });

    it('converts to XML', () => {
        const service = new DataReBuilder();
        const pipeline = service.rebuildFrom(new SimpleEntrySource(sampleData));
        const xml = pipeline.toXml({
            rootElement: 'user',
            indent: true
        });

        expect(xml).toContain('<user>');
        expect(xml).toContain('<name>João Silva</name>');
        expect(xml).toContain('<email>joao.silva@email.com</email>');
        expect(xml).toContain('<profile>');
        expect(xml).toContain('<bio>Desenvolvedor Full Stack</bio>');
        expect(xml).toContain('<item>JavaScript</item>');
        expect(xml).toContain('<item>JavaScript</item>');
    });

    it('converts to YAML', () => {
        const service = new DataReBuilder();
        const pipeline = service.rebuildFrom(new SimpleEntrySource(sampleData));
        const yaml = pipeline.toYaml();

        expect(yaml).toContain('name: João Silva');
        expect(yaml).toContain('email: joao.silva@email.com');
        expect(yaml).toContain('profile:');
        expect(yaml).toContain('  bio: Desenvolvedor Full Stack');
        expect(yaml).toContain('  skills:');
        expect(yaml).toContain('  - JavaScript');
        expect(yaml).toContain('  - TypeScript');
        expect(yaml).toContain('  - React');
    });

    it('converts to JSON Schema', () => {
        const service = new DataReBuilder();
        const pipeline = service.rebuildFrom(new SimpleEntrySource(sampleData));
        const schema = pipeline.toJsonSchema({
            title: 'User Schema',
            strictMode: true
        });

        expect(schema.title).toBe('User Schema');
        expect(schema.type).toBe('object');
        expect(schema.properties!.name.type).toBe('string');
        expect(schema.properties!.email.format).toBe('email');
        expect(schema.properties!.age.type).toBe('integer');
        expect(schema.properties!.active.type).toBe('boolean');
        expect(schema.properties!.created_at.format).toBe('date-time');
        expect(schema.properties!.profile.type).toBe('object');
        expect(schema.required).toContain('id');
        expect(schema.required).toContain('name');
    });

    it('converts to Database Migration', () => {
        const service = new DataReBuilder();
        const pipeline = service.rebuildFrom(new SimpleEntrySource(sampleData));
        const migration = pipeline.toDatabaseMigration({
            tableName: 'users',
            includeData: true
        });

        expect(migration.name).toContain('create_users_table');
        expect(migration.up).toContain('CREATE TABLE `users`');
        expect(migration.up).toContain('INSERT INTO `users`');
        expect(migration.up).toContain('João Silva');
        expect(migration.down).toContain('DROP TABLE IF EXISTS `users`');
    });

    it('converts to OpenAPI Spec', () => {
        const service = new DataReBuilder();
        const pipeline = service.rebuildFrom(new SimpleEntrySource(sampleData));
        const spec = pipeline.toOpenApiSpec({
            title: 'User Management API',
            version: '1.0.0',
            endpoint: '/api/users',
            method: 'POST',
            summary: 'Create new user'
        });

        expect(spec.openapi).toBe('3.0.3');
        expect(spec.info.title).toBe('User Management API');
        expect(spec.info.version).toBe('1.0.0');
        expect(spec.paths).toHaveProperty('/api/users');
        expect(spec.paths['/api/users'].post.summary).toBe('Create new user');
        expect(spec.components!.schemas).toHaveProperty('Data');
        expect(spec.components!.schemas!['Data'].properties!.email.format).toBe('email');
    });

    it('handles array data for SQL operations', () => {
        const service = new DataReBuilder();
        const arrayData = [
            { id: 1, name: 'João' },
            { id: 2, name: 'Maria' }
        ];

        const pipeline = service.rebuildFrom(new SimpleEntrySource({ data: arrayData }));
        const sql = pipeline.toSqlInsert({ tableName: 'users' });

        expect(sql).toContain('INSERT INTO `users`');
    });

    it('handles array data for JSON Schema', () => {
        const service = new DataReBuilder();
        const arrayData = [
            { id: 1, name: 'João' },
            { id: 2, name: 'Maria' }
        ];

        const pipeline = service.rebuildFrom(new SimpleEntrySource({ data: arrayData }));
        const schema = pipeline.toJsonSchema();

        expect(schema.type).toBe('object');
        expect(schema.properties!.data.type).toBe('array');
    });

    it('handles array data for XML conversion', () => {
        const service = new DataReBuilder();
        const arrayData = [
            { id: 1, name: 'João' },
            { id: 2, name: 'Maria' }
        ];

        const pipeline = service.rebuildFrom(new SimpleEntrySource({ data: arrayData }));
        const xml = pipeline.toXml({ rootElement: 'users' });

        expect(xml).toContain('<users>');
        expect(xml).toContain('<item>');
    });

    it('works with SimpleEntrySource', () => {
        const service = new DataReBuilder();
        const entrySource = new SimpleEntrySource(sampleData);
        const pipeline = service.rebuildFrom(entrySource);

        const sql = pipeline.toSqlInsert({ tableName: 'users' });
        expect(sql).toContain('INSERT INTO `users`');
        expect(sql).toContain('João Silva');
    });

    it('maintains pipeline chaining with new methods', () => {
        const service = new DataReBuilder();
        const pipeline = service.rebuildFrom(new SimpleEntrySource(sampleData));

        // Test chaining multiple operations
        const sql = pipeline.toSqlInsert({ tableName: 'users' });
        const xml = pipeline.toXml();

        expect(sql).toContain('INSERT INTO `users`');
        expect(xml).toContain('<name>João Silva</name>');
    });
});
