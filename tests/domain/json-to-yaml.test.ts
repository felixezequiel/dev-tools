import { describe, it, expect } from 'vitest';
import { JsonToYamlBuilder } from '../../core/domain/json-to-yaml';
import { DefaultJsonToFormDataSerializer } from '../../core/infrastructure/json/default-json-to-formdata-serializer';

describe('JsonToYamlBuilder', () => {
    it('builds yaml from simple object', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: {}
        });

        const yaml = builder.build({ name: 'John', age: 30 });
        expect(yaml).toContain('name: John');
        expect(yaml).toContain('age: 30');
    });

    it('includes version directive when specified', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: { includeVersion: true, version: '1.2' }
        });

        const yaml = builder.build({ name: 'John' });
        expect(yaml).toContain('%YAML 1.2');
        expect(yaml).toContain('---');
    });

    it('handles nested objects', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: {}
        });

        const yaml = builder.build({
            user: {
                name: 'John',
                address: {
                    street: 'Main St',
                    city: 'NYC'
                }
            }
        });

        expect(yaml).toContain('user:');
        expect(yaml).toContain('name: John');
        expect(yaml).toContain('  address:');
        expect(yaml).toContain('    street: Main St');
        expect(yaml).toContain('    city: NYC');
    });

    it('handles arrays', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: {}
        });

        const yaml = builder.build({
            users: [
                { name: 'John' },
                { name: 'Jane' }
            ]
        });

        expect(yaml).toContain('users:');
        expect(yaml).toContain('name: John');
        expect(yaml).toContain('name: Jane');
    });

    it('handles empty array', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: {}
        });

        const yaml = builder.build({ items: [] });
        expect(yaml).toContain('items: []');
    });

    it('handles null and undefined values', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: {}
        });

        const yaml = builder.build({
            name: 'John',
            age: null,
            email: undefined
        });

        expect(yaml).toContain('name: John');
        expect(yaml).toContain('age: null');
        expect(yaml).toContain('email: null');
    });

    it('handles numbers and booleans', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: {}
        });

        const yaml = builder.build({
            count: 42,
            active: true,
            disabled: false
        });

        expect(yaml).toContain('count: 42');
        expect(yaml).toContain('active: true');
        expect(yaml).toContain('disabled: false');
    });

    it('handles dates', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: {}
        });

        const date = new Date('2024-01-15T10:30:00Z');
        const yaml = builder.build({ created_at: date });
        expect(yaml).toContain('created_at: 2024-01-15T10:30:00.000Z');
    });

    it('quotes strings that need it', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: {}
        });

        const yaml = builder.build({
            normal: 'hello',
            with_spaces: 'hello world',
            with_colon: 'hello: world',
            with_dash: '- hello',
            with_brackets: '[hello]',
            with_braces: '{hello}',
            with_pipe: 'hello|world',
            with_gt: '> hello',
            with_hash: '# hello'
        });

        expect(yaml).toContain('normal: hello');
        expect(yaml).toContain('with_spaces: hello world');
        expect(yaml).toContain('with_colon: "hello: world"');
        expect(yaml).toContain('with_dash: "- hello"');
        expect(yaml).toContain('with_brackets: "[hello]"');
        expect(yaml).toContain('with_braces: "{hello}"');
        expect(yaml).toContain('with_pipe: "hello|world"');
        expect(yaml).toContain('with_gt: "> hello"');
        expect(yaml).toContain('with_hash: "# hello"');
    });

    it('handles multiline strings', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: {}
        });

        const yaml = builder.build({
            description: 'This is a\nmultiline\nstring'
        });

        expect(yaml).toContain('description: |');
        expect(yaml).toContain('This is a');
        expect(yaml).toContain('multiline');
        expect(yaml).toContain('string');
    });

    it('handles very long strings', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: { lineWidth: 20 }
        });

        const longString = 'This is a very long string that should be formatted as multiline';
        const yaml = builder.build({ content: longString });

        expect(yaml).toContain('content: |');
    });

    it('uses custom indent size', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: { indent: 4 }
        });

        const yaml = builder.build({
            user: {
                name: 'John'
            }
        });

        expect(yaml).toContain('user:');
        expect(yaml).toContain('    name: John');
    });

    it('handles empty objects', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToYamlBuilder({
            serializer,
            options: {}
        });

        const yaml = builder.build({});
        expect(yaml.trim()).toBe('');
    });
});
