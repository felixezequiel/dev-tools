import { InternalSchema, InternalSchemaType, SchemaLoader } from '../../domain/ports/mock-data';

export class SimpleSchemaLoader implements SchemaLoader {
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
            return { type: 'string', enum: node.enum, format: node.format } as InternalSchema;
        }
        // Accept JSON Schema's "integer" as number in our internal model
        if (t === 'number' || node.type === 'integer') return { type: 'number', enum: node.enum } as InternalSchema;
        if (t === 'boolean') return { type: 'boolean' } as InternalSchema;
        if (t === 'null') return { type: 'null' } as InternalSchema;
        return { type: 'string' } as InternalSchema;
    }
}


