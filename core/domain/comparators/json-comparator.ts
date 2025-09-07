import { DiffEntry, JsonComparator, JsonComparatorOptions } from '../ports/diff';

export class DefaultJsonComparator implements JsonComparator {
    compare(left: unknown, right: unknown, options?: JsonComparatorOptions): DiffEntry[] {
        const opts: Required<JsonComparatorOptions> = {
            ignoreArrayOrder: options?.ignoreArrayOrder ?? false,
            ignoreWhitespaceOnlyChanges: options?.ignoreWhitespaceOnlyChanges ?? true,
            ignoreKeys: options?.ignoreKeys ?? []
        } as any;

        const diffs: DiffEntry[] = [];
        this.diffValue([], left, right, diffs, opts);
        return diffs.filter(d => d.kind !== 'equal');
    }

    private diffValue(path: string[], left: any, right: any, out: DiffEntry[], opts: Required<JsonComparatorOptions>): void {
        if (left === right) {
            out.push({ kind: 'equal', path: this.formatPath(path), left, right });
            return;
        }

        const leftType = this.typeOf(left);
        const rightType = this.typeOf(right);
        if (leftType !== rightType) {
            out.push({ kind: 'type-changed', path: this.formatPath(path), left, right, message: `${leftType} -> ${rightType}` });
            return;
        }

        if (leftType === 'string' && rightType === 'string') {
            const [l, r] = this.maybeNormalizeWhitespace(left as string, right as string, opts);
            if (l !== r) out.push({ kind: 'changed', path: this.formatPath(path), left, right });
            else out.push({ kind: 'equal', path: this.formatPath(path), left, right });
            return;
        }

        if (leftType === 'array') {
            this.diffArray(path, left as any[], right as any[], out, opts);
            return;
        }

        if (leftType === 'object') {
            this.diffObject(path, left as Record<string, any>, right as Record<string, any>, out, opts);
            return;
        }

        // primitive but not strictly equal (number/boolean/null/undefined/symbol)
        out.push({ kind: 'changed', path: this.formatPath(path), left, right });
    }

    private diffObject(path: string[], left: Record<string, any>, right: Record<string, any>, out: DiffEntry[], opts: Required<JsonComparatorOptions>): void {
        const leftKeys = Object.keys(left).filter(k => !opts.ignoreKeys.includes(k)).sort();
        const rightKeys = Object.keys(right).filter(k => !opts.ignoreKeys.includes(k)).sort();

        const all = Array.from(new Set([...leftKeys, ...rightKeys])).sort();
        for (const key of all) {
            const nextPath = [...path, key];
            if (!leftKeys.includes(key)) {
                out.push({ kind: 'added', path: this.formatPath(nextPath), right: right[key] });
                continue;
            }
            if (!rightKeys.includes(key)) {
                out.push({ kind: 'removed', path: this.formatPath(nextPath), left: left[key] });
                continue;
            }
            this.diffValue(nextPath, left[key], right[key], out, opts);
        }
    }

    private diffArray(path: string[], left: any[], right: any[], out: DiffEntry[], opts: Required<JsonComparatorOptions>): void {
        if (!opts.ignoreArrayOrder) {
            const len = Math.max(left.length, right.length);
            for (let i = 0; i < len; i++) {
                const nextPath = [...path, String(i)];
                if (i >= left.length) {
                    out.push({ kind: 'added', path: this.formatPath(nextPath), right: right[i] });
                    continue;
                }
                if (i >= right.length) {
                    out.push({ kind: 'removed', path: this.formatPath(nextPath), left: left[i] });
                    continue;
                }
                this.diffValue(nextPath, left[i], right[i], out, opts);
            }
            return;
        }

        // ignoreArrayOrder: compare using multiset approach for primitives, and object signature for objects
        const usedRight = new Set<number>();
        for (let i = 0; i < left.length; i++) {
            const lval = left[i];
            let matched = false;
            for (let j = 0; j < right.length; j++) {
                if (usedRight.has(j)) continue;
                if (this.deepEqual(lval, right[j], opts)) {
                    usedRight.add(j);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                out.push({ kind: 'removed', path: this.formatPath([...path, String(i)]), left: lval });
            }
        }
        for (let j = 0; j < right.length; j++) {
            if (!usedRight.has(j)) {
                out.push({ kind: 'added', path: this.formatPath([...path, String(j)]), right: right[j] });
            }
        }
    }

    private deepEqual(a: any, b: any, opts: Required<JsonComparatorOptions>): boolean {
        const diffs: DiffEntry[] = [];
        this.diffValue([], a, b, diffs, opts);
        return diffs.every(d => d.kind === 'equal');
    }

    private maybeNormalizeWhitespace(a: string, b: string, opts: Required<JsonComparatorOptions>): [string, string] {
        if (!opts.ignoreWhitespaceOnlyChanges) return [a, b];
        const na = a.trim() === '' ? '' : a;
        const nb = b.trim() === '' ? '' : b;
        return [na, nb];
    }

    private typeOf(v: any): 'null' | 'undefined' | 'number' | 'string' | 'boolean' | 'array' | 'object' {
        if (v === null) return 'null';
        if (v === undefined) return 'undefined';
        if (Array.isArray(v)) return 'array';
        const t = typeof v;
        if (t === 'number' || t === 'string' || t === 'boolean') return t;
        return 'object';
    }

    private formatPath(segments: string[]): string {
        if (segments.length === 0) return '';
        return segments.map(s => (s.match(/^\d+$/) ? `[${s}]` : (s.includes('.') ? `['${s}']` : (segments[0] === s ? s : `.${s}`)))).join('').replace(/^\./, '');
    }
}


