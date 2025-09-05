import { EntrySource } from '../../domain/entry-source';
import { KeyPathFormatter } from '../../domain/key-path-formatter';
import { DotBracketKeyPathFormatter } from '../key-path/dot-bracket-key-path-formatter';

export class JsonDataEntrySource implements EntrySource<string, unknown> {
    private readonly json: Record<string, any>;
    private readonly formatter: KeyPathFormatter;

    constructor(json: Record<string, any>, formatter: KeyPathFormatter = new DotBracketKeyPathFormatter()) {
        this.json = json;
        this.formatter = formatter;
    }

    getRawJson(): Record<string, any> {
        return this.json;
    }

    entries(): Iterable<[string, unknown]> {
        const out: Array<[string, unknown]> = [];
        this.walk(this.json, [] as string[], out);
        return out;
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
}


