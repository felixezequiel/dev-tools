import { DataFaker, DataFakerOptions, InternalArraySchema, InternalBooleanSchema, InternalNullSchema, InternalNumberSchema, InternalObjectSchema, InternalSchema, InternalStringSchema } from '../../domain/ports/mock-data';

function seededRandom(seed: string | undefined) {
    let h = 2166136261 >>> 0;
    const s = seed || 'seed';
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return () => {
        h += 0x6D2B79F5;
        let t = Math.imul(h ^ (h >>> 15), 1 | h);
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export class SimpleDataFaker implements DataFaker {
    generate(schema: InternalSchema, options: DataFakerOptions): any[] {
        const rand = seededRandom(options.seed);
        const count = Math.max(1, options.count);
        const result: any[] = [];
        for (let i = 0; i < count; i++) {
            result.push(this.fakeValue(schema, rand));
        }
        return result;
    }

    private fakeValue(schema: InternalSchema, rand: () => number): any {
        switch (schema.type) {
            case 'object':
                return this.fakeObject(schema as InternalObjectSchema, rand);
            case 'array':
                return this.fakeArray(schema as InternalArraySchema, rand);
            case 'string':
                return this.fakeString(schema as InternalStringSchema, rand);
            case 'number':
                return this.fakeNumber(schema as InternalNumberSchema, rand);
            case 'boolean':
                return this.fakeBoolean(schema as InternalBooleanSchema, rand);
            case 'null':
                return this.fakeNull(schema as InternalNullSchema);
        }
    }

    private fakeObject(schema: InternalObjectSchema, rand: () => number): Record<string, any> {
        const out: Record<string, any> = {};
        for (const [key, child] of Object.entries(schema.properties)) {
            out[key] = this.fakeValue(child, rand);
        }
        return out;
    }

    private fakeArray(schema: InternalArraySchema, rand: () => number): any[] {
        const min = schema.minItems ?? 1;
        const max = schema.maxItems ?? 3;
        const n = Math.max(min, Math.floor(rand() * (max - min + 1)) + min);
        const arr: any[] = [];
        for (let i = 0; i < n; i++) arr.push(this.fakeValue(schema.items, rand));
        return arr;
    }

    private fakeString(schema: InternalStringSchema, rand: () => number): string {
        if (schema.enum && schema.enum.length) {
            return schema.enum[Math.floor(rand() * schema.enum.length)];
        }
        switch (schema.format) {
            case 'email':
                return `user${Math.floor(rand() * 1000)}@example.com`;
            case 'uri':
                return `https://example.com/${Math.floor(rand() * 1000)}`;
            case 'uuid':
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                    const r = Math.floor(rand() * 16);
                    const v = c === 'x' ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                });
            case 'date':
                return '2024-01-01';
            case 'date-time':
                return '2024-01-01T00:00:00Z';
            default:
                return `text_${Math.floor(rand() * 10000)}`;
        }
    }

    private fakeNumber(_schema: InternalNumberSchema, rand: () => number): number {
        return Math.floor(rand() * 1000);
    }

    private fakeBoolean(_schema: InternalBooleanSchema, rand: () => number): boolean {
        return rand() > 0.5;
    }

    private fakeNull(_schema: InternalNullSchema): null {
        return null;
    }
}


