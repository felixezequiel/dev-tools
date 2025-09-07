import { TypeModelBuilder, TypeModelBuilderOptions, TypeModel, TypeRef } from '../ports/types-model';

export class DefaultTypeModelBuilder implements TypeModelBuilder {
    buildFromSample(sample: unknown, options?: TypeModelBuilderOptions): TypeModel {
        const rootName = options?.rootName ?? 'Root';
        const root = this.inferType(sample, options);
        return { rootName, root };
    }

    private inferType(value: any, options?: TypeModelBuilderOptions): TypeRef {
        if (value === null) return { kind: 'null' } as TypeRef;
        if (value === undefined) return { kind: 'unknown' } as TypeRef;
        const t = typeof value;
        if (t === 'string') {
            const format = this.detectStringFormat(value);
            return format ? { kind: 'string', format } as TypeRef : { kind: 'string' } as TypeRef;
        }
        if (t === 'number') return { kind: 'number' } as TypeRef;
        if (t === 'boolean') return { kind: 'boolean' } as TypeRef;
        if (Array.isArray(value)) {
            if (value.length === 0) return { kind: 'array', itemType: { kind: 'unknown' } } as TypeRef;
            const first = value[0];
            // union detection when heterogeneous arrays
            const itemTypes = Array.from(new Set(value.map(v => this.keyOf(this.inferType(v, options)))));
            if (itemTypes.length > 1) {
                const members = Array.from(new Set(value.map(v => JSON.stringify(this.inferType(v, options))))).map(s => JSON.parse(s));
                return { kind: 'array', itemType: { kind: 'union', members } as any } as TypeRef;
            }
            return { kind: 'array', itemType: this.inferType(first, options) } as TypeRef;
        }
        if (t === 'object') {
            const properties = Object.keys(value).sort().map(k => ({
                name: k,
                type: this.inferType(value[k], options),
                optional: (options?.optionalStrategy === 'loose') ? value[k] === undefined : false,
                readonly: options?.readonlyProperties ?? false
            }));
            return { kind: 'object', properties, additionalProperties: options?.additionalProperties ?? false } as TypeRef;
        }
        return { kind: 'unknown' } as TypeRef;
    }

    private keyOf(ref: TypeRef): string {
        return ref.kind;
    }

    private detectStringFormat(s: string): 'email' | 'uri' | 'uuid' | 'date' | 'date-time' | undefined {
        if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)) return 'email';
        if (/^https?:\/\//.test(s)) return 'uri';
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)) return 'uuid';
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return 'date';
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) return 'date-time';
        return undefined;
    }
}


