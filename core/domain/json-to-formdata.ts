import { KeyPathFormatter } from '../interfaces/key-path-formatter';
import { JsonSerializer } from './ports/json-serializer';
import { JsonOutputBuilder } from './ports/json-output-builder';

export class JsonToFormDataBuilder implements JsonOutputBuilder<FormData> {
    private readonly formatter: KeyPathFormatter;
    private readonly serializer: JsonSerializer;

    constructor(params: { formatter: KeyPathFormatter; serializer: JsonSerializer }) {
        this.formatter = params.formatter;
        this.serializer = params.serializer;
    }

    build(json: Record<string, any>): FormData {
        const fd = new FormData();
        this.walk(json, [], fd);
        return fd;
    }

    private walk(node: any, path: string[], fd: FormData): void {
        if (node === undefined) return;
        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; i++) {
                this.walk(node[i], [...path, String(i)], fd);
            }
            return;
        }
        if (node !== null && typeof node === 'object' && !(node instanceof File)) {
            for (const key of Object.keys(node)) {
                this.walk(node[key], [...path, key], fd);
            }
            return;
        }
        const key = this.formatter.format(path);
        const serialized = this.serializer.serialize(node);
        if (serialized !== undefined && serialized !== null) {
            fd.append(key, serialized);
        }
    }
}


