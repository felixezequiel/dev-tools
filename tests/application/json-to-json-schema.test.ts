import { describe, it, expect } from 'vitest';
import { JsonToJsonSchemaBuilder } from '../../application/json-to-json-schema';
import { DefaultJsonToFormDataSerializer } from '../../infrastructure/json/default-json-to-formdata-serializer';

describe('JsonToJsonSchemaBuilder', () => {
    it('builds schema from simple object', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {}
        });

        const schema = builder.build({ name: 'John', age: 30 });

        expect(schema.type).toBe('object');
        expect(schema.properties).toHaveProperty('name');
        expect(schema.properties).toHaveProperty('age');
        expect(schema.properties!.name.type).toBe('string');
        expect(schema.properties!.age.type).toBe('integer');
    });

    it('includes schema metadata', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {
                title: 'User Schema',
                description: 'Schema for user validation',
                version: 'https://json-schema.org/draft/2020-12/schema'
            }
        });

        const schema = builder.build({ name: 'John' });

        expect(schema.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
        expect(schema.title).toBe('User Schema');
        expect(schema.description).toBe('Schema for user validation');
    });

    it('builds schema from array', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {}
        });

        const schema = builder.build([{ name: 'John' }, { name: 'Jane' }]);

        expect(schema.type).toBe('array');
        expect(schema.items!).toHaveProperty('type', 'object');
        expect(schema.items!.properties).toHaveProperty('name');
    });

    it('handles different data types', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {}
        });

        const schema = builder.build({
            name: 'John',
            age: 30,
            height: 1.75,
            active: true,
            created_at: '2024-01-01T00:00:00Z'
        });

        expect(schema.properties!.name.type).toBe('string');
        expect(schema.properties!.age.type).toBe('integer');
        expect(schema.properties!.height.type).toBe('number');
        expect(schema.properties!.active.type).toBe('boolean');
        expect(schema.properties!.created_at.format).toBe('date-time');
    });

    it('detects email format', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {}
        });

        const schema = builder.build({ email: 'john@example.com' });

        expect(schema.properties!.email.type).toBe('string');
        expect(schema.properties!.email.format).toBe('email');
    });

    it('detects date formats', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {}
        });

        const schema = builder.build({
            date: '2024-01-01',
            datetime: '2024-01-01T00:00:00Z'
        });

        expect(schema.properties!.date.format).toBe('date');
        expect(schema.properties!.datetime.format).toBe('date-time');
    });

    it('handles required fields in strict mode', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: { strictMode: true }
        });

        const schema = builder.build({ name: 'John', age: 30 });

        expect(schema.required).toContain('name');
        expect(schema.required).toContain('age');
    });

    it('uses custom required fields', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: { required: ['name'] }
        });

        const schema = builder.build({ name: 'John', age: 30 });

        expect(schema.required).toEqual(['name']);
    });

    it('sets additionalProperties correctly', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: { additionalProperties: false }
        });

        const schema = builder.build({ name: 'John' });

        expect(schema.additionalProperties).toBe(false);
    });

    it('handles nested objects', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {}
        });

        const schema = builder.build({
            user: {
                name: 'John',
                profile: {
                    bio: 'Developer'
                }
            }
        });

        expect(schema.properties!.user.type).toBe('object');
        expect(schema.properties!.user.properties!.name.type).toBe('string');
        expect(schema.properties!.user.properties!.profile.properties!.bio.type).toBe('string');
    });

    it('handles arrays of objects', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {}
        });

        const schema = builder.build({
            users: [
                { name: 'John', age: 30 },
                { name: 'Jane', age: 25 }
            ]
        });

        expect(schema.properties!.users.type).toBe('array');
        expect(schema.properties!.users.items!.type).toBe('object');
        expect(schema.properties!.users.items!.properties).toHaveProperty('name');
        expect(schema.properties!.users.items!.properties).toHaveProperty('age');
    });

    it('creates union types for mixed arrays', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {}
        });

        const schema = builder.build([1, 'string', true]);

        expect(schema.type).toBe('array');
        expect(schema.items!).toHaveProperty('oneOf');
        expect(schema.items!.oneOf).toHaveLength(3);
    });

    it('handles null values', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {}
        });

        const schema = builder.build({ name: null });

        expect(schema.properties!.name.type).toBe('null');
    });

    it('adds examples to string fields', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToJsonSchemaBuilder({
            serializer,
            options: {}
        });

        const schema = builder.build({ name: 'John Doe' });

        expect(schema.properties!.name.example).toBe('John Doe');
    });
});
