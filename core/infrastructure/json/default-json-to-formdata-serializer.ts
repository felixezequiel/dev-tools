import { JsonSerializer } from '../../domain/ports/json-serializer';

export class DefaultJsonToFormDataSerializer implements JsonSerializer {
    serialize(value: unknown): FormDataEntryValue | null | undefined {
        if (value === null) return 'null';
        if (value instanceof File) return value;
        if (typeof value === 'boolean') return value ? 'true' : 'false';
        if (Array.isArray(value) && value.length === 0) return '[]';
        if (typeof value === 'object') return JSON.stringify(value as any);
        if (value === undefined) return undefined;
        return String(value);
    }
}


