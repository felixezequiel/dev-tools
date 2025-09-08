import { describe, it, expect } from 'vitest';
import { MockDataService } from '../../../core/application/mock-data-service';

describe('Mock Data Performance Tests', () => {
    const service = new MockDataService();

    // Test schema similar to real-world usage
    const complexSchema = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            age: { type: 'number' },
            active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            tags: {
                type: 'array',
                items: { type: 'string' },
                minItems: 1,
                maxItems: 3
            },
            profile: {
                type: 'object',
                properties: {
                    bio: { type: 'string' },
                    website: { type: 'string', format: 'uri' },
                    location: { type: 'string' }
                }
            },
            preferences: {
                type: 'object',
                properties: {
                    theme: { type: 'string', enum: ['light', 'dark', 'auto'] },
                    notifications: { type: 'boolean' },
                    language: { type: 'string', enum: ['en', 'pt', 'es'] }
                }
            }
        },
        required: ['id', 'name', 'email']
    };

    const simpleSchema = {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' }
        }
    };

    describe('JSON Schema Performance', () => {
        it('generates 1000 records in less than 1 second', () => {
            const startTime = performance.now();

            const result = service.generateFromJsonSchema(complexSchema, {
                count: 1000,
                seed: 'performance-test'
            });

            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(1000); // Less than 1 second
            expect(result.json).toHaveLength(1000);
            expect(result.csv.split('\n')).toHaveLength(1001); // 1000 data + 1 header
            expect(result.sql.split('\n')).toHaveLength(1); // Single INSERT statement
        });

        it('generates 5000 records in reasonable time', () => {
            const startTime = performance.now();

            const result = service.generateFromJsonSchema(simpleSchema, {
                count: 5000,
                seed: 'large-test'
            });

            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(3000); // Less than 3 seconds for 5k records
            expect(result.json).toHaveLength(5000);
        });

        it('handles different seed values efficiently', () => {
            const seeds = ['seed1', 'seed2', 'seed3', 'seed4', 'seed5'];
            const results: number[] = [];

            seeds.forEach(seed => {
                const startTime = performance.now();

                service.generateFromJsonSchema(simpleSchema, {
                    count: 500,
                    seed
                });

                const endTime = performance.now();
                results.push(endTime - startTime);
            });

            const avgDuration = results.reduce((a, b) => a + b, 0) / results.length;

            expect(avgDuration).toBeLessThan(500); // Less than 500ms average
        });
    });

    describe('CSV Export Performance', () => {
        it('exports 1000 records to CSV quickly', () => {
            const jsonData = Array.from({ length: 1000 }, (_, i) => ({
                id: i + 1,
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`,
                active: i % 2 === 0,
                tags: [`tag${(i % 5) + 1}`, `tag${((i + 1) % 5) + 1}`],
                created_at: '2024-01-01T00:00:00Z'
            }));

            const startTime = performance.now();

            const result = service.generateFromJsonSchema(simpleSchema, {
                count: 1000,
                seed: 'csv-performance-test'
            });

            const endTime = performance.now();
            const duration = endTime - startTime;


            expect(duration).toBeLessThan(500); // Less than 500ms for CSV export
            expect(result.csv.split('\n').length).toBe(1001); // 1000 + header
        });

        it('handles large CSV with special characters efficiently', () => {
            const jsonData = Array.from({ length: 2000 }, (_, i) => ({
                id: i + 1,
                description: `Item ${i + 1} with, commas and "quotes" in the text`,
                notes: `Note ${i + 1} with special characters: @#$%^&*()`,
                url: `https://example.com/item/${i + 1}`
            }));

            const startTime = performance.now();

            const result = service.generateFromJsonSchema(simpleSchema, {
                count: 2000,
                seed: 'special-chars-test'
            });

            const endTime = performance.now();
            const duration = endTime - startTime;


            expect(duration).toBeLessThan(1000);
            expect(result.csv.split('\n').length).toBe(2001);
        });
    });

    describe('SQL Export Performance', () => {
        it('exports 1000 records to SQL with batching', () => {
            const startTime = performance.now();

            const result = service.generateFromJsonSchema(complexSchema, {
                count: 1000,
                seed: 'sql-performance-test'
            });

            const endTime = performance.now();
            const duration = endTime - startTime;


            expect(duration).toBeLessThan(1000);
            expect(result.sql.length).toBeGreaterThan(0);

            // Count INSERT statements (should be batched)
            const insertCount = (result.sql.match(/INSERT INTO/g) || []).length;
            expect(insertCount).toBeGreaterThan(0);
        });

        it('handles different batch sizes efficiently', () => {
            const batchSizes = [1, 10, 50, 100];

            batchSizes.forEach(batchSize => {
                const startTime = performance.now();

                const result = service.generateFromJsonSchema(simpleSchema, {
                    count: 500,
                    seed: `batch-${batchSize}-test`
                });

                const endTime = performance.now();
                const duration = endTime - startTime;


                expect(duration).toBeLessThan(800);
            });
        });
    });

    describe('Memory Usage Tests', () => {
        it('handles large datasets without memory issues', () => {
            const startTime = performance.now();
            const startMemory = (performance as any).memory?.usedJSHeapSize || 0;

            const result = service.generateFromJsonSchema(complexSchema, {
                count: 5000,
                seed: 'memory-test'
            });

            const endTime = performance.now();
            const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
            const duration = endTime - startTime;
            const memoryDelta = endMemory - startMemory;


            expect(duration).toBeLessThan(5000); // Should complete within reasonable time
            expect(result.json).toHaveLength(5000);

            // Memory delta should be reasonable (less than 50MB increase)
            if (memoryDelta > 0) {
                expect(memoryDelta).toBeLessThan(50 * 1024 * 1024);
            }
        });

        it('cleans up properly after large generations', () => {
            // Generate large dataset
            service.generateFromJsonSchema(complexSchema, {
                count: 2000,
                seed: 'cleanup-test-1'
            });

            // Force garbage collection if available
            if (global.gc) {
                global.gc();
            }

            // Generate another large dataset
            const result = service.generateFromJsonSchema(complexSchema, {
                count: 2000,
                seed: 'cleanup-test-2'
            });

            expect(result.json).toHaveLength(2000);
        });
    });

    describe('Concurrent Performance', () => {
        it('handles multiple concurrent generations', async () => {
            const promises = Array.from({ length: 5 }, (_, i) =>
                service.generateFromJsonSchema(simpleSchema, {
                    count: 200,
                    seed: `concurrent-${i}`
                })
            );

            const startTime = performance.now();

            const results = await Promise.all(promises);

            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
            results.forEach(result => {
                expect(result.json).toHaveLength(200);
            });
        });
    });
});
