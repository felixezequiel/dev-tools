import { describe, it, expect } from 'vitest';
import { SimpleDataFaker } from '../../../core/infrastructure/mock-data/simple-data-faker';
import { InternalSchema } from '../../../core/domain/ports/mock-data';

describe('SimpleDataFaker', () => {
    const faker = new SimpleDataFaker();

    describe('generate with seed', () => {
        it('produces deterministic results with same seed', () => {
            const schema: InternalSchema = {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' }
                }
            };

            const options1 = { count: 3, seed: 'test-seed' };
            const options2 = { count: 3, seed: 'test-seed' };
            const options3 = { count: 3, seed: 'different-seed' };

            const result1 = faker.generate(schema, options1);
            const result2 = faker.generate(schema, options2);
            const result3 = faker.generate(schema, options3);

            expect(result1).toEqual(result2);
            expect(result1).not.toEqual(result3);
            expect(result1).toHaveLength(3);
            expect(result2).toHaveLength(3);
            expect(result3).toHaveLength(3);
        });

        it('produces different results with different seeds', () => {
            const schema: InternalSchema = {
                type: 'string'
            };

            const result1 = faker.generate(schema, { count: 5, seed: 'seed1' });
            const result2 = faker.generate(schema, { count: 5, seed: 'seed2' });

            expect(result1).not.toEqual(result2);
        });

        it('handles empty/null seed', () => {
            const schema: InternalSchema = {
                type: 'number'
            };

            const result1 = faker.generate(schema, { count: 3, seed: undefined });
            const result2 = faker.generate(schema, { count: 3, seed: '' });

            expect(result1).toHaveLength(3);
            expect(result2).toHaveLength(3);
            expect(result1[0]).toBeTypeOf('number');
            expect(result2[0]).toBeTypeOf('number');
        });
    });

    describe('string formats', () => {
        it('generates email format', () => {
            const schema: InternalSchema = {
                type: 'string',
                format: 'email'
            };

            const result = faker.generate(schema, { count: 5, seed: 'email-test' });

            result.forEach(email => {
                expect(typeof email).toBe('string');
                expect(email).toContain('@');
                expect(email).toContain('.');
            });
        });

        it('generates uri format', () => {
            const schema: InternalSchema = {
                type: 'string',
                format: 'uri'
            };

            const result = faker.generate(schema, { count: 5, seed: 'uri-test' });

            result.forEach(uri => {
                expect(typeof uri).toBe('string');
                expect(uri).toMatch(/^https?:\/\//);
            });
        });

        it('generates uuid format', () => {
            const schema: InternalSchema = {
                type: 'string',
                format: 'uuid'
            };

            const result = faker.generate(schema, { count: 5, seed: 'uuid-test' });

            result.forEach(uuid => {
                expect(typeof uuid).toBe('string');
                expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
            });
        });

        it('generates date formats', () => {
            const dateSchema: InternalSchema = {
                type: 'string',
                format: 'date'
            };
            const dateTimeSchema: InternalSchema = {
                type: 'string',
                format: 'date-time'
            };

            const dates = faker.generate(dateSchema, { count: 3, seed: 'date-test' });
            const dateTimes = faker.generate(dateTimeSchema, { count: 3, seed: 'datetime-test' });

            dates.forEach(date => {
                expect(typeof date).toBe('string');
                expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            });

            dateTimes.forEach(dateTime => {
                expect(typeof dateTime).toBe('string');
                expect(dateTime).toContain('T');
                expect(dateTime).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
            });
        });

        it('generates phone format', () => {
            const schema: InternalSchema = {
                type: 'string',
                format: 'phone'
            };

            const result = faker.generate(schema, { count: 5, seed: 'phone-test' });

            result.forEach(phone => {
                expect(typeof phone).toBe('string');
                expect(phone.length).toBeGreaterThan(0);
                // Phone numbers should contain digits and possibly formatting characters
                expect(phone).toMatch(/[\d\-\+\(\)\s]+/);
            });
        });

        it('generates address format', () => {
            const schema: InternalSchema = {
                type: 'string',
                format: 'address'
            };

            const result = faker.generate(schema, { count: 3, seed: 'address-test' });

            result.forEach(address => {
                expect(typeof address).toBe('string');
                expect(address.length).toBeGreaterThan(0);
                // Addresses typically contain numbers and street names
                expect(address).toMatch(/\d+/);
            });
        });

        it('generates company format', () => {
            const schema: InternalSchema = {
                type: 'string',
                format: 'company'
            };

            const result = faker.generate(schema, { count: 3, seed: 'company-test' });

            result.forEach(company => {
                expect(typeof company).toBe('string');
                expect(company.length).toBeGreaterThan(0);
            });
        });

        it('generates name formats', () => {
            const firstNameSchema: InternalSchema = { type: 'string', format: 'first-name' };
            const lastNameSchema: InternalSchema = { type: 'string', format: 'last-name' };
            const fullNameSchema: InternalSchema = { type: 'string', format: 'full-name' };

            const firstNames = faker.generate(firstNameSchema, { count: 3, seed: 'firstname-test' });
            const lastNames = faker.generate(lastNameSchema, { count: 3, seed: 'lastname-test' });
            const fullNames = faker.generate(fullNameSchema, { count: 3, seed: 'fullname-test' });

            firstNames.forEach(name => {
                expect(typeof name).toBe('string');
                expect(name.length).toBeGreaterThan(0);
            });

            lastNames.forEach(name => {
                expect(typeof name).toBe('string');
                expect(name.length).toBeGreaterThan(0);
            });

            fullNames.forEach(name => {
                expect(typeof name).toBe('string');
                expect(name).toContain(' '); // Full names should have spaces
            });
        });

        it('handles enum values', () => {
            const schema: InternalSchema = {
                type: 'string',
                enum: ['option1', 'option2', 'option3']
            };

            const result = faker.generate(schema, { count: 10, seed: 'enum-test' });

            result.forEach(value => {
                expect(['option1', 'option2', 'option3']).toContain(value);
            });
        });
    });

    describe('primitive types', () => {
        it('generates numbers', () => {
            const schema: InternalSchema = { type: 'number' };
            const result = faker.generate(schema, { count: 5, seed: 'number-test' });

            result.forEach(num => {
                expect(typeof num).toBe('number');
                expect(num).toBeGreaterThanOrEqual(0);
                expect(num).toBeLessThan(1000);
            });
        });

        it('generates booleans', () => {
            const schema: InternalSchema = { type: 'boolean' };
            const result = faker.generate(schema, { count: 10, seed: 'boolean-test' });

            result.forEach(bool => {
                expect(typeof bool).toBe('boolean');
            });

            // Should have both true and false values
            const hasTrue = result.some(v => v === true);
            const hasFalse = result.some(v => v === false);
            expect(hasTrue && hasFalse).toBe(true);
        });

        it('generates plain strings', () => {
            const schema: InternalSchema = { type: 'string' };
            const result = faker.generate(schema, { count: 5, seed: 'string-test' });

            result.forEach(str => {
                expect(typeof str).toBe('string');
                expect(str.length).toBeGreaterThan(0);
            });
        });
    });

    describe('object generation', () => {
        it('generates simple objects', () => {
            const schema: InternalSchema = {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    active: { type: 'boolean' }
                }
            };

            const result = faker.generate(schema, { count: 3, seed: 'object-test' });

            expect(result).toHaveLength(3);
            result.forEach(obj => {
                expect(typeof obj).toBe('object');
                expect(obj).toHaveProperty('id');
                expect(obj).toHaveProperty('name');
                expect(obj).toHaveProperty('active');
                expect(typeof obj.id).toBe('number');
                expect(typeof obj.name).toBe('string');
                expect(typeof obj.active).toBe('boolean');
            });
        });

        it('handles required vs optional properties', () => {
            const schema: InternalSchema = {
                type: 'object',
                properties: {
                    required: { type: 'string' },
                    optional: { type: 'string' }
                },
                required: ['required']
            };

            const result = faker.generate(schema, { count: 5, seed: 'required-test' });

            result.forEach(obj => {
                expect(obj).toHaveProperty('required');
                expect(typeof obj.required).toBe('string');
                // Note: current implementation doesn't handle required vs optional differently
                // This is a known limitation
            });
        });
    });

    describe('array generation', () => {
        it('generates arrays with default bounds', () => {
            const schema: InternalSchema = {
                type: 'array',
                items: { type: 'number' }
            };

            const result = faker.generate(schema, { count: 3, seed: 'array-test' });

            expect(result).toHaveLength(3);
            result.forEach(arr => {
                expect(Array.isArray(arr)).toBe(true);
                expect(arr.length).toBeGreaterThanOrEqual(1);
                expect(arr.length).toBeLessThanOrEqual(3);
                arr.forEach((item: any) => expect(typeof item).toBe('number'));
            });
        });

        it('respects minItems and maxItems', () => {
            const schema: InternalSchema = {
                type: 'array',
                items: { type: 'string' },
                minItems: 2,
                maxItems: 4
            };

            const result = faker.generate(schema, { count: 5, seed: 'bounded-array-test' });

            result.forEach(arr => {
                expect(Array.isArray(arr)).toBe(true);
                expect(arr.length).toBeGreaterThanOrEqual(2);
                expect(arr.length).toBeLessThanOrEqual(4);
                arr.forEach((item: any) => expect(typeof item).toBe('string'));
            });
        });

        it('handles nested arrays and objects', () => {
            const schema: InternalSchema = {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            minItems: 1,
                            maxItems: 3
                        }
                    }
                },
                minItems: 1,
                maxItems: 2
            };

            const result = faker.generate(schema, { count: 2, seed: 'nested-test' });

            result.forEach(arr => {
                expect(Array.isArray(arr)).toBe(true);
                expect(arr.length).toBeGreaterThanOrEqual(1);
                expect(arr.length).toBeLessThanOrEqual(2);

                arr.forEach((obj: any) => {
                    expect(obj).toHaveProperty('id');
                    expect(obj).toHaveProperty('tags');
                    expect(typeof obj.id).toBe('number');
                    expect(Array.isArray(obj.tags)).toBe(true);
                    expect(obj.tags.length).toBeGreaterThanOrEqual(1);
                    expect(obj.tags.length).toBeLessThanOrEqual(3);
                });
            });
        });
    });

    describe('edge cases', () => {
        it('handles null type', () => {
            const schema: InternalSchema = { type: 'null' };
            const result = faker.generate(schema, { count: 3, seed: 'null-test' });

            result.forEach(value => {
                expect(value).toBeNull();
            });
        });

        it('handles large count values', () => {
            const schema: InternalSchema = { type: 'number' };
            const result = faker.generate(schema, { count: 100, seed: 'large-count-test' });

            expect(result).toHaveLength(100);
            result.forEach(num => expect(typeof num).toBe('number'));
        });

        it('generates consistent results across multiple calls with same seed', () => {
            const schema: InternalSchema = {
                type: 'object',
                properties: {
                    value: { type: 'string' }
                }
            };

            const result1 = faker.generate(schema, { count: 1, seed: 'consistency-test' });
            const result2 = faker.generate(schema, { count: 1, seed: 'consistency-test' });

            expect(result1[0].value).toBe(result2[0].value);
        });

        it('handles union types', () => {
            const schema: InternalSchema = {
                type: 'union',
                variants: [
                    { type: 'string' },
                    { type: 'number' },
                    { type: 'boolean' }
                ]
            };

            const result = faker.generate(schema, { count: 10, seed: 'union-test' });

            expect(result).toHaveLength(10);
            result.forEach(value => {
                // Should be one of string, number, or boolean
                const valueType = typeof value;
                expect(['string', 'number', 'boolean']).toContain(valueType);
                if (valueType === 'boolean') {
                    expect([true, false]).toContain(value);
                }
            });
        });

        it('generates enums detected from examples', () => {
            const schema: InternalSchema = {
                type: 'string',
                enum: ['option1', 'option2', 'option3']
            };

            const result = faker.generate(schema, { count: 20, seed: 'enum-test' });

            expect(result).toHaveLength(20);
            result.forEach(value => {
                expect(['option1', 'option2', 'option3']).toContain(value);
            });
        });

        it('handles locale configuration', () => {
            const schema: InternalSchema = {
                type: 'string',
                format: 'first-name'
            };

            // Generate with different locales
            const resultEn = faker.generate(schema, { count: 5, seed: 'locale-test-en', locale: 'en' });
            const resultPt = faker.generate(schema, { count: 5, seed: 'locale-test-pt', locale: 'pt_BR' });

            // Should generate different names for different locales (basic check)
            expect(resultEn).toHaveLength(5);
            expect(resultPt).toHaveLength(5);
            resultEn.forEach(name => {
                expect(typeof name).toBe('string');
                expect(name.length).toBeGreaterThan(0);
            });
            resultPt.forEach(name => {
                expect(typeof name).toBe('string');
                expect(name.length).toBeGreaterThan(0);
            });
        });

        it('handles very large datasets efficiently', () => {
            const schema: InternalSchema = {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    name: { type: 'string' }
                }
            };

            const startTime = performance.now();
            const result = faker.generate(schema, { count: 1000, seed: 'large-dataset-test' });
            const endTime = performance.now();

            expect(result).toHaveLength(1000);
            // Should complete within reasonable time (less than 2 seconds for 1000 records)
            expect(endTime - startTime).toBeLessThan(2000);

            result.forEach(item => {
                expect(item).toHaveProperty('id');
                expect(item).toHaveProperty('name');
                expect(typeof item.id).toBe('number');
                expect(typeof item.name).toBe('string');
            });
        });
    });
});
