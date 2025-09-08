import { InternalSchema, InternalSchemaType, SchemaLoader, InternalUnionSchema } from '../../domain/ports/mock-data';

export class SimpleSchemaLoader implements SchemaLoader {
    // Heuristic for detecting potential enums from example data
    private detectEnumFromExamples(values: any[]): string[] | null {
        if (!Array.isArray(values) || values.length === 0) return null;

        // Only consider if we have at least 3 examples and at most 20 unique values
        const uniqueValues = [...new Set(values.filter(v => typeof v === 'string'))];
        if (uniqueValues.length < 2 || uniqueValues.length > 20 || values.length < 3) return null;

        // Check if values repeat (suggesting enum rather than free text)
        const totalStrings = values.filter(v => typeof v === 'string').length;

        // Simple heuristics for enum detection:
        // 1. All values must be simple strings (no spaces, no special chars except _ and -)
        // 2. All values must be short (max 20 chars)
        // 3. Must have some repetition (at least 2 examples per unique value on average)
        const isSimpleStrings = uniqueValues.every(v => /^[a-zA-Z0-9_-]+$/.test(v));
        const isShortValues = uniqueValues.every(v => v.length <= 20);
        const hasRepetition = totalStrings / uniqueValues.length >= 1.5;

        if (!isSimpleStrings || !isShortValues || !hasRepetition) {
            return null;
        }

        return uniqueValues;
    }
    loadFromJsonSchema(input: any): InternalSchema {
        if (!input || typeof input !== 'object') throw new Error('Invalid JSON Schema');
        return this.toInternal(input);
    }

    loadFromOpenApi(spec: any): InternalSchema {
        if (!spec || typeof spec !== 'object') throw new Error('Invalid OpenAPI spec');
        // v1 heuristic: try spec.components.schemas.Data or first schema-like object
        const candidate = spec?.components?.schemas && Object.values(spec.components.schemas)[0];
        if (!candidate) throw new Error('OpenAPI components.schemas not found');
        return this.toInternal(candidate as any);
    }

    private toInternal(node: any): InternalSchema {
        const t = node.type as InternalSchemaType;
        if (t === 'object' || (node.properties && !t)) {
            const props: Record<string, InternalSchema> = {};
            for (const [k, v] of Object.entries(node.properties || {})) {
                props[k] = this.toInternal(v);
            }
            return { type: 'object', properties: props, required: node.required || [] };
        }
        if (t === 'array' || node.items) {
            return { type: 'array', items: this.toInternal(node.items || { type: 'string' }), minItems: node.minItems, maxItems: node.maxItems };
        }
        if (t === 'string' || node.format || node.enum) {
            let enumValues = node.enum;

            // Try to detect enum from examples if no explicit enum
            if (!enumValues && node.examples) {
                enumValues = this.detectEnumFromExamples(node.examples);
            }

            return { type: 'string', enum: enumValues, format: node.format, pattern: node.pattern } as InternalSchema;
        }
        // Accept JSON Schema's "integer" as number in our internal model
        if (t === 'number' || node.type === 'integer') return { type: 'number', enum: node.enum } as InternalSchema;
        if (t === 'boolean') return { type: 'boolean' } as InternalSchema;
        if (t === 'null') return { type: 'null' } as InternalSchema;

        // Handle unions (oneOf, anyOf, allOf)
        if (node.oneOf || node.anyOf || node.allOf) {
            const variants = node.oneOf || node.anyOf || node.allOf;
            if (Array.isArray(variants) && variants.length > 0) {
                const unionVariants: InternalSchema[] = [];
                for (const variant of variants) {
                    unionVariants.push(this.toInternal(variant));
                }
                return {
                    type: 'union',
                    variants: unionVariants,
                    nullable: node.nullable
                } as InternalUnionSchema;
            }
        }

        return { type: 'string' } as InternalSchema;
    }
}


