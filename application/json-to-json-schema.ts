import { JsonOutputBuilder } from './ports/json-output-builder';
import { JsonSerializer } from './ports/json-serializer';

export interface JsonSchemaOptions {
    title?: string;
    description?: string;
    version?: string;
    required?: string[];
    additionalProperties?: boolean;
    strictMode?: boolean;
}

export interface JsonSchema {
    $schema?: string;
    $id?: string;
    title?: string;
    description?: string;
    type: string;
    properties?: Record<string, JsonSchema>;
    items?: JsonSchema;
    required?: string[];
    enum?: any[];
    minimum?: number;
    maximum?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    format?: string;
    additionalProperties?: boolean | JsonSchema;
    example?: any;
    oneOf?: JsonSchema[];
}

export class JsonToJsonSchemaBuilder implements JsonOutputBuilder<JsonSchema> {
    private readonly serializer: JsonSerializer;
    private readonly options: JsonSchemaOptions;

    constructor(params: { serializer: JsonSerializer; options?: JsonSchemaOptions }) {
        this.serializer = params.serializer;
        this.options = {
            version: 'https://json-schema.org/draft/2020-12/schema',
            additionalProperties: false,
            strictMode: false,
            ...params.options
        };
    }

    build(json: Record<string, any>): JsonSchema {
        const schema: JsonSchema = {
            $schema: this.options.version,
            type: 'object',
            additionalProperties: this.options.additionalProperties
        };

        if (this.options.title) {
            schema.title = this.options.title;
        }

        if (this.options.description) {
            schema.description = this.options.description;
        }

        if (Array.isArray(json)) {
            return this.buildArraySchema(json);
        }

        schema.properties = this.buildProperties(json);
        schema.required = this.determineRequired(json);

        return schema;
    }

    private buildArraySchema(array: any[]): JsonSchema {
        if (array.length === 0) {
            return {
                $schema: this.options.version,
                type: 'array',
                items: { type: 'string' } // Default for empty arrays
            };
        }

        // Analyze first few items to determine item schema
        const sampleSize = Math.min(10, array.length);
        const samples = array.slice(0, sampleSize);

        const itemSchemas = samples.map(item => this.buildValueSchema(item));
        const unifiedSchema = this.unifySchemas(itemSchemas);

        return {
            $schema: this.options.version,
            type: 'array',
            items: unifiedSchema
        };
    }

    private buildProperties(obj: Record<string, any>): Record<string, JsonSchema> {
        const properties: Record<string, JsonSchema> = {};

        for (const [key, value] of Object.entries(obj)) {
            properties[key] = this.buildValueSchema(value);
        }

        return properties;
    }

    private buildValueSchema(value: any): JsonSchema {
        if (value === null || value === undefined) {
            return { type: 'null' };
        }

        // Check original value type before serialization
        const originalType = typeof value;

        if (originalType === 'string') {
            const schema = this.buildStringSchema(value);
            schema.example = value;
            return schema;
        }

        if (originalType === 'number') {
            const schema = this.buildNumberSchema(value);
            schema.example = value;
            return schema;
        }

        if (originalType === 'boolean') {
            return { type: 'boolean', example: value };
        }

        if (Array.isArray(value)) {
            return this.buildArraySchema(value);
        }

        if (originalType === 'object') {
            if (value instanceof Date) {
                return {
                    type: 'string',
                    format: 'date-time',
                    example: value
                };
            }

            return {
                type: 'object',
                properties: this.buildProperties(value),
                required: this.determineRequired(value),
                additionalProperties: this.options.additionalProperties
            };
        }

        return { type: 'string' }; // Fallback
    }

    private buildStringSchema(value: string): JsonSchema {
        const schema: JsonSchema = { type: 'string' };

        if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            schema.format = 'date-time';
        } else if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            schema.format = 'date';
        } else if (value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            schema.format = 'email';
        } else if (value.match(/^https?:\/\/.+/)) {
            schema.format = 'uri';
        } else if (value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            schema.format = 'uuid';
        }

        schema.minLength = 0;
        schema.maxLength = Math.max(255, value.length);

        return schema;
    }

    private buildNumberSchema(value: number): JsonSchema {
        const schema: JsonSchema = { type: 'number' };

        if (Number.isInteger(value)) {
            schema.type = 'integer';
            schema.minimum = Math.min(0, value);
            schema.maximum = Math.max(999999, value);
        } else {
            schema.minimum = Math.min(0, value);
            schema.maximum = Math.max(999999, value);
        }

        return schema;
    }

    private determineRequired(obj: Record<string, any>): string[] {
        if (this.options.required) {
            return this.options.required;
        }

        if (this.options.strictMode) {
            return Object.keys(obj);
        }

        // In non-strict mode, make fields required if they have non-null values
        return Object.keys(obj).filter(key => obj[key] !== null && obj[key] !== undefined);
    }

    private unifySchemas(schemas: JsonSchema[]): JsonSchema {
        if (schemas.length === 0) {
            return { type: 'string' };
        }

        if (schemas.length === 1) {
            return schemas[0];
        }

        const types = Array.from(new Set(schemas.map(s => s.type)));
        // If all items have the same type 'object', return a merged object schema
        if (types.length === 1 && types[0] === 'object') {
            // Merge properties and required lists
            const mergedProps: Record<string, JsonSchema> = {};
            const requiredSets: Array<Set<string>> = [];
            schemas.forEach(s => {
                if (s.properties) {
                    for (const [k, v] of Object.entries(s.properties)) {
                        mergedProps[k] = v;
                    }
                }
                if (s.required) {
                    requiredSets.push(new Set(s.required));
                }
            });
            const required: string[] | undefined = requiredSets.length
                ? Array.from(requiredSets.reduce((acc, set) => {
                    set.forEach(v => acc.add(v));
                    return acc;
                }, new Set<string>()))
                : undefined;
            return { type: 'object', properties: mergedProps, required } as JsonSchema;
        }

        // Mixed types: use oneOf without custom 'union' type
        return { oneOf: schemas, type: 'array' } as any;
    }
}
