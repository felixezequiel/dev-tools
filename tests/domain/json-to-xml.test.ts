import { describe, it, expect } from 'vitest';
import { JsonToXmlBuilder } from '../../core/domain/converters/json-to-xml';
import { DefaultJsonToFormDataSerializer } from '../../core/infrastructure/json/default-json-to-formdata-serializer';

describe('JsonToXmlBuilder', () => {
    it('builds xml from simple object', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'user' }
        });

        const xml = builder.build({ name: 'John', age: 30 });
        expect(xml).toBe('<user>\n  <name>John</name>\n  <age>30</age>\n</user>\n');
    });

    it('includes xml declaration when specified', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'user', includeDeclaration: true }
        });

        const xml = builder.build({ name: 'John' });
        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    });

    it('handles custom version and encoding', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: {
                rootElement: 'user',
                includeDeclaration: true,
                version: '1.1',
                encoding: 'ISO-8859-1'
            }
        });

        const xml = builder.build({ name: 'John' });
        expect(xml).toContain('<?xml version="1.1" encoding="ISO-8859-1"?>');
    });

    it('handles arrays with custom item element', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'users', itemElement: 'user' }
        });

        const xml = builder.build([{ name: 'John' }, { name: 'Jane' }]);
        expect(xml).toContain('<user>\n  <name>John</name>\n</user>');
        expect(xml).toContain('<user>\n  <name>Jane</name>\n</user>');
    });

    it('handles nested objects', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'user' }
        });

        const xml = builder.build({
            name: 'John',
            address: {
                street: 'Main St',
                city: 'NYC'
            }
        });

        expect(xml).toContain('<address>');
        expect(xml).toContain('<street>Main St</street>');
        expect(xml).toContain('<city>NYC</city>');
    });

    it('handles attributes with @ prefix', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'user', attributePrefix: '@' }
        });

        const xml = builder.build({
            '@id': '123',
            name: 'John'
        });

        expect(xml).toBe('<user id="123">\n  <name>John</name>\n</user>\n');
    });

    it('escapes xml special characters', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'user' }
        });

        const xml = builder.build({
            content: 'Text with <tags> & "quotes"'
        });

        expect(xml).toContain('<content>Text with &lt;tags&gt; &amp; &quot;quotes&quot;</content>');
    });

    it('handles null and undefined values', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'user' }
        });

        const xml = builder.build({
            name: 'John',
            age: null,
            email: undefined
        });

        expect(xml).toContain('<name>John</name>');
        expect(xml).toContain('<age/>');
        expect(xml).toContain('<email/>');
    });

    it('handles empty objects', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'user' }
        });

        const xml = builder.build({});
        expect(xml).toBe('<user/>\n');
    });

    it('handles numbers and booleans', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'data' }
        });

        const xml = builder.build({
            count: 42,
            active: true,
            disabled: false
        });

        expect(xml).toContain('<count>42</count>');
        expect(xml).toContain('<active>true</active>');
        expect(xml).toContain('<disabled>false</disabled>');
    });

    it('uses custom indent size', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'user', indentSize: 4 }
        });

        const xml = builder.build({ name: 'John' });
        expect(xml).toBe('<user>\n    <name>John</name>\n</user>\n');
    });

    it('disables indentation when specified', () => {
        const serializer = new DefaultJsonToFormDataSerializer();
        const builder = new JsonToXmlBuilder({
            serializer,
            options: { rootElement: 'user', indent: false }
        });

        const xml = builder.build({ name: 'John' });
        expect(xml).toBe('<user><name>John</name></user>');
    });
});
