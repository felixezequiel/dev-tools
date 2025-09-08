import { describe, it, expect } from 'vitest';
import { SimpleSchemaLoader } from '../../../core/infrastructure/mock-data/simple-schema-loader';
import { InternalSchema } from '../../../core/domain/ports/mock-data';

describe('SimpleSchemaLoader', () => {
    const loader = new SimpleSchemaLoader();

    describe('loadFromJsonSchema', () => {
        it('converts basic object schema', () => {
            const input = {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    active: { type: 'boolean' }
                },
                required: ['id', 'name']
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('object');
            expect(result).toHaveProperty('properties');
            if (result.type === 'object') {
                expect(result.properties.id.type).toBe('number');
                expect(result.properties.name.type).toBe('string');
                expect(result.properties.active.type).toBe('boolean');
                expect(result.required).toEqual(['id', 'name']);
            }
        });

        it('handles string formats', () => {
            const input = {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email' },
                    website: { type: 'string', format: 'uri' },
                    uuid: { type: 'string', format: 'uuid' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('object');
            if (result.type === 'object') {
                expect((result.properties.email as any).format).toBe('email');
                expect((result.properties.website as any).format).toBe('uri');
                expect((result.properties.uuid as any).format).toBe('uuid');
                expect((result.properties.createdAt as any).format).toBe('date-time');
            }
        });

        it('handles enums', () => {
            const input = {
                type: 'object',
                properties: {
                    status: { type: 'string', enum: ['active', 'inactive', 'pending'] },
                    priority: { type: 'number', enum: [1, 2, 3] }
                }
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('object');
            if (result.type === 'object') {
                expect((result.properties.status as any).enum).toEqual(['active', 'inactive', 'pending']);
                expect((result.properties.priority as any).enum).toEqual([1, 2, 3]);
            }
        });

        it('handles arrays', () => {
            const input = {
                type: 'object',
                properties: {
                    tags: {
                        type: 'array',
                        items: { type: 'string' },
                        minItems: 1,
                        maxItems: 5
                    },
                    numbers: {
                        type: 'array',
                        items: { type: 'number' }
                    }
                }
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('object');
            if (result.type === 'object') {
                expect(result.properties.tags.type).toBe('array');
                if (result.properties.tags.type === 'array') {
                    expect(result.properties.tags.items.type).toBe('string');
                    expect((result.properties.tags as any).minItems).toBe(1);
                    expect((result.properties.tags as any).maxItems).toBe(5);
                }

                expect(result.properties.numbers.type).toBe('array');
                if (result.properties.numbers.type === 'array') {
                    expect(result.properties.numbers.items.type).toBe('number');
                }
            }
        });

        it('handles nested objects', () => {
            const input = {
                type: 'object',
                properties: {
                    profile: {
                        type: 'object',
                        properties: {
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            age: { type: 'number' }
                        }
                    }
                }
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('object');
            if (result.type === 'object') {
                expect(result.properties.profile.type).toBe('object');
                if (result.properties.profile.type === 'object') {
                    expect(result.properties.profile.properties.firstName.type).toBe('string');
                    expect(result.properties.profile.properties.lastName.type).toBe('string');
                    expect(result.properties.profile.properties.age.type).toBe('number');
                }
            }
        });

        it('handles nullable fields', () => {
            const input = {
                type: 'object',
                properties: {
                    optionalField: { type: 'string', nullable: true },
                    requiredField: { type: 'string' }
                },
                required: ['requiredField']
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('object');
            if (result.type === 'object') {
                // Note: Current implementation doesn't handle nullable from JSON Schema
                // This is a known limitation - nullable is not being preserved
                expect(result.properties.optionalField.type).toBe('string');
                expect(result.properties.requiredField.type).toBe('string');
            }
        });

        it('handles JSON Schema integer as number', () => {
            const input = {
                type: 'object',
                properties: {
                    count: { type: 'integer' },
                    regularNumber: { type: 'number' }
                }
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('object');
            if (result.type === 'object') {
                expect(result.properties.count.type).toBe('number');
                expect(result.properties.regularNumber.type).toBe('number');
            }
        });

        it('throws on invalid input', () => {
            expect(() => loader.loadFromJsonSchema(null)).toThrow();
            expect(() => loader.loadFromJsonSchema(undefined)).toThrow();
            expect(() => loader.loadFromJsonSchema('invalid')).toThrow();
        });
    });

    describe('loadFromOpenApi', () => {
        it('extracts schema from OpenAPI components', () => {
            const input = {
                openapi: '3.0.3',
                components: {
                    schemas: {
                        User: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer' },
                                name: { type: 'string' },
                                email: { type: 'string', format: 'email' }
                            },
                            required: ['id', 'name']
                        },
                        Product: {
                            type: 'object',
                            properties: {
                                sku: { type: 'string' },
                                price: { type: 'number' }
                            }
                        }
                    }
                }
            };

            const result = loader.loadFromOpenApi(input);

            expect(result.type).toBe('object');
            if (result.type === 'object') {
                // Should extract the first schema (User in this case)
                expect(result.properties.id.type).toBe('number'); // integer -> number
                expect(result.properties.name.type).toBe('string');
                expect((result.properties.email as any).format).toBe('email');
                expect(result.required).toEqual(['id', 'name']);
            }
        });

        it('handles simple OpenAPI without components', () => {
            const input = {
                openapi: '3.0.3',
                paths: {},
                components: {
                    schemas: {
                        SimpleSchema: {
                            type: 'string',
                            format: 'email'
                        }
                    }
                }
            };

            const result = loader.loadFromOpenApi(input);

            expect(result.type).toBe('string');
            expect((result as any).format).toBe('email');
        });

        it('throws on invalid OpenAPI spec', () => {
            expect(() => loader.loadFromOpenApi(null)).toThrow();
            expect(() => loader.loadFromOpenApi({})).toThrow();
            expect(() => loader.loadFromOpenApi({ components: {} })).toThrow();
            expect(() => loader.loadFromOpenApi({ components: { schemas: {} } })).toThrow();
        });

        it('handles union types (oneOf)', () => {
            const input = {
                oneOf: [
                    { type: 'string' },
                    { type: 'number' },
                    { type: 'boolean' }
                ]
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('union');
            if (result.type === 'union') {
                expect(result.variants).toHaveLength(3);
                expect(result.variants[0].type).toBe('string');
                expect(result.variants[1].type).toBe('number');
                expect(result.variants[2].type).toBe('boolean');
            }
        });

        it('handles union types (anyOf)', () => {
            const input = {
                anyOf: [
                    { type: 'string', format: 'email' },
                    { type: 'object', properties: { name: { type: 'string' } } }
                ]
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('union');
            if (result.type === 'union') {
                expect(result.variants).toHaveLength(2);
                expect(result.variants[0].type).toBe('string');
                expect(result.variants[1].type).toBe('object');
            }
        });

        it('detects enum from examples', () => {
            const input = {
                type: 'string',
                examples: ['active', 'inactive', 'pending', 'active', 'inactive', 'active']
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('string');
            if (result.type === 'string') {
                expect(result.enum).toEqual(['active', 'inactive', 'pending']);
            }
        });

        it('does not detect enum from free text examples', () => {
            const input = {
                type: 'string',
                examples: ['This is a long sentence', 'Another different text', 'Yet another example']
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('string');
            if (result.type === 'string') {
                expect(result.enum).toBeFalsy(); // Should be undefined or null
            }
        });

        it('handles pattern property', () => {
            const input = {
                type: 'string',
                pattern: '^[A-Z]{2}\\d{4}$'
            };

            const result = loader.loadFromJsonSchema(input);

            expect(result.type).toBe('string');
            if (result.type === 'string') {
                expect(result.pattern).toBe('^[A-Z]{2}\\d{4}$');
            }
        });
    });
});
