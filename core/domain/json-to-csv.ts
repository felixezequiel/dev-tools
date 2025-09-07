import { KeyPathFormatter } from '../interfaces/key-path-formatter';
import { JsonSerializer } from './ports/json-serializer';
import { JsonOutputBuilder } from './ports/json-output-builder';
import { CsvFieldEscaper } from '../infrastructure/csv/csv-escaper';

export class JsonToCsvBuilder implements JsonOutputBuilder<string> {
    private readonly formatter: KeyPathFormatter;
    private readonly serializer: JsonSerializer;
    private readonly escaper: CsvFieldEscaper;

    constructor(params: { formatter: KeyPathFormatter; serializer: JsonSerializer; escaper: CsvFieldEscaper }) {
        this.formatter = params.formatter;
        this.serializer = params.serializer;
        this.escaper = params.escaper;
    }

    build(json: Record<string, any>): string {
        const pairs: Array<[string, unknown]> = [];
        this.walk(json, [], pairs);
        const headers = pairs.map(([k]) => k);
        const values = pairs.map(([, v]) => this.serializeValue(v));
        return `${headers.join(',')}\n${values.join(',')}`;
    }

    private walk(node: any, path: string[], out: Array<[string, unknown]>): void {
        if (node === undefined) return;
        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; i++) {
                this.walk(node[i], [...path, String(i)], out);
            }
            return;
        }
        if (node !== null && typeof node === 'object' && !(typeof File !== 'undefined' && node instanceof File)) {
            for (const key of Object.keys(node)) {
                this.walk(node[key], [...path, key], out);
            }
            return;
        }
        const key = this.formatter.format(path);
        out.push([key, node]);
    }

    private serializeValue(value: unknown): string {
        const v = this.serializer.serialize(value);
        if (v === undefined || v === null) return '';
        const s = typeof v === 'string' ? v : String(v);
        return this.escaper.escape(s);
    }
}


