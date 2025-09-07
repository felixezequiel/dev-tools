import { describe, it, expect } from 'vitest';
import { JsonToOpenApiBuilder } from '../../core/domain/json-to-openapi';
import { DefaultJsonToFormDataSerializer } from '../../core/infrastructure/json/default-json-to-formdata-serializer';

describe('JsonToOpenApiBuilder', () => {
    it('builds OpenAPI spec from object', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: {
                title: 'User API',
                version: '1.0.0',
                endpoint: '/api/users',
                method: 'POST'
            }
        });

        const spec = builder.build({ id: 1, name: 'John', email: 'john@example.com' });

        expect(spec.openapi).toBe('3.0.3');
        expect(spec.info.title).toBe('User API');
        expect(spec.info.version).toBe('1.0.0');
        expect(spec.paths).toHaveProperty('/api/users');
        expect(spec.paths['/api/users']).toHaveProperty('post');
        expect(spec.components!.schemas).toHaveProperty('Data');
    });

    it('generates correct operation spec', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: {
                endpoint: '/api/users',
                method: 'POST',
                summary: 'Create user',
                operationId: 'createUser'
            }
        });

        const spec = builder.build({ name: 'John' });

        const operation = spec.paths['/api/users'].post;
        expect(operation.summary).toBe('Create user');
        expect(operation.operationId).toBe('createUser');
        expect(operation.requestBody).toBeDefined();
        expect(operation.responses).toHaveProperty('200');
    });

    it('generates schema with correct types', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: { endpoint: '/api/users' }
        });

        const spec = builder.build({
            id: 1,
            name: 'John',
            age: 30,
            active: true,
            email: 'john@example.com'
        });

        const schema = spec.components!.schemas!['Test'];
        expect(schema.type).toBe('object');
        expect(schema.properties!.id.type).toBe('integer');
        expect(schema.properties!.name.type).toBe('string');
        expect(schema.properties!.age.type).toBe('integer');
        expect(schema.properties!.active.type).toBe('boolean');
        expect(schema.properties!.email.format).toBe('email');
    });

    it('handles array data', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: { endpoint: '/api/users' }
        });

        const spec = builder.build([{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);

        const schema = spec.components!.schemas!['Test'];
        expect(schema.type).toBe('array');
        expect(schema.items.type).toBe('object');
        expect(schema.items.properties).toHaveProperty('id');
        expect(schema.items.properties).toHaveProperty('name');
    });

    it('generates path parameters for dynamic endpoints', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: {
                endpoint: '/api/users/{id}',
                method: 'GET'
            }
        });

        const spec = builder.build({ id: 1, name: 'John' });

        const operation = spec.paths['/api/users/{id}'].get;
        expect(operation.parameters).toHaveLength(1);
        expect(operation.parameters[0].name).toBe('id');
        expect(operation.parameters[0].in).toBe('path');
        expect(operation.parameters[0].required).toBe(true);
    });

    it('handles different HTTP methods correctly', () => {
        const serializerPost = new DefaultJsonToFormDataSerializer();
        const postBuilder = new JsonToOpenApiBuilder({
            serializer: serializerPost,
            options: { endpoint: '/api/users', method: 'POST' }
        });
        const serializerGet = new DefaultJsonToFormDataSerializer();

        const getBuilder = new JsonToOpenApiBuilder({
            serializer: serializerGet,
            options: { endpoint: '/api/users', method: 'GET' }
        });

        const postSpec = postBuilder.build({ name: 'John' });
        const getSpec = getBuilder.build({ name: 'John' });

        expect(postSpec.paths['/api/users'].post.requestBody).toBeDefined();
        expect(getSpec.paths['/api/users'].get.parameters).toBeUndefined();
    });

    it('includes tags when specified', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: {
                endpoint: '/api/users',
                tags: ['Users', 'Management']
            }
        });

        const spec = builder.build({ name: 'John' });

        expect(spec.paths['/api/users'].post.tags).toEqual(['Users', 'Management']);
    });

    it('detects date formats', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: { endpoint: '/api/users' }
        });

        const spec = builder.build({
            created_at: '2024-01-01T00:00:00Z',
            birth_date: '1990-01-01'
        });

        const schema = spec.components!.schemas!['Test'];
        expect(schema.properties!.created_at.format).toBe('date-time');
        expect(schema.properties!.birth_date.format).toBe('date');
    });

    it('handles nested objects', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: { endpoint: '/api/users' }
        });

        const spec = builder.build({
            name: 'John',
            profile: {
                bio: 'Developer',
                skills: ['JS', 'TS']
            }
        });

        const schema = spec.components!.schemas!['Test'];
        expect(schema.properties!.profile.type).toBe('object');
        expect(schema.properties!.profile.properties!.bio.type).toBe('string');
        expect(schema.properties!.profile.properties!.skills.type).toBe('array');
    });

    it('generates required fields', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: { endpoint: '/api/users' }
        });

        const spec = builder.build({
            id: 1,
            name: 'John',
            email: null // This should not be required
        });

        const schema = spec.components!.schemas!['Test'];
        expect(schema.required).toContain('id');
        expect(schema.required).toContain('name');
        expect(schema.required).not.toContain('email');
    });

    it('handles UUID format detection', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: { endpoint: '/api/users' }
        });

        const uuid = '550e8400-e29b-41d4-a716-446655440000';
        const spec = builder.build({ session_id: uuid });

        const schema = spec.components!.schemas!['Test'];
        expect(schema.properties!.session_id.format).toBe('uuid');
    });

    it('handles URI format detection', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: { endpoint: '/api/users' }
        });

        const spec = builder.build({ website: 'https://example.com' });

        const schema = spec.components!.schemas!['Test'];
        expect(schema.properties!.website.format).toBe('uri');
    });

    it('generates schema name from endpoint', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToOpenApiBuilder({
            serializer,
            options: { endpoint: '/api/user-profiles' }
        });

        const spec = builder.build({ name: 'John' });

        expect(spec.components!.schemas).toHaveProperty('UserProfile');
    });
});
